import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const appointmentSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  wilaya: z.string().min(1).max(100),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  service: z.string().min(1).max(100),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().min(1).max(20),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  id_card_recto_path: z.string().min(1),
  id_card_verso_path: z.string().optional().or(z.literal("")),
});

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => appointmentSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        wilaya: data.wilaya,
        city: data.city || null,
        service: data.service,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        notes: data.notes || null,
        id_card_recto_path: data.id_card_recto_path,
        id_card_verso_path: data.id_card_verso_path || null,
        status: "confirmed", // upload requis = confirmé
        whatsapp_sent: true,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

const leadSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  source: z.string().max(50).optional().or(z.literal("")),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("landing_leads").insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      source: data.source || "landing",
      whatsapp_sent: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
