
import { Record } from '@/types';
import { containsEthiopicScript, normalizeText, SupportedLanguage } from './languageUtils';

/**
 * Interface for match probabilities (m-probabilities)
 */
export interface MatchProbabilities {
  firstName: number;
  lastName: number;
  middleName: number;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: number;
  village: number;
  subVillage: number;
  householdMember: number; // Oldest household member
  cellLeader: number; // Ten-cell leader
}

/**
 * Default match probabilities based on previous research
 */
export const DEFAULT_MATCH_PROBABILITIES: MatchProbabilities = {
  firstName: 0.90, // 90% chance a first name matches if records truly match
  lastName: 0.85,
  middleName: 0.80,
  birthYear: 0.85,
  birthMonth: 0.70,
  birthDay: 0.60,
  gender: 0.99, // Gender is almost always correctly recorded
  village: 0.90,
  subVillage: 0.80,
  householdMember: 0.75,
  cellLeader: 0.70
};

/**
 * Interface for unmatch probabilities (u-probabilities) - chance of random agreement
 */
export interface UnmatchProbabilities {
  firstName: number;
  lastName: number;
  middleName: number;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: number;
  village: number;
  subVillage: number;
  householdMember: number;
  cellLeader: number;
}

/**
 * Default unmatch probabilities based on frequency in the population
 */
export const DEFAULT_UNMATCH_PROBABILITIES: UnmatchProbabilities = {
  firstName: 0.05, // 5% chance of random first name agreement
  lastName: 0.05,
  middleName: 0.05,
  birthYear: 0.03, // Birth year has fewer possible values
  birthMonth: 1/12, // 12 possible months
  birthDay: 1/30, // Approximately 30 days in a month
  gender: 0.5, // 50% chance (assuming binary gender)
  village: 0.1, // Depends on number of villages in region
  subVillage: 0.03, // Depends on number of sub-villages
  householdMember: 0.01,
  cellLeader: 0.01
};

/**
 * Calculate Jaro-Winkler similarity between two strings
 * This is a specialized string comparison metric that works well for names
 */
export const jaroWinkler = (s1: string, s2: string): number => {
  // Basic implementation of Jaro-Winkler distance
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  // Calculate Jaro similarity first
  const s1Length = s1.length;
  const s2Length = s2.length;
  
  // Maximum distance for matching characters
  const matchDistance = Math.floor(Math.max(s1Length, s2Length) / 2) - 1;

  // Matching characters
  const s1Matches: boolean[] = Array(s1Length).fill(false);
  const s2Matches: boolean[] = Array(s2Length).fill(false);

  // Count of matching characters
  let matchingChars = 0;
  
  // Find matching characters within matchDistance
  for (let i = 0; i < s1Length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2Length);

    for (let j = start; j < end; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        matchingChars++;
        break;
      }
    }
  }

  // If no characters match, return 0
  if (matchingChars === 0) return 0;

  // Count transpositions
  let transpositions = 0;
  let k = 0;

  for (let i = 0; i < s1Length; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) {
        k++;
      }
      if (s1[i] !== s2[k]) {
        transpositions++;
      }
      k++;
    }
  }

  // Calculate Jaro similarity
  const jaroSimilarity = (
    (matchingChars / s1Length) +
    (matchingChars / s2Length) +
    ((matchingChars - transpositions / 2) / matchingChars)
  ) / 3;

  // Calculate Jaro-Winkler similarity
  // The Winkler modification gives more weight to matches at the beginning of the strings
  const prefixLength = Math.min(4, Math.min(s1Length, s2Length));
  let prefixMatch = 0;
  for (let i = 0; i < prefixLength; i++) {
    if (s1[i] === s2[i]) {
      prefixMatch++;
    } else {
      break;
    }
  }

  // Winkler's scaling factor
  const scalingFactor = 0.1;
  
  // Calculate Jaro-Winkler similarity
  return jaroSimilarity + (prefixMatch * scalingFactor * (1 - jaroSimilarity));
};

