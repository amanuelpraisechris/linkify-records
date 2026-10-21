import { describe, it, expect } from 'vitest';
import { summarize, bandFor, matchExportRows, toPercent } from '@/utils/reportMetrics';

const clinic = [
  { id: 'a', never_in_dss: false, consent_obtained: true, first_name: 'Abeba' },
  { id: 'b', never_in_dss: false, consent_obtained: true },
  { id: 'c', never_in_dss: true, consent_obtained: true },
];
const matches = [
  { id: '1', source_id: 'a', status: 'matched', confidence: 0.9, matched_by: 'x', matched_at: '2026-01-01' },
  { id: '2', source_id: 'b', status: 'rejected', confidence: 0.2, matched_by: 'x', matched_at: '2026-01-01' },
  { id: '3', source_id: 'c', status: 'matched', confidence: 0.85, matched_by: 'x', matched_at: '2026-01-01' },
];

describe('report metrics', () => {
  it('match rate counts residents only', () => {
    expect(summarize(clinic, matches).matchRateResidents).toBe(50);
  });
  it('uses the latest decision per record', () => {
    const s = summarize(clinic, [...matches, { id: '4', source_id: 'b', status: 'matched', confidence: 0.8, matched_by: 'x', matched_at: '2026-02-01' }]);
    expect(s.matchRateResidents).toBe(100);
  });
  it('bands scores at 80 and 40', () => {
    expect(bandFor(80)).toBe('high');
    expect(bandFor(79.9)).toBe('review');
    expect(bandFor(40)).toBe('review');
    expect(bandFor(39.9)).toBe('no-match');
    expect(toPercent(0.5)).toBe(50);
  });
  it('de-identified export leaves names out', () => {
    const rows = matchExportRows(clinic, matches, true);
    expect(JSON.stringify(rows)).not.toContain('Abeba');
    expect(rows[0]).not.toHaveProperty('source_id');
    expect(JSON.stringify(matchExportRows(clinic, matches, false))).toContain('Abeba');
  });
});

import { cascade, repeatRate, rankDistribution } from '@/utils/reportMetrics';
describe('Rentsch-style metrics', () => {
  it('cascade gives each step as % of the step before', () => {
    const c = cascade(clinic, matches);
    expect(c.map(s => s.n)).toEqual([3, 3, 2, 2, 1]);
    expect(c[4].pctOfPrev).toBe(50);
  });
  it('repeat rate counts extra visits by the same patient', () => {
    const cl = [{ id: 'v1', patient_id: 'P' }, { id: 'v2', patient_id: 'P' }, { id: 'v3', patient_id: 'Q' }];
    const ms = ['v1', 'v2', 'v3'].map((s, i) => ({ id: s, source_id: s, match_id: i < 2 ? 'H1' : 'H2', status: 'matched', confidence: 0.9, matched_by: 'x', matched_at: '2026-01-01' }));
    const r = repeatRate(cl, ms);
    expect(r.repeatVisits).toBe(1);
    expect(r.linkedVisits).toBe(3);
    expect(r.consistentPct).toBe(100);
  });
  it('rank distribution reads the saved candidate rank', () => {
    const ms = [1, 3, 8, 0].map((r, i) => ({ id: String(i), source_id: String(i), status: 'matched', confidence: 0.9, matched_by: 'x', matched_at: '2026', field_scores: r ? { _rank: r } : {} }));
    expect(rankDistribution(ms)).toEqual({ first: 1, top5: 1, beyond: 1, unknown: 1 });
  });
});
