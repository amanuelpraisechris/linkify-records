
import { compareStrings } from '../../languageUtils';
import { SupportedLanguage } from '../../languageUtils';
import { levenshteinDistance } from './stringComparison';

/**
 * Determines if two name strings match using language-specific comparison
 * 
 * @param name1 First name string
 * @param name2 Second name string
 * @param language Language for comparison rules
 * @returns True if names match according to rules
 */
export const namesMatch = (
  name1: string | undefined,
  name2: string | undefined,
  language: SupportedLanguage
): boolean => {
  if (!name1 || !name2) return false;
  
  // Normalize names for comparison
  const normalized1 = name1.trim().toLowerCase();
  const normalized2 = name2.trim().toLowerCase();
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Use language-specific string comparison
  if (compareStrings(normalized1, normalized2, language)) return true;
  
  // String similarity check using Jaro-Winkler as mentioned in the sample
  const similarityThreshold = language === 'latin' ? 0.85 : 0.80;
  const similarity = calculateJaroWinklerSimilarity(normalized1, normalized2);
  
  return similarity >= similarityThreshold;
};

/**
 * Finds the best matching name among alternatives
 * 
 * @param name Target name to match
 * @param alternatives Array of alternative names to check against
 * @param language Language for comparison
 * @returns The best matching name or null if none match
 */
export const findBestNameMatch = (
  name: string,
  alternatives: string[],
  language: SupportedLanguage
): string | null => {
  if (!name || !alternatives.length) return null;
  
  let bestMatch: string | null = null;
  let highestSimilarity = 0;
  
  for (const alternative of alternatives) {
    if (namesMatch(name, alternative, language)) {
      const similarity = calculateJaroWinklerSimilarity(
        name.toLowerCase(), 
        alternative.toLowerCase()
      );
      
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = alternative;
      }
    }
  }
  
  return bestMatch;
};

/**
 * Determines if birth years match within a given tolerance
 * 
 * @param year1 First year
 * @param year2 Second year
 * @param tolerance Maximum allowed difference in years
 * @returns True if years match within tolerance
 */
export const birthYearMatches = (
  year1: string | undefined,
  year2: string | undefined,
  tolerance: number = 3
): boolean => {
  if (!year1 || !year2) return false;
  
  const y1 = parseInt(year1, 10);
  const y2 = parseInt(year2, 10);
  
  if (isNaN(y1) || isNaN(y2)) return false;
  
  return Math.abs(y1 - y2) <= tolerance;
};

/**
 * Implements Jaro-Winkler string similarity
 * As mentioned in the sample, this is used for name comparisons
 * 
 * @param s1 First string
 * @param s2 Second string
 * @returns Similarity score between 0 and 1
 */
export const calculateJaroWinklerSimilarity = (
  s1: string,
  s2: string
): number => {
  // Empty strings handling
  if (s1.length === 0 && s2.length === 0) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // Calculate standard Jaro similarity
  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  
  // Find matching characters
  const s1Matches: boolean[] = Array(s1.length).fill(false);
  const s2Matches: boolean[] = Array(s2.length).fill(false);
  
  let matches = 0;
  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2.length);
    
    for (let j = start; j < end; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
  }
  
  // If no matches, return 0
  if (matches === 0) return 0;
  
  // Count transpositions
  let transpositions = 0;
  let k = 0;
  
  for (let i = 0; i < s1.length; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) k++;
      
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }
  }
  
  // Calculate Jaro similarity
  const jaroSimilarity = (
    matches / s1.length +
    matches / s2.length +
    (matches - transpositions / 2) / matches
  ) / 3;
  
  // Apply Winkler adjustment for common prefixes
  // This gives more weight to strings that match from the beginning
  let prefixLength = 0;
  const maxPrefixLength = Math.min(4, Math.min(s1.length, s2.length));
  
  while (prefixLength < maxPrefixLength && s1[prefixLength] === s2[prefixLength]) {
    prefixLength++;
  }
  
  const winklerAdjustment = 0.1; // Standard Winkler adjustment factor
  
  return jaroSimilarity + (prefixLength * winklerAdjustment * (1 - jaroSimilarity));
};
