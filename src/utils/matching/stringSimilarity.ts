import { MatchingConfig } from './types';
import { containsEthiopicScript, normalizeText, SupportedLanguage } from '../languageUtils';
import { normalizeNameFields } from '../nameFieldUtils';

/**
 * Calculate string similarity score with language-aware comparison
 * 
 * @param str1 First string
 * @param str2 Second string
 * @param config Matching configuration
 * @returns Similarity score (0-100)
 */
export const calculateStringSimilarity = (
  str1: string | undefined,
  str2: string | undefined,
  config: MatchingConfig
): number => {
  if (!str1 || !str2) return 0;
  
  // Detect language based on script if enabled
  let language: SupportedLanguage = config.languageConfig.defaultLanguage;
  if (config.languageConfig.enableScriptDetection) {
    if (containsEthiopicScript(str1) || containsEthiopicScript(str2)) {
      // Detect which Ethiopian script is used (simplified for now)
      language = 'amharic'; // Default to Amharic for now, could be improved
    }
  }
  
  // Normalize strings for better comparison
  const normalized1 = normalizeText(str1, language);
  const normalized2 = normalizeText(str2, language);
  
  if (normalized1 === normalized2) return 100;
  
  if (config.fuzzyMatching) {
    // Implement Levenshtein distance for fuzzy matching
    const distance = levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);
    if (maxLength === 0) return 100;
    return Math.round(100 * (1 - distance / maxLength));
  } else {
    // Simple partial matching
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      const minLength = Math.min(normalized1.length, normalized2.length);
      const maxLength = Math.max(normalized1.length, normalized2.length);
      return Math.round(100 * (minLength / maxLength));
    }
    
    // Check for partial match at beginning (e.g. first few characters)
    const minLength = Math.min(normalized1.length, normalized2.length);
    const prefixLength = 3; // Check first 3 characters
    if (minLength >= prefixLength) {
      const prefix1 = normalized1.substring(0, prefixLength);
      const prefix2 = normalized2.substring(0, prefixLength);
      if (prefix1 === prefix2) return 50;
    }
    
    return 0;
  }
};

/**
 * Calculate Levenshtein distance between two strings
 */
export const levenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;
  
  // Create distance matrix
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
};

/**
 * Calculate date similarity score
 * 
 * @param date1 First date string (YYYY-MM-DD)
 * @param date2 Second date string (YYYY-MM-DD)
 * @returns Similarity score (0-100)
 */
export const calculateDateSimilarity = (
  date1: string | undefined,
  date2: string | undefined
): number => {
  if (!date1 || !date2) return 0;
  
  // Exact match
  if (date1 === date2) return 100;
  
  // Check year/month match
  if (date1.substring(0, 7) === date2.substring(0, 7)) return 80;
  
  // Check year match
  if (date1.substring(0, 4) === date2.substring(0, 4)) return 50;
  
  return 0;
};
