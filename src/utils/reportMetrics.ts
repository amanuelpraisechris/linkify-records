export type Band = 'high' | 'review' | 'no-match';

export interface ClinicRow {
  id: string; patient_id?: string | null; sex?: string | null; birth_date?: string | null;
  tabia?: string | null; village?: string | null; health_facility?: string | null; visit_type?: string | null;
  never_in_dss?: boolean | null; consent_obtained?: boolean | null; consent_type?: string | null;
  first_name?: string | null; middle_name?: string | null; last_name?: string | null; mother_name?: string | null;
  kushet?: string | null; created_at?: string | null;
  identifiers?: unknown; year_moved_in?: string | null; user_id?: string | null;
}
export interface MatchRow {
  id: string; source_id: string; match_id?: string | null; status: string; confidence: number;
  matched_by: string; matched_at: string; notes?: string | null; field_scores?: unknown; user_id?: string | null;
}

/** Confidence may be saved as 0–1 or 0–100; always return a 0–100 value. */
export const toPercent = (c: number) => (c <= 1 ? c * 100 : c);

export const bandFor = (pct: number, high = 80, noMatch = 40): Band =>
  pct >= high ? 'high' : pct < noMatch ? 'no-match' : 'review';

export const ageGroup = (birthDate?: string | null, now = new Date()): string => {
  const y = birthDate ? parseInt(birthDate.slice(0, 4), 10) : NaN;
  if (!y) return 'Unknown';
  const age = now.getFullYear() - y;
  if (age < 5) return '0–4';
  if (age < 15) return '5–14';
  if (age < 25) return '15–24';
  if (age < 35) return '25–34';
  if (age < 50) return '35–49';
  return '50+';
};

/** Latest decision per clinic record (one patient = one outcome). */
export const latestByRecord = (matches: MatchRow[]) => {
  const m = new Map<string, MatchRow>();
  for (const r of matches) {
    const prev = m.get(r.source_id);
    if (!prev || r.matched_at > prev.matched_at) m.set(r.source_id, r);
  }
  return m;
};

export interface Summary {
  total: number; consented: number; refused: number; residents: number; nonResidents: number;
  matched: number; noMatch: number; review: number; pending: number; matchRateResidents: number;
}

export const summarize = (clinic: ClinicRow[], matches: MatchRow[]): Summary => {
  const latest = latestByRecord(matches);
  const key = (c: ClinicRow) => (latest.has(c.id) ? c.id : c.patient_id || c.id);
  let matched = 0, noMatch = 0, review = 0, residentsMatched = 0;
  const residents = clinic.filter(c => !c.never_in_dss);
  for (const c of clinic) {
    const d = latest.get(c.id) || (c.patient_id ? latest.get(c.patient_id) : undefined);
    if (!d) continue;
    if (d.status === 'matched') { matched++; if (!c.never_in_dss) residentsMatched++; }
    else if (d.status === 'rejected') noMatch++;
    else review++;
    void key;
  }
  return {
    total: clinic.length,
    consented: clinic.filter(c => c.consent_obtained).length,
    refused: clinic.filter(c => c.consent_type === 'refused').length,
    residents: residents.length,
    nonResidents: clinic.length - residents.length,
    matched, noMatch, review,
    pending: clinic.length - matched - noMatch - review,
    matchRateResidents: residents.length ? Math.round((residentsMatched / residents.length) * 1000) / 10 : 0,
  };
};

export const decisionFor = (clinic: ClinicRow, latest: Map<string, MatchRow>) =>
  latest.get(clinic.id) || (clinic.patient_id ? latest.get(clinic.patient_id) : undefined);

/** Match rate among residents, grouped by an attribute. */
export const rateBy = (clinic: ClinicRow[], matches: MatchRow[], group: (c: ClinicRow) => string) => {
  const latest = latestByRecord(matches);
  const out = new Map<string, { n: number; matched: number }>();
  for (const c of clinic.filter(c => !c.never_in_dss)) {
    const g = group(c) || 'Unknown';
    const o = out.get(g) || { n: 0, matched: 0 };
    o.n++;
    if (decisionFor(c, latest)?.status === 'matched') o.matched++;
    out.set(g, o);
  }
  return [...out.entries()].map(([group, o]) => ({ group, n: o.n, matched: o.matched, rate: Math.round((o.matched / o.n) * 1000) / 10 }))
    .sort((a, b) => b.n - a.n);
};

export const bandCounts = (matches: MatchRow[], high = 80, noMatch = 40) => {
  const c = { high: 0, review: 0, 'no-match': 0 } as Record<Band, number>;
  matches.forEach(m => c[bandFor(toPercent(m.confidence), high, noMatch)]++);
  return c;
};

