import { Record } from '@/types';
import { DEFAULT_MATCH_PROBABILITIES, DEFAULT_UNMATCH_PROBABILITIES } from './defaultProbabilities';
import { calculateFieldWeight } from './stringComparison';
import { namesMatch, calculateJaroWinklerSimilarity } from './fieldMatching';
import { containsEthiopicScript, SupportedLanguage } from '../../languageUtils';
import { ProbabilisticMatchResult, MatchProbabilities, UnmatchProbabilities } from './types';
import { soundex } from './phonetic';
import { blockCandidates } from './blocking';

export type NameAgreement = 'exact' | 'close' | 'disagree' | 'missing';
export type YearAgreement = 'exact' | 'near' | 'far' | 'disagree' | 'missing';
export type MatchBand = 'high' | 'review' | 'no-match';

export interface ProbabilisticOptions {
  m?: Partial<MatchProbabilities>;
  u?: Partial<UnmatchProbabilities>;
  /** Prior probability that a random candidate pair is a true match */
  prior?: number;
}

const DEFAULT_PRIOR = 0.01;

const clean = (v?: string) => (v || '').trim().toLowerCase();

/** Graded name comparison: exact, close (fuzzy or sound-alike), disagree, or missing. */
export const compareName = (a: string | undefined, b: string | undefined, language: SupportedLanguage): NameAgreement => {
  const x = clean(a);
  const y = clean(b);
  if (!x || !y) return 'missing';
  if (x === y) return 'exact';
  if (namesMatch(x, y, language)) return 'close';
  if (language === 'latin' && soundex(x) && soundex(x) === soundex(y)) return 'close';
  return 'disagree';
};

/** Graded birth-year comparison: exact, ±1, ±2–5, beyond 5, or missing. */
export const compareBirthYear = (a?: string, b?: string): YearAgreement => {
  const y1 = a ? parseInt(a, 10) : NaN;
  const y2 = b ? parseInt(b, 10) : NaN;
  if (isNaN(y1) || isNaN(y2)) return 'missing';
  const d = Math.abs(y1 - y2);
  if (d === 0) return 'exact';
  if (d === 1) return 'near';
  if (d <= 5) return 'far';
  return 'disagree';
};

/** Weight for a graded agreement level. Missing data is neutral (0). */
export const gradedWeight = (m: number, u: number, level: NameAgreement | YearAgreement): number => {
  switch (level) {
    case 'missing': return 0;
    case 'exact': return calculateFieldWeight(m, u, true);
    case 'close':
    case 'near': return calculateFieldWeight(m, u, true) * 0.7;
    case 'far': return calculateFieldWeight(m, u, true) * 0.3;
    default: return calculateFieldWeight(m, u, false);
  }
};

/** Convert total log2 weight to a match probability (0–100) using a prior. */
export const weightToProbability = (totalWeight: number, prior: number = DEFAULT_PRIOR): number => {
  const priorOdds = Math.log2(prior / (1 - prior));
  const p = 1 / (1 + Math.pow(2, -(totalWeight + priorOdds)));
  return Math.round(p * 1000) / 10;
};

/** Band a score using thresholds (high ≥ high, review ≥ low, otherwise no match). */
export const bandScore = (score: number, thresholds: { high: number; low: number }): MatchBand =>
  score >= thresholds.high ? 'high' : score >= thresholds.low ? 'review' : 'no-match';

/**
 * Fellegi-Sunter probabilistic match with graded agreement, name-swap
 * detection, neutral missing data, and a calibrated probability score.
 */
