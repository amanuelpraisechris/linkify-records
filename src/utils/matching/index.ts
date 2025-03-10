
// Re-export types
export * from './types';

// Re-export constants
export { DEFAULT_FIELD_WEIGHTS, DEFAULT_MATCHING_CONFIG } from './defaultConfig';

// Re-export string similarity functions
export { 
  calculateStringSimilarity,
  levenshteinDistance,
  calculateDateSimilarity
} from './stringSimilarity';

// Re-export core matching functions
export {
  calculateMatchScore,
  findPotentialMatches
} from './matchingCore';