/**
 * Calculate field weight for agreement/disagreement using Fellegi-Sunter formula
 * 
 * @param m Match probability (m-probability)
 * @param u Unmatch probability (u-probability)
 * @param agrees Whether fields agree
 * @returns Weight value
 */
export const calculateFieldWeight = (m: number, u: number, agrees: boolean): number => {
  if (agrees) {
    return Math.log2(m / u); // Agreement weight
  } else {
    return Math.log2((1 - m) / (1 - u)); // Disagreement weight
  }
};

/**
 * Check if two name fields match using Jaro-Winkler with threshold
 * 
 * @param name1 First name
 * @param name2 Second name
 * @param language Language for normalization
 * @returns True if names match
 */
export const namesMatch = (
  name1: string | undefined, 
  name2: string | undefined,
  language: SupportedLanguage = 'latin'
): boolean => {
  if (!name1 || !name2) return false;
  
  // Normalize names
  const normalized1 = normalizeText(name1, language);
  const normalized2 = normalizeText(name2, language);
  
  // Calculate Jaro-Winkler similarity
  const similarity = jaroWinkler(normalized1, normalized2);
  
  // Match if similarity exceeds threshold (0.8 as per requirements)
  return similarity >= 0.8;
};

/**
 * Find the best matching name from a list
 * 
 * @param sourceName Source name
 * @param targetNames List of target names
 * @param language Language for normalization
 * @returns Best match score
 */
export const findBestNameMatch = (
  sourceName: string | undefined,
  targetNames: (string | undefined)[], 
  language: SupportedLanguage = 'latin'
): number => {
  if (!sourceName || !targetNames.length) return 0;
  
  let bestScore = 0;
  
  // Try each target name and find the best match
  for (const targetName of targetNames) {
    if (!targetName) continue;
    
    const normalized1 = normalizeText(sourceName, language);
    const normalized2 = normalizeText(targetName, language);
    const score = jaroWinkler(normalized1, normalized2);
    
    if (score > bestScore) {
      bestScore = score;
    }
  }
  
  return bestScore;
};

/**
 * Check if birth years match within allowable difference
 * 
 * @param year1 First year
 * @param year2 Second year
 * @param allowableDiff Maximum allowable difference (default 2)
 * @returns True if years match within allowable difference
 */
export const birthYearMatches = (
  year1: string | undefined,
  year2: string | undefined,
  allowableDiff: number = 2
): boolean => {
  if (!year1 || !year2) return false;
  
  const y1 = parseInt(year1, 10);
  const y2 = parseInt(year2, 10);
  
  if (isNaN(y1) || isNaN(y2)) return false;
  
  return Math.abs(y1 - y2) <= allowableDiff;
};

/**
 * Calculate probability match score between two records
 * 
 * @param record1 First record
 * @param record2 Second record
 * @returns Match result with score, weights, and matched fields
 */
