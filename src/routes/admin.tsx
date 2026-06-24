import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock, LogOut, Download, Trash2, Eye, CheckCircle2, Clock, XCircle,
  RefreshCw, FileSpreadsheet, Phone, Mail, MapPin, Calendar,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import * as XLSX from "xlsx";

import {
  verifyAdmin, listAppointments, listLeads,
  updateAppointmentStatus, deleteAppointment, getIdCardUrl,
} from "@/lib/admin.functions";
import { WHATSAPP_NUMBER } from "@/lib/wilayas";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Noren Grooming" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Appointment = {
  id: string; full_name: string; phone: string; email: string | null;
  wilaya: string; city: string | null; service: string;
  appointment_date: string; appointment_time: string; notes: string | null;
  id_card_recto_path: string; id_card_verso_path: string | null;
  status: string; whatsapp_sent: boolean; created_at: string;
};
type Lead = {
  id: string; full_name: string; phone: string; email: string | null;
  message: string | null; source: string | null; created_at: string;
};

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"rdv" | "leads">("rdv");

  useEffect(() => {
    const stored = sessionStorage.getItem("noren_admin_pwd");
    if (stored) {
      setPassword(stored);
      setAuthed(true);
    }
  }, []);

  if (!authed) return <LoginScreen onAuth={(p) => { setPassword(p); setAuthed(true); sessionStorage.setItem("noren_admin_pwd", p); }} />;

  return (
    <div className="min-h-screen bg-background">
      <Toaster theme="dark" position="top-right" richColors />
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="" className="h-10 w-10 object-contain" />
            <div>
              <div className="font-display font-bold text-gold">NOREN ADMIN</div>
              <div className="text-xs text-muted-foreground">Panneau de gestion</div>
            </div>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("noren_admin_pwd"); setAuthed(false); setPassword(""); }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-gold"
          ><LogOut className="h-4 w-4" /> Déconnexion</button>
        </div>
        <div className="mx-auto max-w-7xl px-6 flex gap-2">
          {(["rdv", "leads"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t === "rdv" ? "Rendez-vous" : "Messages Landing"}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {tab === "rdv" ? <AppointmentsPanel password={password} /> : <LeadsPanel password={password} />}
      </main>
    </div>
  );
}

function LoginScreen({ onAuth }: { onAuth: (p: string) => void }) {
  const verify = useServerFn(verifyAdmin);
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await verify({ data: { password: pwd } });
      onAuth(pwd);
    } catch {
      toast.error("Mot de passe incorrect");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 grain relative">
      <Toaster theme="dark" position="top-center" richColors />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-10 shadow-card relative z-10"
      >
        <div className="text-center mb-8">
          <img src={logoImg} alt="" className="h-16 w-16 mx-auto object-contain mb-4 animate-float" />
          <h1 className="font-display text-3xl font-bold text-gold">Panneau Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">Noren Grooming · Accès restreint</p>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Mot de passe</span>
          <div className="mt-2 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </div>
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-50">
          {loading ? "Vérification..." : "Entrer"}
        </button>
      </motion.form>
    </div>
  );
}

