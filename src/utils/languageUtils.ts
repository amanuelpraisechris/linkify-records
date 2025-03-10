
/**
 * Utility functions for handling multilingual text, particularly
 * for Ethiopian languages like Amharic and Tigrinya
 */

// Language codes
export type SupportedLanguage = 'latin' | 'amharic' | 'tigrinya';

/**
 * Checks if text contains any Amharic or Tigrinya characters
 * @param text The text to check
 * @returns True if the text contains Ethiopic script
 */
export const containsEthiopicScript = (text: string): boolean => {
  // Ethiopic Unicode range: \u1200-\u137F (Ethiopic) and \u1380-\u139F (Ethiopic Supplement)
  const ethiopicPattern = /[\u1200-\u137F\u1380-\u139F]/;
  return ethiopicPattern.test(text);
};

/**
 * Normalizes text for consistent comparison across different scripts
 * @param text The text to normalize
 * @param language The language of the text
 * @returns Normalized text suitable for comparison
 */
export const normalizeText = (text: string, language: SupportedLanguage = 'latin'): string => {
  if (!text) return '';
  
  // Lowercase for all languages (works for Latin script)
  let normalized = text.toLowerCase().trim();
  
  // Specific normalization for Amharic
  if (language === 'amharic') {
    // Remove vowel variations (example normalization)
    // In a real implementation, this would have more complete rules
    normalized = normalized
      // Example: normalize similar characters
      .replace(/[ሀሃኅኃሐሓኻ]/g, 'ሀ')
      .replace(/[ሁሑኁኹ]/g, 'ሁ')
      .replace(/[ሂሒኂኺ]/g, 'ሂ')
      .replace(/[ሄሔኄኼ]/g, 'ሄ')
      .replace(/[ሆሖኆኾ]/g, 'ሆ');
  }
  
  // Specific normalization for Tigrinya
  if (language === 'tigrinya') {
    // Remove vowel variations (example normalization)
    // In a real implementation, this would have more complete rules
    normalized = normalized
      // Example: normalize similar characters
      .replace(/[ሀሃኅኃሐሓኻ]/g, 'ሀ')
      .replace(/[ሁሑኁኹ]/g, 'ሁ')
      .replace(/[ሂሒኂኺ]/g, 'ሂ')
      .replace(/[ሄሔኄኼ]/g, 'ሄ')
      .replace(/[ሆሖኆኾ]/g, 'ሆ');
  }
  
  return normalized;
};

/**
 * Compares two strings with language-specific comparison logic
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @param language Language to use for comparison
 * @returns True if the strings match according to language-specific rules
 */
export const compareStrings = (
  str1: string, 
  str2: string, 
  language: SupportedLanguage = 'latin'
): boolean => {
  if (!str1 || !str2) return false;
  
  const normalized1 = normalizeText(str1, language);
  const normalized2 = normalizeText(str2, language);
  
  return normalized1.includes(normalized2) || normalized2.includes(normalized1);
};

/**
 * Calculates similarity score between two strings (0-100)
 * @param str1 First string
 * @param str2 Second string
 * @param language Language to use for comparison
 * @returns Similarity score (0-100)
 */
export const calculateSimilarity = (
  str1: string, 
  str2: string, 
  language: SupportedLanguage = 'latin'
): number => {
  if (!str1 || !str2) return 0;
  
  const normalized1 = normalizeText(str1, language);
  const normalized2 = normalizeText(str2, language);
  
  // Simple similarity measure (percentage of matching characters)
  // In a real implementation, this would use more sophisticated algorithms like
  // Levenshtein distance or language-specific similarity measures
  
  const maxLength = Math.max(normalized1.length, normalized2.length);
  if (maxLength === 0) return 100; // Both empty strings are identical
  
  let matchingChars = 0;
  const minLength = Math.min(normalized1.length, normalized2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (normalized1[i] === normalized2[i]) {
      matchingChars++;
    }
  }
  
  return Math.round((matchingChars / maxLength) * 100);
};