export const calculateProbabilisticMatch = (
  record1: Record,
  record2: Record,
  matchProbs: MatchProbabilities = DEFAULT_MATCH_PROBABILITIES,
  unmatchProbs: UnmatchProbabilities = DEFAULT_UNMATCH_PROBABILITIES
): { 
  score: number; 
  matchedOn: string[]; 
  fieldScores: {[key: string]: number};
  totalWeight: number;
} => {
  const matchedOn: string[] = [];
  const fieldScores: {[key: string]: number} = {};
  let totalWeight = 0;
  
  // Language detection for name comparisons
  let language: SupportedLanguage = 'latin';
  if (containsEthiopicScript(record1.firstName) || containsEthiopicScript(record2.firstName)) {
    language = 'amharic'; // Default to Amharic for Ethiopic script
  }
  
  // First Name comparison (allowing for multiple name pairwise comparison)
  const firstNameMatch = namesMatch(record1.firstName, record2.firstName, language);
  const firstNameWeight = calculateFieldWeight(matchProbs.firstName, unmatchProbs.firstName, firstNameMatch);
  totalWeight += firstNameWeight;
  fieldScores['firstName'] = firstNameWeight;
  if (firstNameMatch) matchedOn.push('First Name');
  
  // Last Name comparison
  const lastNameMatch = namesMatch(record1.lastName, record2.lastName, language);
  const lastNameWeight = calculateFieldWeight(matchProbs.lastName, unmatchProbs.lastName, lastNameMatch);
  totalWeight += lastNameWeight;
  fieldScores['lastName'] = lastNameWeight;
  if (lastNameMatch) matchedOn.push('Last Name');
  
  // Middle Name comparison (if available)
  if (record1.middleName && record2.middleName) {
    const middleNameMatch = namesMatch(record1.middleName, record2.middleName, language);
    const middleNameWeight = calculateFieldWeight(matchProbs.middleName, unmatchProbs.middleName, middleNameMatch);
    totalWeight += middleNameWeight;
    fieldScores['middleName'] = middleNameWeight;
    if (middleNameMatch) matchedOn.push('Middle Name');
  }
  
  // Birth Date components
  if (record1.birthDate && record2.birthDate) {
    // Extract year, month, day from dates (assuming YYYY-MM-DD format)
    const [year1, month1, day1] = record1.birthDate.split('-');
    const [year2, month2, day2] = record2.birthDate.split('-');
    
    // Year comparison (allow 2 year difference)
    const yearMatch = birthYearMatches(year1, year2, 2);
    const yearWeight = calculateFieldWeight(matchProbs.birthYear, unmatchProbs.birthYear, yearMatch);
    totalWeight += yearWeight;
    fieldScores['birthYear'] = yearWeight;
    if (yearMatch) matchedOn.push('Birth Year');
    
    // Month comparison (if available)
    if (month1 && month2) {
      const monthMatch = month1 === month2;
      const monthWeight = calculateFieldWeight(matchProbs.birthMonth, unmatchProbs.birthMonth, monthMatch);
      totalWeight += monthWeight;
      fieldScores['birthMonth'] = monthWeight;
      if (monthMatch) matchedOn.push('Birth Month');
    }
    
    // Day comparison (if available)
    if (day1 && day2) {
      const dayMatch = day1 === day2;
      const dayWeight = calculateFieldWeight(matchProbs.birthDay, unmatchProbs.birthDay, dayMatch);
      totalWeight += dayWeight;
      fieldScores['birthDay'] = dayWeight;
      if (dayMatch) matchedOn.push('Birth Day');
    }
  }
  
  // Gender comparison (exact match required)
  const genderMatch = record1.gender === record2.gender;
  const genderWeight = calculateFieldWeight(matchProbs.gender, unmatchProbs.gender, genderMatch);
  totalWeight += genderWeight;
  fieldScores['gender'] = genderWeight;
  if (genderMatch) matchedOn.push('Gender');
  
  // Village comparison (exact match required)
  if (record1.village && record2.village) {
    const villageMatch = record1.village.toLowerCase() === record2.village.toLowerCase();
    const villageWeight = calculateFieldWeight(matchProbs.village, unmatchProbs.village, villageMatch);
    totalWeight += villageWeight;
    fieldScores['village'] = villageWeight;
    if (villageMatch) matchedOn.push('Village');
  }
  
  // Sub-village comparison (exact match required)
  if (record1.subVillage && record2.subVillage) {
    const subVillageMatch = record1.subVillage.toLowerCase() === record2.subVillage.toLowerCase();
    const subVillageWeight = calculateFieldWeight(matchProbs.subVillage, unmatchProbs.subVillage, subVillageMatch);
    totalWeight += subVillageWeight;
    fieldScores['subVillage'] = subVillageWeight;
    if (subVillageMatch) matchedOn.push('Sub-Village');
  }
  
  // Ten-cell leader comparison (cell leader)
  // Taking the best match from first/middle/last name
  if ((record1.cellLeaderFirstName || record1.cellLeaderLastName) && 
      (record2.cellLeaderFirstName || record2.cellLeaderLastName)) {
    
    const sourceNames = [
      record1.cellLeaderFirstName, 
      record1.cellLeaderMiddleName, 
      record1.cellLeaderLastName
    ].filter(Boolean) as string[];
    
    const targetNames = [
      record2.cellLeaderFirstName, 
      record2.cellLeaderMiddleName, 
      record2.cellLeaderLastName
    ].filter(Boolean) as string[];
    
    let anyNameMatches = false;
    
    // Cross-compare all names to find matches
    for (const sourceName of sourceNames) {
      if (!sourceName) continue;
      for (const targetName of targetNames) {
        if (!targetName) continue;
        if (namesMatch(sourceName, targetName, language)) {
          anyNameMatches = true;
          break;
        }
      }
      if (anyNameMatches) break;
    }
    
    const cellLeaderWeight = calculateFieldWeight(matchProbs.cellLeader, unmatchProbs.cellLeader, anyNameMatches);
    totalWeight += cellLeaderWeight;
    fieldScores['cellLeader'] = cellLeaderWeight;
    if (anyNameMatches) matchedOn.push('Ten-Cell Leader');
  }
  
  // Oldest household member comparison
  if ((record1.oldestHouseholdMemberFirstName || record1.oldestHouseholdMemberLastName) && 
      (record2.oldestHouseholdMemberFirstName || record2.oldestHouseholdMemberLastName)) {
    
    const sourceNames = [
      record1.oldestHouseholdMemberFirstName, 
      record1.oldestHouseholdMemberMiddleName, 
      record1.oldestHouseholdMemberLastName
    ].filter(Boolean) as string[];
    
    const targetNames = [
      record2.oldestHouseholdMemberFirstName, 
      record2.oldestHouseholdMemberMiddleName, 
      record2.oldestHouseholdMemberLastName
    ].filter(Boolean) as string[];
    
    let anyNameMatches = false;
    
    // Cross-compare all names to find matches
    for (const sourceName of sourceNames) {
      if (!sourceName) continue;
      for (const targetName of targetNames) {
        if (!targetName) continue;
        if (namesMatch(sourceName, targetName, language)) {
          anyNameMatches = true;
          break;
        }
      }
      if (anyNameMatches) break;
    }
    
    const householdMemberWeight = calculateFieldWeight(matchProbs.householdMember, unmatchProbs.householdMember, anyNameMatches);
    totalWeight += householdMemberWeight;
    fieldScores['householdMember'] = householdMemberWeight;
    if (anyNameMatches) matchedOn.push('Household Member');
  }
  
  // Convert to percentage (0-100)
  // Score is relative - the absolute value doesn't have a direct probabilistic interpretation,
  // but higher scores represent greater likelihood of a match
  const normalizedScore = Math.min(100, Math.max(0, Math.round((totalWeight + 10) * 5)));
  
  return {
    score: normalizedScore,
    matchedOn,
    fieldScores,
    totalWeight
  };
};

/**
 * Find potential matches for a source record using probabilistic matching
 * 
 * @param sourceRecord The source record to find matches for
 * @param targetRecords The pool of records to search for matches
 * @param minScore Minimum score threshold
 * @returns Array of potential matches with scores
 */
export const findProbabilisticMatches = (
  sourceRecord: Record,
  targetRecords: Record[],
  minScore: number = 40
): Array<{ record: Record; score: number; matchedOn: string[]; fieldScores: {[key: string]: number}; }> => {
  return targetRecords
    .map(record => {
      const { score, matchedOn, fieldScores, totalWeight } = calculateProbabilisticMatch(sourceRecord, record);
      return { record, score, matchedOn, fieldScores, totalWeight };
    })
    .filter(match => match.score >= minScore)
    .sort((a, b) => b.score - a.score);
};
