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