function AppointmentsPanel({ password }: { password: string }) {
  const list = useServerFn(listAppointments);
  const updateStatus = useServerFn(updateAppointmentStatus);
  const del = useServerFn(deleteAppointment);
  const getUrl = useServerFn(getIdCardUrl);

  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function reload() {
    setLoading(true);
    try {
      const rows = await list({ data: { password } });
      setItems(rows as Appointment[]);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
    finally { setLoading(false); }
  }
  useEffect(() => { reload(); }, []);

  async function setStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled") {
    try {
      await updateStatus({ data: { password, id, status } });
      setItems((p) => p.map((x) => x.id === id ? { ...x, status } : x));
      toast.success("Statut mis à jour");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce RDV ?")) return;
    try {
      await del({ data: { password, id } });
      setItems((p) => p.filter((x) => x.id !== id));
      toast.success("Supprimé");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
  }

  async function viewCard(path: string) {
    try {
      const { url } = await getUrl({ data: { password, path } });
      window.open(url, "_blank");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
  }

  function sendWA(a: Appointment) {
    const msg = encodeURIComponent(
      `RDV NOREN — ${a.full_name}\n📞 ${a.phone}\n📍 ${a.wilaya}${a.city ? " · " + a.city : ""}\n✂️ ${a.service}\n📅 ${a.appointment_date} ${a.appointment_time}\nStatut: ${a.status}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  function exportExcel() {
    const data = filtered.map((a) => ({
      Nom: a.full_name, Téléphone: a.phone, Email: a.email || "",
      Wilaya: a.wilaya, Commune: a.city || "", Service: a.service,
      Date: a.appointment_date, Heure: a.appointment_time,
      Statut: a.status, Notes: a.notes || "",
      "Carte recto": a.id_card_recto_path, "Carte verso": a.id_card_verso_path || "",
      "Créé le": new Date(a.created_at).toLocaleString("fr-FR"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rendez-vous");
    XLSX.writeFile(wb, `noren-rdv-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Export Excel téléchargé");
  }

  const filtered = filter === "all" ? items : items.filter((x) => x.status === filter);
  const stats = {
    all: items.length,
    pending: items.filter((x) => x.status === "pending").length,
    confirmed: items.filter((x) => x.status === "confirmed").length,
    completed: items.filter((x) => x.status === "completed").length,
    cancelled: items.filter((x) => x.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {([
          ["all", "Tous", stats.all], ["pending", "En attente", stats.pending],
          ["confirmed", "Confirmés", stats.confirmed], ["completed", "Terminés", stats.completed],
          ["cancelled", "Annulés", stats.cancelled],
        ] as const).map(([k, l, n]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`rounded-xl border p-4 text-left transition-colors ${filter === k ? "border-gold bg-gold/10" : "border-border bg-card hover:border-gold/50"}`}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="font-display text-3xl font-bold mt-1">{n}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">{filtered.length} rendez-vous</h2>
        <div className="flex gap-2">
          <button onClick={reload} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-gold">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
          <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold">
            <FileSpreadsheet className="h-4 w-4" /> Exporter Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground rounded-2xl border border-border bg-card">Aucun rendez-vous.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => <AppointmentCard key={a.id} a={a} onStatus={setStatus} onDelete={remove} onView={viewCard} onWA={sendWA} />)}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ a, onStatus, onDelete, onView, onWA }: {
  a: Appointment;
  onStatus: (id: string, s: "pending" | "confirmed" | "completed" | "cancelled") => void;
  onDelete: (id: string) => void;
  onView: (path: string) => void;
  onWA: (a: Appointment) => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    completed: "bg-green-500/20 text-green-300 border-green-500/40",
    cancelled: "bg-red-500/20 text-red-300 border-red-500/40",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-[250px]">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-display text-xl font-bold">{a.full_name}</h3>
            <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${statusColors[a.status] || ""}`}>{a.status}</span>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold" /> {a.phone}</div>
            {a.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gold" /> {a.email}</div>}
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> {a.wilaya}{a.city ? ` · ${a.city}` : ""}</div>
            <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-gold" /> {a.appointment_date} · {a.appointment_time}</div>
            <div className="sm:col-span-2"><span className="text-gold font-medium">{a.service}</span>{a.notes ? ` — ${a.notes}` : ""}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <button onClick={() => onView(a.id_card_recto_path)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:border-gold">
            <Eye className="h-3.5 w-3.5" /> CN Recto
          </button>
          {a.id_card_verso_path && (
            <button onClick={() => onView(a.id_card_verso_path!)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:border-gold">
              <Eye className="h-3.5 w-3.5" /> CN Verso
            </button>
          )}
          <button onClick={() => onWA(a)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:border-gold">
            <Phone className="h-3.5 w-3.5" /> WhatsApp
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
        <select value={a.status} onChange={(e) => onStatus(a.id, e.target.value as "pending")} className="rounded-full border border-border bg-input px-3 py-1.5 text-xs focus:outline-none focus:border-gold">
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
        <button onClick={() => onDelete(a.id)} className="inline-flex items-center gap-1 rounded-full border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10 ml-auto">
          <Trash2 className="h-3.5 w-3.5" /> Supprimer
        </button>
      </div>
    </motion.div>
  );
}

function LeadsPanel({ password }: { password: string }) {
  const list = useServerFn(listLeads);
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      const rows = await list({ data: { password } });
      setItems(rows as Lead[]);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
    finally { setLoading(false); }
  }
  useEffect(() => { reload(); }, []);

  function exportExcel() {
    const data = items.map((l) => ({
      Nom: l.full_name, Téléphone: l.phone, Email: l.email || "",
      Message: l.message || "", Source: l.source || "",
      "Reçu le": new Date(l.created_at).toLocaleString("fr-FR"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Messages");
    XLSX.writeFile(wb, `noren-messages-${new Date().toISOString().split("T")[0]}.xlsx`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">{items.length} messages</h2>
        <div className="flex gap-2">
          <button onClick={reload} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-gold">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
          <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold">
            <FileSpreadsheet className="h-4 w-4" /> Exporter Excel
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground rounded-2xl border border-border bg-card">Aucun message.</div>
      ) : (
        <div className="space-y-3">
          {items.map((l) => (
            <div key={l.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-display text-lg font-bold">{l.full_name}</h3>
                <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("fr-FR")}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                <span><Phone className="h-3 w-3 inline mr-1 text-gold" />{l.phone}</span>
                {l.email && <span><Mail className="h-3 w-3 inline mr-1 text-gold" />{l.email}</span>}
              </div>
              {l.message && <p className="mt-3 text-sm">{l.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
