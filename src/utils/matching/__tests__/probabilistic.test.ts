import { describe, it, expect } from 'vitest';
import {
  compareBirthYear, compareName, calculateProbabilisticMatch, bandScore,
  soundex, findProbabilisticMatches, weightToProbability,
} from '../probabilistic';

const rec = (o: any) => ({ id: Math.random().toString(), firstName: '', lastName: '', ...o });

describe('PIRL matching rules', () => {
  it('grades birth year: exact, ±1, ±2–5, beyond 5', () => {
    expect(compareBirthYear('1980', '1980')).toBe('exact');
    expect(compareBirthYear('1980', '1981')).toBe('near');
    expect(compareBirthYear('1980', '1985')).toBe('far');
    expect(compareBirthYear('1980', '1970')).toBe('disagree');
    expect(compareBirthYear('1980', undefined)).toBe('missing');
  });

  it('scores a 10-year gap lower than an exact year', () => {
    const a = rec({ firstName: 'John', lastName: 'Mwita', birthDate: '1980' });
    const same = calculateProbabilisticMatch(a, rec({ firstName: 'John', lastName: 'Mwita', birthDate: '1980' }));
    const off = calculateProbabilisticMatch(a, rec({ firstName: 'John', lastName: 'Mwita', birthDate: '1970' }));
    expect(same.totalWeight).toBeGreaterThan(off.totalWeight);
  });

  it('treats blank sex as neutral, not disagreement', () => {
    const r = calculateProbabilisticMatch(rec({ firstName: 'Ana', gender: 'female' }), rec({ firstName: 'Ana' }));
    expect(r.fieldScores.gender).toBeUndefined();
  });

  it('detects swapped first and last names', () => {
    const r = calculateProbabilisticMatch(
      rec({ firstName: 'Mwita', lastName: 'John' }), rec({ firstName: 'John', lastName: 'Mwita' }));
    expect(r.matchedOn).toContain('Names Swapped');
    expect(r.fieldScores.firstName).toBeGreaterThan(0);
  });

  it('gives sound-alike names the same code', () => {
    expect(soundex('Robert')).toBe(soundex('Rupert'));
  });

  it('bands scores by thresholds', () => {
    expect(bandScore(90, { high: 80, low: 40 })).toBe('high');
    expect(bandScore(50, { high: 80, low: 40 })).toBe('review');
    expect(bandScore(10, { high: 80, low: 40 })).toBe('no-match');
  });

  it('turns zero evidence into the prior', () => {
    expect(weightToProbability(0, 0.01)).toBe(1);
  });

  it('returns at most 5 candidates', () => {
    const pool = Array.from({ length: 10 }, () => rec({ firstName: 'John', lastName: 'Mwita', birthDate: '1980-01-01' }));
    expect(findProbabilisticMatches(rec({ firstName: 'John', lastName: 'Mwita', birthDate: '1980-01-01' }), pool, 0)).toHaveLength(5);
  });
});
