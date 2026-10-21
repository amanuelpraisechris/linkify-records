import { supabase } from '@/integrations/supabase/client';

export interface PriorConsent {
  id: string;
  name: string;
  facility: string | null;
  patientId: string | null;
  consentDate: string | null;
  consentType: string | null;
}

/** Looks up prior consented clinic visits (never the HDSS census). */
export async function findPriorConsent(query: string): Promise<PriorConsent[]> {
  const q = query.trim().replace(/[%,()]/g, '');
  if (q.length < 3) return [];
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from('clinic_records')
    .select('id, first_name, middle_name, patient_id, health_facility, consent_date, consent_type, phone_number, telephone, created_at')
    .eq('consent_obtained', true)
    .or(`patient_id.ilike.${like},phone_number.ilike.${like},telephone.ilike.${like},first_name.ilike.${like},identifiers::text.ilike.${like}`)
    .order('created_at', { ascending: false })
    .limit(5);
  if (error || !data) return [];
  return data.map(r => ({
    id: r.id,
    name: [r.first_name, r.middle_name].filter(Boolean).join(' '),
    facility: r.health_facility,
    patientId: r.patient_id,
    consentDate: r.consent_date,
    consentType: r.consent_type,
  }));
}
