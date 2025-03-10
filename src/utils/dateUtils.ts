
/**
 * Format a date string in a consistent way with fallback handling
 * @param dateString Date string in any format
 * @param defaultValue Value to return if date is invalid
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | undefined, defaultValue = 'Unknown'): string => {
  if (!dateString) return defaultValue;
  
  try {
    // Check if the date string is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try to parse date in format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        // Month is 0-based in JS Date
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) {
          const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          };
          return parsedDate.toLocaleDateString(undefined, options);
        }
      }
      return defaultValue;
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Builds a date string from year, month, and day parts
 * @param year Year as string
 * @param month Month as string (1-12)
 * @param day Day as string (1-31)
 * @returns ISO date string (YYYY-MM-DD)
 */
export const buildDateString = (
  year: string | undefined,
  month: string | undefined,
  day: string | undefined
): string => {
  if (!year) return '';
  
  const yearValue = year.trim();
  const monthValue = (month || '01').trim().padStart(2, '0');
  const dayValue = (day || '01').trim().padStart(2, '0');
  
  return `${yearValue}-${monthValue}-${dayValue}`;
};
