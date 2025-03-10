import { Record } from '@/types';
import { containsEthiopicScript, normalizeText, SupportedLanguage } from './languageUtils';

/**
 * Interface for field weight configuration
 */
export interface FieldWeights {
  firstName: number;
  lastName: number;
  birthDate: number;
  gender: number;
  village: number;
  subVillage: number;
  phoneNumber: number;
  middleName: number;
  oldestHouseholdMember: number;
  [key: string]: number; // Allow for additional custom fields
}

/**
 * Default field weights with adjusted priorities
 */
export const DEFAULT_FIELD_WEIGHTS: FieldWeights = {
  firstName: 40, // Increased priority for firstName
  lastName: 40,  // Increased priority for lastName
  middleName: 15, // Added middleName as secondary attribute
  birthDate: 30,
  gender: 15,
  village: 20,
  subVillage: 15,
  phoneNumber: 20,
  oldestHouseholdMember: 15,
};

/**
 * Interface for matching algorithm configuration
 */
export interface MatchingConfig {
  fieldWeights: FieldWeights;
  threshold: {
    high: number;
    medium: number;
    low: number;
  };
  fuzzyMatching: boolean;
  languageConfig: {
    defaultLanguage: SupportedLanguage;
    enableScriptDetection: boolean;
  };
}

/**
 * Default matching configuration
 */
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  fieldWeights: DEFAULT_FIELD_WEIGHTS,
  threshold: {
    high: 80,
    medium: 60,
    low: 40,
  },
  fuzzyMatching: true,
  languageConfig: {
    defaultLanguage: 'latin',
    enableScriptDetection: true,
  },
};

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

/**
 * Calculate overall match score between two records
 * 
 * @param record1 Source record
 * @param record2 Target record
 * @param config Matching configuration
 * @returns Match result with score and matched fields
 */
export const calculateMatchScore = (
  record1: Record,
  record2: Record,
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG
): { score: number; matchedOn: string[] } => {
  const matchedOn: string[] = [];
  let totalScore = 0;
  let totalWeight = 0;
  
  // Compare first name (primary identifier)
  const firstNameWeight = config.fieldWeights.firstName;
  const firstNameScore = calculateStringSimilarity(record1.firstName, record2.firstName, config);
  totalScore += firstNameScore * firstNameWeight;
  totalWeight += firstNameWeight;
  if (firstNameScore > 80) matchedOn.push('First Name');
  else if (firstNameScore > 50) matchedOn.push('First Name (partial)');
  
  // Compare last name (primary identifier)
  const lastNameWeight = config.fieldWeights.lastName;
  const lastNameScore = calculateStringSimilarity(record1.lastName, record2.lastName, config);
  totalScore += lastNameScore * lastNameWeight;
  totalWeight += lastNameWeight;
  if (lastNameScore > 80) matchedOn.push('Last Name');
  else if (lastNameScore > 50) matchedOn.push('Last Name (partial)');
  
  // Compare middle name (secondary identifier)
  if (record1.middleName && record2.middleName) {
    const middleNameWeight = config.fieldWeights.middleName || 15; // Default to 15 if not specified
    const middleNameScore = calculateStringSimilarity(record1.middleName, record2.middleName, config);
    totalScore += middleNameScore * middleNameWeight;
    totalWeight += middleNameWeight;
    if (middleNameScore > 80) matchedOn.push('Middle Name');
    else if (middleNameScore > 50) matchedOn.push('Middle Name (partial)');
  }
  
  // Compare birth date (high importance)
  const birthDateWeight = config.fieldWeights.birthDate;
  const birthDateScore = calculateDateSimilarity(record1.birthDate, record2.birthDate);
  totalScore += birthDateScore * birthDateWeight;
  totalWeight += birthDateWeight;
  if (birthDateScore === 100) matchedOn.push('Birth Date');
  else if (birthDateScore === 80) matchedOn.push('Birth Year/Month');
  else if (birthDateScore === 50) matchedOn.push('Birth Year');
  
  // Compare gender
  const genderWeight = config.fieldWeights.gender;
  const genderScore = record1.gender === record2.gender ? 100 : 0;
  totalScore += genderScore * genderWeight;
  totalWeight += genderWeight;
  if (genderScore === 100) matchedOn.push('Gender');
  
  // Compare village
  if (record1.village && record2.village) {
    const villageWeight = config.fieldWeights.village;
    const villageScore = calculateStringSimilarity(record1.village, record2.village, config);
    totalScore += villageScore * villageWeight;
    totalWeight += villageWeight;
    if (villageScore > 80) matchedOn.push('Village');
    else if (villageScore > 50) matchedOn.push('Village (partial)');
  }
  
  // Compare subVillage
  if (record1.subVillage && record2.subVillage) {
    const subVillageWeight = config.fieldWeights.subVillage;
    const subVillageScore = calculateStringSimilarity(record1.subVillage, record2.subVillage, config);
    totalScore += subVillageScore * subVillageWeight;
    totalWeight += subVillageWeight;
    if (subVillageScore > 80) matchedOn.push('Sub-Village');
    else if (subVillageScore > 50) matchedOn.push('Sub-Village (partial)');
  }
  
  // Compare phone number
  if (record1.phoneNumber && record2.phoneNumber) {
    const phoneNumberWeight = config.fieldWeights.phoneNumber;
    const phoneNumberScore = record1.phoneNumber === record2.phoneNumber ? 100 : 0;
    totalScore += phoneNumberScore * phoneNumberWeight;
    totalWeight += phoneNumberWeight;
    if (phoneNumberScore === 100) matchedOn.push('Phone Number');
  }
  
  // Compare oldest member (use as alternative to Balozi)
  if ((record1.oldest_member_first_name || record1.oldest_member_last_name) && 
      (record2.oldest_member_first_name || record2.oldest_member_last_name)) {
    // If there's a specific weight for oldest member, use it, otherwise use a default
    const oldestMemberWeight = config.fieldWeights.oldestHouseholdMember || 15;
    
    // Calculate similarity scores for oldest member names
    const oldestFirstNameScore = calculateStringSimilarity(record1.oldest_member_first_name, record2.oldest_member_first_name, config);
    const oldestLastNameScore = calculateStringSimilarity(record1.oldest_member_last_name, record2.oldest_member_last_name, config);
    
    // Use the best match score
    const oldestMemberScore = Math.max(oldestFirstNameScore, oldestLastNameScore);
    
    totalScore += oldestMemberScore * oldestMemberWeight;
    totalWeight += oldestMemberWeight;
    
    if (oldestMemberScore > 80) matchedOn.push('Oldest Household Member');
    else if (oldestMemberScore > 50) matchedOn.push('Oldest Household Member (partial)');
  }
  
  // Calculate final score
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  
  return {
    score: finalScore,
    matchedOn
  };
};

/**
 * Find potential matches for a source record
 * 
 * @param sourceRecord The source record to find matches for
 * @param targetRecords The pool of records to search for matches
 * @param config Matching configuration
 * @returns Array of potential matches with scores
 */
export const findPotentialMatches = (
  sourceRecord: Record,
  targetRecords: Record[],
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG
): Array<{ record: Record; score: number; matchedOn: string[] }> => {
  return targetRecords
    .map(record => {
      const { score, matchedOn } = calculateMatchScore(sourceRecord, record, config);
      return { record, score, matchedOn };
    })
    .filter(match => match.score >= config.threshold.low)
    .sort((a, b) => b.score - a.score);
};
