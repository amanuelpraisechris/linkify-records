/**
 * Ethiopian (E.C.) <-> Gregorian (G.C.) calendar conversion using Julian Day Numbers.
 * Ethiopian year has 12 months of 30 days + Pagume (5 or 6 days).
 */
const ETHIOPIC_EPOCH = 1724221; // JDN of 1 Meskerem 1 E.C. (Amete Mihret)

export interface SimpleDate { year: number; month: number; day: number }

const gregorianToJdn = ({ year, month, day }: SimpleDate): number => {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

const jdnToGregorian = (jdn: number): SimpleDate => {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
};

const ethiopianToJdn = ({ year, month, day }: SimpleDate): number =>
  ETHIOPIC_EPOCH - 1 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day;

const jdnToEthiopian = (jdn: number): SimpleDate => {
  const r = (jdn - ETHIOPIC_EPOCH) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  return {
    year: 4 * Math.floor((jdn - ETHIOPIC_EPOCH) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460) + 1,
    month: Math.floor(n / 30) + 1,
    day: (n % 30) + 1,
  };
};

export const isValidEthiopian = ({ year, month, day }: SimpleDate): boolean => {
  if (!year || month < 1 || month > 13 || day < 1) return false;
  if (month <= 12) return day <= 30;
  return day <= (year % 4 === 3 ? 6 : 5);
};

export const ethiopianToGregorian = (d: SimpleDate): SimpleDate => jdnToGregorian(ethiopianToJdn(d));
export const gregorianToEthiopian = (d: SimpleDate): SimpleDate => jdnToEthiopian(gregorianToJdn(d));

/** Approximate year conversion when only an E.C. year is known (Sept-Dec offset ignored). */
export const ethiopianYearToGregorian = (ecYear: number): number => ecYear + 8;

export const ETHIOPIAN_MONTHS = [
  { en: 'Meskerem', ti: 'መስከረም' }, { en: 'Tikimt', ti: 'ጥቅምቲ' }, { en: 'Hidar', ti: 'ሕዳር' },
  { en: 'Tahsas', ti: 'ታሕሳስ' }, { en: 'Tir', ti: 'ጥሪ' }, { en: 'Yekatit', ti: 'ለካቲት' },
  { en: 'Megabit', ti: 'መጋቢት' }, { en: 'Miyazia', ti: 'ሚያዝያ' }, { en: 'Ginbot', ti: 'ግንቦት' },
  { en: 'Sene', ti: 'ሰነ' }, { en: 'Hamle', ti: 'ሓምለ' }, { en: 'Nehase', ti: 'ነሓሰ' }, { en: 'Pagume', ti: 'ጳጉሜን' },
];

export const formatEthiopian = (d: SimpleDate, lang: 'en' | 'ti' = 'en') =>
  `${d.day} ${ETHIOPIAN_MONTHS[d.month - 1]?.[lang] ?? d.month} ${d.year} E.C.`;
