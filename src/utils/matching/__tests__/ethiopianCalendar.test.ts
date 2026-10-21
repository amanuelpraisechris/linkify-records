import { describe, it, expect } from 'vitest';
import { ethiopianToGregorian, gregorianToEthiopian, isValidEthiopian } from '../../ethiopianCalendar';
import { calculateProbabilisticMatch } from '../probabilistic';

describe('Ethiopian calendar', () => {
  it('1 Meskerem 2016 E.C. is 12 Sept 2023 G.C.', () => {
    expect(ethiopianToGregorian({ year: 2016, month: 1, day: 1 })).toEqual({ year: 2023, month: 9, day: 12 });
  });
  it('7 Jan 2024 G.C. (Genna) is 28 Tahsas 2016 E.C.', () => {
    expect(gregorianToEthiopian({ year: 2024, month: 1, day: 7 })).toEqual({ year: 2016, month: 4, day: 28 });
  });
  it('round-trips a date', () => {
    const ec = { year: 1990, month: 6, day: 15 };
    expect(gregorianToEthiopian(ethiopianToGregorian(ec))).toEqual(ec);
  });
  it('Pagume has 6 days only in leap years', () => {
    expect(isValidEthiopian({ year: 2015, month: 13, day: 6 })).toBe(true);
    expect(isValidEthiopian({ year: 2016, month: 13, day: 6 })).toBe(false);
  });
});

describe('Tigray matching fields', () => {
  const base = { id: 'a', firstName: 'Letay', middleName: 'Gebre', lastName: 'Hailu', birthDate: '1995' };
  it("a matching mother's name raises the score", () => {
    const withMother = calculateProbabilisticMatch({ ...base, motherName: 'Tsehay' } as any, { ...base, id: 'b', motherName: 'Tsehay' } as any);
    const without = calculateProbabilisticMatch(base as any, { ...base, id: 'b' } as any);
    expect(withMother.totalWeight).toBeGreaterThan(without.totalWeight);
  });
  it('compares tabia when stored in the tabia field', () => {
    const r = calculateProbabilisticMatch({ ...base, tabia: 'Agulae' } as any, { ...base, id: 'b', village: 'Agulae' } as any);
    expect(r.fieldScores.village).toBeGreaterThan(0);
  });
});
