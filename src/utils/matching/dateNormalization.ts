/**
 * Date Normalization Utilities for Record Matching
 * Handles multiple date formats and normalizes them for comparison
 */

/**
 * Parse date string in various formats and return a normalized Date object
 * Supports: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY, MM/DD/YYYY, and more
 */
export const parseFlexibleDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;

  // Clean the string
  const cleaned = dateStr.trim();
  if (!cleaned) return null;

  // Try ISO format first (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    const date = new Date(cleaned);
    if (!isNaN(date.getTime())) return date;
  }

  // Try DD.MM.YYYY or DD/MM/YYYY
  const ddmmyyyyMatch = cleaned.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1]);
    const month = parseInt(ddmmyyyyMatch[2]);
    const year = parseInt(ddmmyyyyMatch[3]);

    // Validate
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Try MM/DD/YYYY (US format)
  const mmddyyyyMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const month = parseInt(mmddyyyyMatch[1]);
    const day = parseInt(mmddyyyyMatch[2]);
    const year = parseInt(mmddyyyyMatch[3]);

    // Only use if month is clearly > 12 or day is clearly > 12
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Try JavaScript Date constructor as fallback
  const fallbackDate = new Date(cleaned);
  if (!isNaN(fallbackDate.getTime())) return fallbackDate;

  return null;
};

/**
 * Normalize date to YYYY-MM-DD format
 */
export const normalizeDateString = (dateStr: string | undefined): string | null => {
  const date = parseFlexibleDate(dateStr);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Extract year, month, day components from a date string
 */
export const extractDateComponents = (dateStr: string | undefined): {
  year: number | null;
  month: number | null;
  day: number | null;
} => {
  const date = parseFlexibleDate(dateStr);
  if (!date) return { year: null, month: null, day: null };

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // JavaScript months are 0-indexed
    day: date.getDate()
  };
};

/**
 * Calculate advanced date similarity with format normalization
 * Returns: 100 for exact match, 80 for year+month match, 50 for year match, 30 for close year, 0 for no match
 */
export const calculateAdvancedDateSimilarity = (
  date1: string | undefined,
  date2: string | undefined
): number => {
  if (!date1 || !date2) return 0;

  // Normalize both dates
  const normalized1 = normalizeDateString(date1);
  const normalized2 = normalizeDateString(date2);

  // If either couldn't be parsed, return 0
  if (!normalized1 || !normalized2) return 0;

  // Exact match
  if (normalized1 === normalized2) return 100;

  // Extract components for partial matching
  const components1 = extractDateComponents(date1);
  const components2 = extractDateComponents(date2);

  if (!components1.year || !components2.year) return 0;

  // Check year + month match
  if (components1.year === components2.year && components1.month === components2.month) {
    return 80;
  }

  // Check exact year match
  if (components1.year === components2.year) {
    return 50;
  }

  // Check close years (within 2 years - possible data entry error)
  const yearDiff = Math.abs(components1.year - components2.year);
  if (yearDiff <= 2) {
    return 30;
  }

  return 0;
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string | undefined, referenceDate?: Date): number | null => {
  const date = parseFlexibleDate(birthDate);
  if (!date) return null;

  const ref = referenceDate || new Date();
  const ageInMillis = ref.getTime() - date.getTime();
  const ageInYears = Math.floor(ageInMillis / (365.25 * 24 * 60 * 60 * 1000));

  return ageInYears;
};
