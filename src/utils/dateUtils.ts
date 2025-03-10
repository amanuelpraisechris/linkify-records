
/**
 * Format a date string in a consistent way with fallback handling
 * @param dateString Date string in any format
 * @param defaultValue Value to return if date is invalid
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | undefined, defaultValue = 'Unknown'): string => {
  if (!dateString) return defaultValue;
  
  try {
    // Log the input to help with debugging
    console.log("formatDate input:", dateString, typeof dateString);
    
    // Check if the date string is valid
    const date = new Date(dateString);
    
    // Make sure date is valid before proceeding
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
      
      // Additional check for number-only dates that might be stored as strings
      if (/^\d{8}$/.test(dateString)) {
        const year = parseInt(dateString.substring(0, 4));
        const month = parseInt(dateString.substring(4, 6)) - 1;
        const day = parseInt(dateString.substring(6, 8));
        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) {
          const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          };
          return parsedDate.toLocaleDateString(undefined, options);
        }
      }
      
      // Try handling quoted date strings that might come from JSON
      if (dateString.startsWith('"') && dateString.endsWith('"')) {
        const unquotedDate = dateString.substring(1, dateString.length - 1);
        return formatDate(unquotedDate, defaultValue); // Recursive call with unquoted string
      }
      
      console.log(`Invalid date format: ${dateString}`);
      return defaultValue;
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error(`Error formatting date ${dateString}:`, error);
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
  if (!year || year.trim() === '') return '';
  
  // Ensure each part is properly formatted
  const yearValue = year.trim();
  // Ensure month and day are padded to 2 digits
  const monthValue = month && month.trim() !== '' 
    ? month.trim().padStart(2, '0') 
    : '01';
  const dayValue = day && day.trim() !== '' 
    ? day.trim().padStart(2, '0') 
    : '01';
  
  // Validate the date parts
  const monthNum = parseInt(monthValue);
  const dayNum = parseInt(dayValue);
  
  // Basic validation
  if (monthNum < 1 || monthNum > 12) {
    console.warn(`Invalid month value: ${monthValue}, using 01 instead`);
    return `${yearValue}-01-${dayValue}`;
  }
  
  // Check day validity based on month
  const maxDays = new Date(parseInt(yearValue), monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > maxDays) {
    console.warn(`Invalid day value: ${dayValue} for month ${monthValue}, using 01 instead`);
    return `${yearValue}-${monthValue}-01`;
  }
  
  // Log the output date string for debugging
  const dateString = `${yearValue}-${monthValue}-${dayValue}`;
  console.log("buildDateString output:", dateString);
  return dateString;
};

/**
 * Check if a date string is in valid ISO format YYYY-MM-DD
 * @param dateString Date string to check
 * @returns boolean indicating if the date is valid
 */
export const isValidDateString = (dateString: string | undefined): boolean => {
  if (!dateString) return false;
  
  // Check format using regex
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  
  // Check if the date is valid
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};
