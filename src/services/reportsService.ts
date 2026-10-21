import { supabase } from '@/integrations/supabase/client';
import type { ClinicRow, MatchRow } from '@/utils/reportMetrics';

export interface ReportData {
  clinic: ClinicRow[];
  matches: MatchRow[];
  history: { id: string; source_id: string; candidate_id: string | null; decision: string; reason: string | null; collector_name: string; created_at: string }[];
}

async function fetchAll<T>(table: 'clinic_records' | 'match_results' | 'match_decision_history', cols: string, from?: string, to?: string, dateCol = 'created_at'): Promise<T[]> {
  const out: T[] = [];
  for (let page = 0; page < 50; page++) {
    let q = supabase.from(table).select(cols).range(page * 1000, page * 1000 + 999);
    if (from) q = q.gte(dateCol, from);
    if (to) q = q.lte(dateCol, to + 'T23:59:59');
    const { data, error } = await q;
    if (error) throw error;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

export const loadReportData = async (from?: string, to?: string): Promise<ReportData> => {
  const [clinic, matches, history] = await Promise.all([
    fetchAll<ClinicRow>('clinic_records', 'id,patient_id,sex,birth_date,tabia,village,kushet,health_facility,visit_type,never_in_dss,consent_obtained,consent_type,first_name,middle_name,last_name,mother_name,created_at', from, to),
    fetchAll<MatchRow>('match_results', 'id,source_id,match_id,status,confidence,matched_by,matched_at,notes,field_scores,user_id', from, to, 'matched_at'),
    fetchAll<ReportData['history'][number]>('match_decision_history', 'id,source_id,candidate_id,decision,reason,collector_name,created_at', from, to),
  ]);
  return { clinic, matches, history };
};

export const logExport = async (exportType: string, filters: Record<string, unknown>, rowCount: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('export_log').insert({ user_id: user.id, export_type: exportType, filters, row_count: rowCount });
};
