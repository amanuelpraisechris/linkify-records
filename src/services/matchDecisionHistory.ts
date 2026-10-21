import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { MatchResult } from '@/types';

export type MatchDecisionEntry = Tables<'match_decision_history'>;

export function decisionForStatus(status: MatchResult['status']) {
  switch (status) {
    case 'matched': return 'confirmed';
    case 'rejected': return 'no-match';
    case 'manual-review': return 'review';
  }
}

export async function loadDecisionHistory(offset = 0) {
  const { data, error } = await supabase.from('match_decision_history')
    .select('*').order('created_at', { ascending: false }).order('id')
    .range(offset, offset + 49);
  if (error) throw error;
  return data ?? [];
}