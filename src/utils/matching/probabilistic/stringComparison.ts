
/**
 * Calculate log2 weight for a field comparison
 * 
 * @param matchProbability Probability that field matches for true matches (m-probability)
 * @param unmatchProbability Probability that field matches by chance (u-probability)
 * @param isMatch Whether the fields match
 * @returns Log weight contribution for this field
 */
export const calculateFieldWeight = (
  matchProbability: number,
  unmatchProbability: number,
  isMatch: boolean
): number => {
  if (isMatch) {
    // Agreement weight: log2(m/u)
    return Math.log2(matchProbability / unmatchProbability);
  } else {
    // Disagreement weight: log2((1-m)/(1-u))
    return Math.log2((1 - matchProbability) / (1 - unmatchProbability));
  }
};

/**
 * Calculate Levenshtein distance between two strings
 * Used for string similarity comparison
 * 
 * @param str1 First string
 * @param str2 Second string
 * @returns Distance value (number of edits needed)
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
 * Calculate string similarity based on Levenshtein distance
 * 
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-100)
 */
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  if (!str1 && !str2) return 100;
  if (!str1 || !str2) return 0;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) return 100;
  
  return Math.round(100 * (1 - distance / maxLength));
};