export const histogram = (matches: MatchRow[]) => {
  const bins = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10}–${i * 10 + 9}`, count: 0 }));
  matches.forEach(m => bins[Math.min(9, Math.floor(toPercent(m.confidence) / 10))].count++);
  return bins;
};

const FIELD_LABELS: Record<string, string> = {
  firstName: 'Given name', middleName: "Father's name", lastName: "Grandfather's name",
  birthYear: 'Birth year', gender: 'Sex', village: 'Tabia', subVillage: 'Kushet', motherName: "Mother's name",
};
export const fieldAgreement = (matches: MatchRow[]) => {
  const t = new Map<string, { agree: number; n: number }>();
  for (const m of matches.filter(m => m.status === 'matched')) {
    let fs = m.field_scores as Record<string, unknown> | string | null | undefined;
    if (typeof fs === 'string') { try { fs = JSON.parse(fs); } catch { fs = null; } }
    if (!fs || typeof fs !== 'object') continue;
    for (const [k, v] of Object.entries(fs)) {
      if (k.startsWith('_')) continue;
      const num = typeof v === 'number' ? v : typeof v === 'object' && v ? Number((v as { score?: number }).score) : NaN;
      if (Number.isNaN(num)) continue;
      const o = t.get(k) || { agree: 0, n: 0 };
      o.n++; if (num > 0) o.agree++;
      t.set(k, o);
    }
  }
  return [...t.entries()].map(([k, o]) => ({ field: FIELD_LABELS[k] || k, rate: Math.round((o.agree / o.n) * 100), n: o.n }));
};

export const collectorActivity = (history: { collector_name: string; decision: string; reason?: string | null }[]) => {
  const t = new Map<string, { total: number; review: number; withReason: number }>();
  for (const h of history) {
    const o = t.get(h.collector_name) || { total: 0, review: 0, withReason: 0 };
    o.total++; if (h.decision === 'review') o.review++; if (h.reason) o.withReason++;
    t.set(h.collector_name, o);
  }
  return [...t.entries()].map(([name, o]) => ({ name, ...o })).sort((a, b) => b.total - a.total);
};

const COMPLETENESS_FIELDS: (keyof ClinicRow)[] = ['first_name', 'middle_name', 'last_name', 'sex', 'birth_date', 'tabia', 'kushet', 'mother_name', 'health_facility'];
export const completeness = (clinic: ClinicRow[]) => {
  if (!clinic.length) return 0;
  let filled = 0;
  clinic.forEach(c => COMPLETENESS_FIELDS.forEach(f => { if (c[f] !== null && c[f] !== undefined && String(c[f]).trim() !== '') filled++; }));
  return Math.round((filled / (clinic.length * COMPLETENESS_FIELDS.length)) * 100);
};

/** Stable short code from an ID — no names leave the app when de-identified. */
export const pseudoId = (id: string) => {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 'L' + (h >>> 0).toString(36).toUpperCase().padStart(7, '0');
};

const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
export const toCSV = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
};

export const matchExportRows = (
  clinic: ClinicRow[], matches: MatchRow[], deidentify: boolean, high = 80, noMatch = 40,
) => {
  const byId = new Map<string, ClinicRow>();
  clinic.forEach(c => { byId.set(c.id, c); if (c.patient_id) byId.set(c.patient_id, c); });
  return matches.map(m => {
    const c = byId.get(m.source_id);
    const pct = Math.round(toPercent(m.confidence) * 10) / 10;
    const base: Record<string, unknown> = {
      linkage_id: pseudoId(m.source_id),
      hdss_candidate: deidentify ? (m.match_id ? pseudoId(m.match_id) : '') : m.match_id ?? '',
      facility: c?.health_facility ?? '', tabia: c?.tabia || c?.village || '', visit_type: c?.visit_type ?? '',
      sex: c?.sex ?? '', age_group: ageGroup(c?.birth_date),
      score_pct: pct, band: bandFor(pct, high, noMatch), decision: m.status,
      decided_by: m.matched_by, decided_at: m.matched_at, reason: m.notes ?? '',
    };
    if (!deidentify) {
      Object.assign(base, {
        source_id: m.source_id, given_name: c?.first_name ?? '', father_name: c?.middle_name ?? '',
        grandfather_name: c?.last_name ?? '', birth_date: c?.birth_date ?? '',
      });
    }
    return base;
  });
};

/** Rentsch/PIRL linkage cascade: each step as % of the step before. */
export const cascade = (clinic: ClinicRow[], matches: MatchRow[]) => {
  const latest = latestByRecord(matches);
  const consented = clinic.filter(c => c.consent_obtained);
  const residents = consented.filter(c => !c.never_in_dss);
  const searched = residents.filter(c => decisionFor(c, latest));
  const matched = searched.filter(c => decisionFor(c, latest)?.status === 'matched');
  const steps = [['Attended', clinic.length], ['Consented', consented.length], ['Live in HDSS area', residents.length], ['Searched', searched.length], ['Matched', matched.length]] as const;
  return steps.map(([step, n], i) => {
    const prev = i ? steps[i - 1][1] : n;
    return { step, n, pctOfPrev: prev ? Math.round((n / prev) * 1000) / 10 : 0 };
  });
};

/** Repeat patients: HDSS people linked from more than one clinic visit, and whether every visit points to the same HDSS person. */
export const repeatRate = (clinic: ClinicRow[], matches: MatchRow[]) => {
  const latest = latestByRecord(matches);
  const byPatient = new Map<string, Set<string>>();
  const visits = new Map<string, number>();
  for (const c of clinic) {
    const d = decisionFor(c, latest);
    if (d?.status !== 'matched' || !d.match_id) continue;
    const key = c.patient_id || c.id;
    visits.set(key, (visits.get(key) || 0) + 1);
    (byPatient.get(key) || byPatient.set(key, new Set()).get(key)!).add(d.match_id);
  }
  const linkedVisits = [...visits.values()].reduce((a, b) => a + b, 0);
  const repeatVisits = [...visits.values()].filter(v => v > 1).reduce((a, v) => a + v - 1, 0);
  const repeaters = [...visits.entries()].filter(([, v]) => v > 1).map(([k]) => k);
  const consistent = repeaters.filter(k => byPatient.get(k)!.size === 1).length;
  return {
    linkedVisits, repeatVisits,
    repeatPct: linkedVisits ? Math.round((repeatVisits / linkedVisits) * 1000) / 10 : 0,
    repeatPatients: repeaters.length,
    consistentPct: repeaters.length ? Math.round((consistent / repeaters.length) * 1000) / 10 : 100,
  };
};

const metaOf = (m: MatchRow): Record<string, unknown> => {
  let fs = m.field_scores as unknown;
  if (typeof fs === 'string') { try { fs = JSON.parse(fs); } catch { fs = null; } }
  return fs && typeof fs === 'object' ? (fs as Record<string, unknown>) : {};
};

/** Rank of the confirmed candidate in the list shown (saved as _rank in field scores when known). */
export const rankDistribution = (matches: MatchRow[]) => {
  const out = { first: 0, top5: 0, beyond: 0, unknown: 0 };
  for (const m of matches.filter(m => m.status === 'matched')) {
    const r = Number(metaOf(m)._rank);
    if (!r) out.unknown++; else if (r === 1) out.first++; else if (r <= 5) out.top5++; else out.beyond++;
  }
  return out;
};

const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : 0);
/** Average score of confirmed vs rejected decisions, and share of review decisions later resolved. */
export const scoreByDecision = (matches: MatchRow[]) => {
  const latest = latestByRecord(matches);
  const everReview = new Set(matches.filter(m => m.status !== 'matched' && m.status !== 'rejected').map(m => m.source_id));
  const resolved = [...everReview].filter(id => ['matched', 'rejected'].includes(latest.get(id)?.status || '')).length;
  const l = [...latest.values()];
  return {
    matchedAvg: avg(l.filter(m => m.status === 'matched').map(m => toPercent(m.confidence))),
    rejectedAvg: avg(l.filter(m => m.status === 'rejected').map(m => toPercent(m.confidence))),
    reviewTotal: everReview.size, reviewResolved: resolved,
    reviewResolvedPct: everReview.size ? Math.round((resolved / everReview.size) * 1000) / 10 : 0,
  };
};

const ID_KINDS: [string, RegExp][] = [['ANC no.', /anc/i], ['MCH card', /mch|road to health|card/i], ['Family folder', /family|folder|chis/i]];
/** Share of clinic records carrying each clinic ID type. */
export const idCompleteness = (clinic: ClinicRow[]) => ID_KINDS.map(([label, re]) => {
  const n = clinic.filter(c => {
    let ids = c.identifiers as unknown;
    if (typeof ids === 'string') { try { ids = JSON.parse(ids); } catch { ids = []; } }
    return Array.isArray(ids) && ids.some((i: { type?: string; value?: string }) => i?.value && re.test(i.type || ''));
  }).length;
  return { label, n, pct: clinic.length ? Math.round((n / clinic.length) * 100) : 0 };
});

/** Moved into the HDSS area within the last `years` years (counted separately, as in Rentsch et al.). */
export const recentMovers = (clinic: ClinicRow[], years = 1, now = new Date()) =>
  clinic.filter(c => { const y = parseInt(c.year_moved_in || '', 10); return y && now.getFullYear() - y < years + 1 && now.getFullYear() - y >= 0; }).length;