export const calculateProbabilisticMatch = (
  record1: Record,
  record2: Record,
  options: ProbabilisticOptions | unknown = {}
): ProbabilisticMatchResult => {
  const opts = (options && typeof options === 'object' && ('m' in options || 'u' in options || 'prior' in options))
    ? options as ProbabilisticOptions : {};
  const M = { ...DEFAULT_MATCH_PROBABILITIES, ...(opts.m || {}) };
  const U = { ...DEFAULT_UNMATCH_PROBABILITIES, ...(opts.u || {}) };

  const matchedOn: string[] = [];
  const fieldScores: { [key: string]: number } = {};
  let totalWeight = 0;
  const add = (key: string, label: string, w: number, agreed: boolean) => {
    fieldScores[key] = w;
    totalWeight += w;
    if (agreed) matchedOn.push(label);
  };

  const language: SupportedLanguage =
    containsEthiopicScript(record1.firstName) || containsEthiopicScript(record2.firstName) ? 'amharic' : 'latin';

  // Names, with first/last swap detection
  let fn = compareName(record1.firstName, record2.firstName, language);
  let ln = compareName(record1.lastName, record2.lastName, language);
  const direct = gradedWeight(M.firstName, U.firstName, fn) + gradedWeight(M.lastName, U.lastName, ln);
  const sfn = compareName(record1.firstName, record2.lastName, language);
  const sln = compareName(record1.lastName, record2.firstName, language);
  const swapped = gradedWeight(M.firstName, U.firstName, sfn) + gradedWeight(M.lastName, U.lastName, sln);
  let swap = false;
  if (swapped > direct) {
    fn = sfn; ln = sln; swap = true;
  }
  add('firstName', 'First Name', gradedWeight(M.firstName, U.firstName, fn), fn === 'exact' || fn === 'close');
  add('lastName', 'Last Name', gradedWeight(M.lastName, U.lastName, ln), ln === 'exact' || ln === 'close');
  if (swap) matchedOn.push('Names Swapped');

  const mn = compareName(record1.middleName, record2.middleName, language);
  add('middleName', 'Middle Name', gradedWeight(M.middleName, U.middleName, mn), mn === 'exact' || mn === 'close');

  // Birth date
  const [y1, mo1, d1] = (record1.birthDate || '').split('-');
  const [y2, mo2, d2] = (record2.birthDate || '').split('-');
  const yr = compareBirthYear(y1, y2);
  add('birthYear', 'Birth Year', gradedWeight(M.birthYear, U.birthYear, yr), yr === 'exact' || yr === 'near');
  if (mo1 && mo2) {
    const ok = mo1 === mo2;
    add('birthMonth', 'Birth Month', calculateFieldWeight(M.birthMonth, U.birthMonth, ok), ok);
  }
  if (d1 && d2) {
    const ok = d1 === d2;
    add('birthDay', 'Birth Day', calculateFieldWeight(M.birthDay, U.birthDay, ok), ok);
  }

  // Sex (neutral when missing)
  const g1 = clean(record1.gender);
  const g2 = clean(record2.gender);
  if (g1 && g2) {
    const ok = g1 === g2;
    add('gender', 'Gender', calculateFieldWeight(M.gender, U.gender, ok), ok);
  }

  // Tabia (village) and Kushet/Got (sub-village); Tigray records may carry tabia/kushet directly
  const vil = compareName(record1.tabia || record1.village, record2.tabia || record2.village, language);
  add('village', 'Tabia', gradedWeight(M.village, U.village, vil), vil === 'exact' || vil === 'close');
  const sv = compareName(record1.kushet || record1.subVillage, record2.kushet || record2.subVillage, language);
  add('subVillage', 'Kushet', gradedWeight(M.subVillage, U.subVillage, sv), sv === 'exact' || sv === 'close');

  // Mother's name (strong identifier in MCH/ANC linkage; neutral when missing)
  const mn = compareName(record1.motherName, record2.motherName, language);
  add('motherName', "Mother's Name", gradedWeight(MOTHER_M, MOTHER_U, mn), mn === 'exact' || mn === 'close');

  // Ten-cell leader / oldest household member
  const h1 = `${record1.oldest_member_first_name || ''} ${record1.oldest_member_last_name || ''}`.trim();
  const h2 = `${record2.oldest_member_first_name || ''} ${record2.oldest_member_last_name || ''}`.trim();
  if (h1 && h2) {
    const hf = compareName(record1.oldest_member_first_name, record2.oldest_member_first_name, language);
    const hl = compareName(record1.oldest_member_last_name, record2.oldest_member_last_name, language);
    const best = [hf, hl].includes('exact') ? 'exact' : [hf, hl].includes('close') ? 'close' : 'disagree';
    add('householdMember', 'Household Member/Ten-Cell Leader',
      gradedWeight(M.householdMember, U.householdMember, best), best !== 'disagree');
  }

  for (const k of Object.keys(fieldScores)) fieldScores[k] = Math.round(fieldScores[k] * 100) / 100;

  return {
    score: weightToProbability(totalWeight, opts.prior ?? DEFAULT_PRIOR),
    matchedOn,
    fieldScores,
    totalWeight,
  };
};

/**
 * Find candidates: blocking → scoring → filter by minimum → top N, sorted.
 */
export const findProbabilisticMatches = (
  sourceRecord: Record,
  targetRecords: Record[],
  minScore: number = 40,
  options: ProbabilisticOptions & { limit?: number } = {}
): Array<{ record: Record; score: number; matchedOn: string[]; fieldScores: { [key: string]: number } }> => {
  const candidates = blockCandidates(sourceRecord, targetRecords);
  return candidates
    .map(record => {
      const { score, matchedOn, fieldScores } = calculateProbabilisticMatch(sourceRecord, record, options);
      return { record, score, matchedOn, fieldScores };
    })
    .filter(m => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit ?? 5);
};

export * from './types';
export * from './defaultProbabilities';
export * from './stringComparison';
export * from './fieldMatching';
export * from './phonetic';
export * from './blocking';
