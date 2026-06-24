import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function checkPassword(password: string) {
  const { ADMIN_PASSWORD } = await import("./admin-config.server");
  if (password !== ADMIN_PASSWORD) throw new Error("Mot de passe invalide");
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ password: z.string() }).parse(data))
  .handler(async ({ data }) => {
    await checkPassword(data.password);
    return { ok: true };
  });

export const listAppointments = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ password: z.string() }).parse(data))
  .handler(async ({ data }) => {
    await checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const listLeads = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ password: z.string() }).parse(data))
  .handler(async ({ data }) => {
    await checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("landing_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({
      password: z.string(),
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    await checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ password: z.string(), id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    await checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("appointments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getIdCardUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ password: z.string(), path: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    await checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin
      .storage.from("id-cards")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });
