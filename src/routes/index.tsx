import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Scissors, Sparkles, MapPin, Phone, Calendar as CalIcon, Upload,
  CheckCircle2, ShieldCheck, Crown, Clock, Star, ChevronRight,
  Home as HomeIcon, Building2, Hotel, Quote, MessageCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import heroImg from "@/assets/hero-barber.jpg";
import toolsImg from "@/assets/tools.jpg";
import salonImg from "@/assets/salon.jpg";
import logoImg from "@/assets/logo.png";
import founderImg from "@/assets/founder.jpg";
import heroVideo from "@/assets/hero-loop.mp4.asset.json";
import toolsVideo from "@/assets/tools-loop.mp4.asset.json";

import { WILAYAS, SERVICES, TIME_SLOTS, WHATSAPP_NUMBER } from "@/lib/wilayas";
import { createAppointment, submitLead } from "@/lib/booking.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noren Grooming — Prise de RDV Premium en Algérie" },
      { name: "description", content: "Réservez votre rendez-vous barbier premium chez Noren Grooming. Service dans 69 wilayas et zones. Confirmation WhatsApp immédiate." },
      { property: "og:title", content: "Noren Grooming — L'art du grooming" },
      { property: "og:description", content: "Prise de RDV premium dans 69 zones d'Algérie." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" richColors />
      <Nav />
      <Hero />
      <Services />
      <Pricing />
      <Membership />
      <Founder />
      <Testimonials />
      <Coverage />
      <BookingSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour NOREN Grooming, je souhaite des informations.")}`}
      target="_blank" rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-gold pulse-gold"
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 z-50 w-full backdrop-blur-xl bg-background/40 border-b border-border"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Noren Grooming" className="h-10 w-10 object-contain animate-float" />
          <div>
            <div className="font-display text-lg font-bold tracking-wider text-gold">NOREN</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground -mt-1">GROOMING</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a href="#services" className="hover:text-gold transition-colors">Services</a>
          <a href="#tarifs" className="hover:text-gold transition-colors">Tarifs</a>
          <a href="#membership" className="hover:text-gold transition-colors">Membership</a>
          <a href="#founder" className="hover:text-gold transition-colors">Founder</a>
          <a href="#zones" className="hover:text-gold transition-colors">Zones</a>
          <a href="#rdv" className="hover:text-gold transition-colors">Réserver</a>
        </nav>
        <a
          href="#rdv"
          className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-semibold text-primary-foreground shadow-gold pulse-gold"
        >Prendre RDV</a>
      </div>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden grain">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <video
          src={heroVideo.url}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/40 backdrop-blur px-4 py-1.5 text-xs tracking-widest text-gold">
            <Crown className="h-3 w-3" /> OUARGLA · ALGÉRIE · MOBILE GROOMING
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95]">
            <span className="block">L'art du</span>
            <span className="block text-gold glow-text italic">grooming</span>
            <span className="block">à domicile.</span>
          </h1>
          <p dir="rtl" className="mt-6 font-display text-2xl text-gold/90 leading-snug">
            فن العناية الراقية — يصلك أينما كنت
          </p>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
            NOREN Grooming — Premium Mobile Grooming Service.
            Service à domicile, à l'hôtel ou au bureau. Réservation rapide via WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5"><HomeIcon className="h-3.5 w-3.5 text-gold" /> Home Service</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5"><Hotel className="h-3.5 w-3.5 text-gold" /> Hotel Service</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5"><Building2 className="h-3.5 w-3.5 text-gold" /> Office Service</span>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              href="#rdv"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              Réserver maintenant
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 backdrop-blur px-8 py-4 text-sm font-medium hover:border-gold transition-colors"
            >
              <Phone className="h-4 w-4" /> WhatsApp direct
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
            {[
              { n: "69", l: "Wilayas couvertes" },
              { n: "24/7", l: "Réservation" },
              { n: "100%", l: "Confirmé" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
              >
                <div className="font-display text-4xl font-bold text-gold">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="text-xs tracking-[0.3em] text-muted-foreground mb-2 text-center">SCROLL</div>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}

function Services() {
  const items = [
    { icon: Scissors, title: "Coupe Signature", desc: "Coupe sur-mesure avec finitions précises au rasoir." },
    { icon: Sparkles, title: "Rasage Royal", desc: "Rasage à l'ancienne, serviette chaude, huiles précieuses." },
    { icon: Crown, title: "Soin Premium", desc: "Soin visage complet : gommage, masque, hydratation." },
    { icon: ShieldCheck, title: "Forfait Marié", desc: "Préparation complète pour votre grand jour." },
  ];
  return (
    <section id="services" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— NOS SERVICES —</div>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">
            Une expérience <span className="italic text-gold">d'exception</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl bg-card border border-border p-8 shadow-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/10 group-hover:to-transparent transition-all duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
                  <it.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold">{it.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-24 relative rounded-3xl overflow-hidden h-[400px]"
        >
          <video
            src={toolsVideo.url}
            poster={toolsImg}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="relative h-full flex items-center px-12">
            <div className="max-w-md">
              <div className="text-xs tracking-[0.3em] text-gold">— L'EXCELLENCE —</div>
              <h3 className="mt-4 font-display text-4xl font-bold">Des outils de maîtres, un savoir-faire transmis.</h3>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Coverage() {
  return (
    <section id="zones" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— COUVERTURE NATIONALE —</div>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">
            <span className="text-gold">69</span> wilayas. Une seule exigence.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            De Tamanrasset à Alger, nous opérons sur toute l'Algérie avec la même excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {WILAYAS.map((w, i) => (
            <motion.div
              key={w.code}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (i % 24) * 0.02 }}
              whileHover={{ scale: 1.08, borderColor: "oklch(0.78 0.15 80)" }}
              className="rounded-lg border border-border bg-card/50 px-3 py-2 text-center cursor-default"
            >
              <div className="text-[10px] text-gold font-mono">{w.code}</div>
              <div className="text-xs font-medium truncate">{w.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type BookingForm = {
  full_name: string;
  phone: string;
  email: string;
  wilaya: string;
  city: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
};

function BookingSection() {
  const create = useServerFn(createAppointment);
  const [form, setForm] = useState<BookingForm>({
    full_name: "", phone: "", email: "", wilaya: "", city: "",
    service: SERVICES[0], appointment_date: "", appointment_time: "", notes: "",
  });
  const [recto, setRecto] = useState<File | null>(null);
  const [verso, setVerso] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const upd = (k: keyof BookingForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function uploadFile(file: File, label: string) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${label}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("id-cards").upload(path, file, {
      contentType: file.type, upsert: false,
    });
    if (error) throw new Error(`Upload ${label} échoué: ${error.message}`);
    return path;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recto) {
      toast.error("Carte d'identité requise (recto) pour confirmer le RDV");
      return;
    }
    if (!form.wilaya || !form.appointment_date || !form.appointment_time) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      const rectoPath = await uploadFile(recto, "recto");
      const versoPath = verso ? await uploadFile(verso, "verso") : "";

      await create({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          wilaya: form.wilaya,
          city: form.city,
          service: form.service,
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          notes: form.notes,
          id_card_recto_path: rectoPath,
          id_card_verso_path: versoPath,
        },
      });

      const msg = encodeURIComponent(
        `🌟 NOUVEAU RDV NOREN GROOMING\n\n` +
        `👤 ${form.full_name}\n📞 ${form.phone}\n✉️ ${form.email || "—"}\n` +
        `📍 ${form.wilaya}${form.city ? " · " + form.city : ""}\n` +
        `✂️ ${form.service}\n` +
        `📅 ${form.appointment_date} à ${form.appointment_time}\n` +
        `📝 ${form.notes || "—"}\n\n` +
        `✅ Carte nationale téléversée — RDV CONFIRMÉ`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      setDone(true);
      toast.success("RDV confirmé ! WhatsApp ouvert pour notification.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section id="rdv" className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-2xl text-center rounded-3xl border border-gold bg-card p-12 shadow-gold"
        >
          <CheckCircle2 className="h-20 w-20 text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold">RDV Confirmé !</h2>
          <p className="mt-4 text-muted-foreground">
            Votre demande a été enregistrée et envoyée par WhatsApp à notre équipe.
            Nous vous recontactons rapidement.
          </p>
          <button
            onClick={() => { setDone(false); setForm({ full_name: "", phone: "", email: "", wilaya: "", city: "", service: SERVICES[0], appointment_date: "", appointment_time: "", notes: "" }); setRecto(null); setVerso(null); }}
            className="mt-8 rounded-full border border-gold px-6 py-2 text-sm hover:bg-gold/10 transition-colors"
          >Nouveau RDV</button>
        </motion.div>
      </section>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="rdv" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— RÉSERVATION —</div>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">
            Prenez votre <span className="italic text-gold">rendez-vous</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Téléversement de la carte nationale requis pour confirmer.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-card space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Nom complet *">
              <input required value={form.full_name} onChange={(e) => upd("full_name", e.target.value)} className={inputCls} placeholder="Mohamed Benali" />
            </Field>
            <Field label="Téléphone *">
              <input required type="tel" value={form.phone} onChange={(e) => upd("phone", e.target.value)} className={inputCls} placeholder="0555 12 34 56" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} className={inputCls} placeholder="vous@email.com" />
            </Field>
            <Field label="Service *">
              <select required value={form.service} onChange={(e) => upd("service", e.target.value)} className={inputCls}>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Wilaya *">
              <select required value={form.wilaya} onChange={(e) => upd("wilaya", e.target.value)} className={inputCls}>
                <option value="">— Choisir —</option>
                {WILAYAS.map((w) => <option key={w.code} value={w.name}>{w.code} · {w.name}</option>)}
              </select>
            </Field>
            <Field label="Commune / Quartier">
              <input value={form.city} onChange={(e) => upd("city", e.target.value)} className={inputCls} placeholder="Hydra, Bab Ezzouar..." />
            </Field>
            <Field label="Date *">
              <input required type="date" min={today} value={form.appointment_date} onChange={(e) => upd("appointment_date", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Horaire *">
              <select required value={form.appointment_time} onChange={(e) => upd("appointment_time", e.target.value)} className={inputCls}>
                <option value="">— Choisir —</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Notes (optionnel)">
            <textarea value={form.notes} onChange={(e) => upd("notes", e.target.value)} rows={3} className={inputCls} placeholder="Préférences, demandes particulières..." />
          </Field>

          <div className="rounded-2xl border border-gold/40 bg-gold/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <h3 className="font-display text-lg font-bold">Carte Nationale (obligatoire)</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Sans téléversement de la carte d'identité, le RDV ne pourra pas être confirmé.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <FileUpload label="Recto *" file={recto} onFile={setRecto} required />
              <FileUpload label="Verso (optionnel)" file={verso} onFile={setVerso} />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-gold px-8 py-4 text-base font-semibold text-primary-foreground shadow-gold disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {submitting ? "Envoi en cours..." : (
              <>Confirmer & Envoyer par WhatsApp <ChevronRight className="h-4 w-4" /></>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs tracking-wider text-muted-foreground mb-2 uppercase">{label}</span>
      {children}
    </label>
  );
}

function FileUpload({ label, file, onFile, required }: { label: string; file: File | null; onFile: (f: File | null) => void; required?: boolean }) {
  return (
    <label className="block cursor-pointer">
      <input
        type="file"
        accept="image/*,.pdf"
        required={required}
        onChange={(e) => onFile(e.target.files?.[0] || null)}
        className="hidden"
      />
      <div className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${file ? "border-gold bg-gold/5" : "border-border hover:border-gold"}`}>
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-gold" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-muted-foreground mt-1">Cliquer pour téléverser</div>
          </>
        )}
      </div>
    </label>
  );
}

function ContactSection() {
  const lead = useServerFn(submitLead);
  const [f, setF] = useState({ full_name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await lead({ data: { ...f, source: "landing-contact" } });
      const msg = encodeURIComponent(
        `💬 MESSAGE LANDING PAGE\n\n👤 ${f.full_name}\n📞 ${f.phone}\n✉️ ${f.email || "—"}\n\n${f.message || "—"}`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      toast.success("Message envoyé !");
      setF({ full_name: "", phone: "", email: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      <img src={salonImg} alt="Salon Noren Grooming" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— CONTACTEZ-NOUS —</div>
          <h2 className="mt-4 font-display text-5xl font-bold">Une question ? <span className="italic text-gold">Écrivez-nous.</span></h2>
        </motion.div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card/80 backdrop-blur p-8 space-y-4 shadow-card">
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Nom complet *" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} className={inputCls} />
            <input required type="tel" placeholder="Téléphone *" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inputCls} />
          </div>
          <input type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inputCls} />
          <textarea placeholder="Votre message..." rows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={inputCls} />
          <button disabled={loading} className="w-full rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-50">
            {loading ? "Envoi..." : "Envoyer par WhatsApp"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="" className="h-10 w-10 object-contain" />
          <div>
            <div className="font-display font-bold text-gold">NOREN GROOMING</div>
            <div className="text-xs text-muted-foreground">L'art du grooming · Algérie</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Phone className="h-4 w-4 text-gold" /> +213 668 921 713
        </div>
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Noren Grooming. Tous droits réservés.</div>
      </div>
    </footer>
  );
}

/* ────────── NEW SECTIONS ────────── */

function Pricing() {
  const plans = [
    {
      name: "Adult Premium Grooming",
      ar: "العناية الراقية للرجال",
      price: "2500",
      unit: "DA",
      features: [
        "Coupe professionnelle",
        "Taille & soin de la barbe",
        "Service mobile chez le client",
        "Expérience confortable & premium",
      ],
      featured: true,
    },
    {
      name: "Kids Grooming",
      ar: "حلاقة الأطفال",
      price: "1500 — 2000",
      unit: "DA",
      features: [
        "Tarif selon la distance",
        "Tarif selon l'âge de l'enfant",
        "Service adapté & sécurisé",
        "Ambiance calme et amicale",
      ],
    },
  ];
  return (
    <section id="tarifs" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— TARIFS · الأسعار —</div>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">
            Services & <span className="italic text-gold">tarifs</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl border p-10 shadow-card overflow-hidden ${p.featured ? "border-gold bg-gradient-to-b from-gold/10 to-card" : "border-border bg-card"}`}
            >
              {p.featured && (
                <div className="absolute top-5 right-5 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold tracking-widest text-primary-foreground">
                  POPULAIRE
                </div>
              )}
              <div className="text-xs tracking-[0.3em] text-muted-foreground">{p.ar}</div>
              <h3 className="mt-2 font-display text-3xl font-bold">{p.name}</h3>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl font-bold text-gold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#rdv" className="mt-10 block w-full text-center rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold">
                Réserver ce service
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Membership() {
  const perks = [
    "Priorité sur les rendez-vous",
    "Suivi régulier de votre style",
    "Plus de flexibilité de réservation",
    "Offres & avantages exclusifs",
    "Service mobile à domicile, hôtel ou bureau",
  ];
  return (
    <section id="membership" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— ABONNEMENTS MENSUELS —</div>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">
            NOREN <span className="italic text-gold">Membership</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Pour nos clients qui souhaitent maintenir un look impeccable en permanence,
            nous proposons des programmes d'abonnement mensuels flexibles, adaptés à chaque profil.
          </p>
          <p dir="rtl" className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            برامج اشتراك شهرية مرنة تتناسب مع احتياجات كل عميل.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-gold/40 bg-card/60 backdrop-blur p-10 shadow-gold"
        >
          <ul className="grid sm:grid-cols-2 gap-4">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-8">
            <div>
              <div className="font-display text-xl font-bold">Programme sur-mesure</div>
              <div className="text-sm text-muted-foreground">Contactez-nous pour découvrir la formule adaptée.</div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour NOREN, je souhaite des informations sur l'abonnement mensuel Membership.")}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              <MessageCircle className="h-4 w-4" /> Demander un programme
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section id="founder" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-gold opacity-30 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-gold/40 shadow-gold">
            <img
              src={founderImg}
              alt="Abderrahmane Souici — Founder NOREN Grooming"
              width={1024}
              height={1280}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs tracking-[0.3em] text-gold">FOUNDER</div>
              <div className="font-display text-2xl font-bold mt-1">Abderrahmane Souici</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <div className="text-xs tracking-[0.3em] text-gold">— LE FONDATEUR · المؤسس —</div>
          <h2 className="mt-4 font-display text-5xl font-bold">
            <span className="text-gold italic">Abderrahmane</span> Souici
          </h2>
          <div className="mt-3 text-sm tracking-widest text-muted-foreground uppercase">
            Founder & Mobile Grooming Specialist
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Passionné par l'art du grooming et obsédé par le détail, Abderrahmane a fondé NOREN
            pour redéfinir l'expérience du barbier en Algérie : un service mobile, premium et
            personnalisé, qui vient à vous — chez vous, à l'hôtel, ou au bureau.
          </p>
          <p dir="rtl" className="mt-4 text-muted-foreground leading-relaxed">
            مؤسس NOREN، شغفه بفن العناية والاهتمام بالتفاصيل دفعه لإنشاء خدمة حلاقة متنقلة راقية
            تأتي إليك أينما كنت — في المنزل، الفندق، أو مكان العمل.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-sm hover:bg-gold/10 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-gold" /> Contacter le fondateur
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Yacine B.", city: "Ouargla", rating: 5, text: "Service impeccable, à l'heure et très professionnel. La meilleure coupe que j'ai eue à domicile." },
    { name: "Karim H.", city: "Hôtel Mehri", rating: 5, text: "Je voyage souvent — qu'ils viennent à l'hôtel change tout. Qualité premium et hygiène irréprochable." },
    { name: "Sami M.", city: "Bureau · Hassi Messaoud", rating: 5, text: "Abonné depuis 3 mois. Discipline, ponctualité et un vrai sens du détail. Je recommande." },
    { name: "Walid A.", city: "Ouargla", rating: 5, text: "Coupe pour mon fils — patient, doux, parfait. On ne change plus." },
  ];
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grain" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="text-xs tracking-[0.3em] text-gold">— TÉMOIGNAGES · آراء العملاء —</div>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">
            Ils nous ont <span className="italic text-gold">confiés</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gold/30" />
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-4 text-base leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-gold inline-flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.city}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
