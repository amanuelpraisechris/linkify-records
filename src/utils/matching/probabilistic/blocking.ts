import { Record } from '@/types';
import { soundex } from './phonetic';

const year = (d?: string) => {
  const y = d ? parseInt(d.split('-')[0], 10) : NaN;
  return isNaN(y) ? null : y;
};
const norm = (v?: string) => (v || '').trim().toLowerCase();

/**
 * Candidate pre-filter (blocking). A community record is kept when it shares
 * at least one cheap key with the source: name sound code (either order),
 * village, or a birth year within ±5. Records with no comparable keys are kept.
 */
export const passesBlocking = (src: Record, cand: Record): boolean => {
  const srcCodes = [soundex(src.firstName), soundex(src.lastName)].filter(Boolean);
  const candCodes = [soundex(cand.firstName), soundex(cand.lastName)].filter(Boolean);
  if (srcCodes.some(c => candCodes.includes(c))) return true;

  if (norm(src.village) && norm(src.village) === norm(cand.village)) return true;

  const y1 = year(src.birthDate);
  const y2 = year(cand.birthDate);
  if (y1 !== null && y2 !== null && Math.abs(y1 - y2) <= 5) return true;

  // Non-Latin names (no sound code) and missing data: don't exclude
  if (!srcCodes.length || !candCodes.length) return true;
  return false;
};

export const blockCandidates = (src: Record, pool: Record[]): Record[] =>
  pool.filter(c => passesBlocking(src, c));
