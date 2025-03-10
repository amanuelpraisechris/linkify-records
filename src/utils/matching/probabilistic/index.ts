
import { Record } from '@/types';
import { DEFAULT_MATCH_PROBABILITIES, DEFAULT_UNMATCH_PROBABILITIES } from './defaultProbabilities';
import { calculateFieldWeight } from './stringComparison';
import { namesMatch, findBestNameMatch, birthYearMatches } from './fieldMatching';
import { containsEthiopicScript, SupportedLanguage } from '../../languageUtils';
import { ProbabilisticMatchResult } from './types';

/**
 * Calculate probabilistic match score between two records using Fellegi-Sunter model
 * 
 * This implementation is based on probabilistic record linkage principles where:
 * - m-probability: probability that a field matches for true matches
 * - u-probability: probability that a field matches by chance for non-matches
 * - Weight calculation: log2(m/u) for matches, log2((1-m)/(1-u)) for non-matches
 * 
 * @param record1 Source record
 * @param record2 Target record
 * @returns Match result with score, matched fields, and field-level scores
 */
export const calculateProbabilisticMatch = (
  record1: Record,
  record2: Record
): ProbabilisticMatchResult => {
  const matchedOn: string[] = [];
  const fieldScores: {[key: string]: number} = {};
  let totalWeight = 0;
  
  // Determine language based on script detection
  let language: SupportedLanguage = containsEthiopicScript(record1.firstName) || containsEthiopicScript(record2.firstName) ? 'amharic' : 'latin';
  
  // First Name comparison
  const firstNameMatch = namesMatch(record1.firstName, record2.firstName, language);
  const firstNameWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.firstName, DEFAULT_UNMATCH_PROBABILITIES.firstName, firstNameMatch);
  totalWeight += firstNameWeight;
  fieldScores['firstName'] = firstNameWeight;
  if (firstNameMatch) matchedOn.push('First Name');
  
  // Last Name comparison
  const lastNameMatch = namesMatch(record1.lastName, record2.lastName, language);
  const lastNameWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.lastName, DEFAULT_UNMATCH_PROBABILITIES.lastName, lastNameMatch);
  totalWeight += lastNameWeight;
  fieldScores['lastName'] = lastNameWeight;
  if (lastNameMatch) matchedOn.push('Last Name');
  
  // Middle Name comparison
  if (record1.middleName && record2.middleName) {
    const middleNameMatch = namesMatch(record1.middleName, record2.middleName, language);
    const middleNameWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.middleName, DEFAULT_UNMATCH_PROBABILITIES.middleName, middleNameMatch);
    totalWeight += middleNameWeight;
    fieldScores['middleName'] = middleNameWeight;
    if (middleNameMatch) matchedOn.push('Middle Name');
  }
  
  // Birth Date components - Handling year separately for flexible matching
  if (record1.birthDate && record2.birthDate) {
    const [year1, month1, day1] = record1.birthDate.split('-');
    const [year2, month2, day2] = record2.birthDate.split('-');
    
    // Year comparison - allowing up to 10 years difference as mentioned in the sample
    const yearMatch = birthYearMatches(year1, year2, 10); // Updated to 10 years as per sample
    const yearWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.birthYear, DEFAULT_UNMATCH_PROBABILITIES.birthYear, yearMatch);
    totalWeight += yearWeight;
    fieldScores['birthYear'] = yearWeight;
    if (yearMatch) matchedOn.push('Birth Year');
    
    // Month comparison
    if (month1 && month2) {
      const monthMatch = month1 === month2;
      const monthWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.birthMonth, DEFAULT_UNMATCH_PROBABILITIES.birthMonth, monthMatch);
      totalWeight += monthWeight;
      fieldScores['birthMonth'] = monthWeight;
      if (monthMatch) matchedOn.push('Birth Month');
    }
    
    // Day comparison
    if (day1 && day2) {
      const dayMatch = day1 === day2;
      const dayWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.birthDay, DEFAULT_UNMATCH_PROBABILITIES.birthDay, dayMatch);
      totalWeight += dayWeight;
      fieldScores['birthDay'] = dayWeight;
      if (dayMatch) matchedOn.push('Birth Day');
    }
  }
  
  // Gender comparison
  const genderMatch = record1.gender?.toLowerCase() === record2.gender?.toLowerCase();
  const genderWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.gender, DEFAULT_UNMATCH_PROBABILITIES.gender, genderMatch);
  totalWeight += genderWeight;
  fieldScores['gender'] = genderWeight;
  if (genderMatch) matchedOn.push('Gender');
  
  // Village comparison
  if (record1.village && record2.village) {
    const villageMatch = namesMatch(record1.village, record2.village, language);
    const villageWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.village, DEFAULT_UNMATCH_PROBABILITIES.village, villageMatch);
    totalWeight += villageWeight;
    fieldScores['village'] = villageWeight;
    if (villageMatch) matchedOn.push('Village');
  }
  
  // Sub-village comparison
  if (record1.subVillage && record2.subVillage) {
    const subVillageMatch = namesMatch(record1.subVillage, record2.subVillage, language);
    const subVillageWeight = calculateFieldWeight(DEFAULT_MATCH_PROBABILITIES.subVillage, DEFAULT_UNMATCH_PROBABILITIES.subVillage, subVillageMatch);
    totalWeight += subVillageWeight;
    fieldScores['subVillage'] = subVillageWeight;
    if (subVillageMatch) matchedOn.push('Sub-Village');
  }
  
  // Ten Cell Leader comparison (as mentioned in the sample)
  // Using oldest_member fields as a proxy for ten-cell leader
  if ((record1.oldest_member_first_name || record1.oldest_member_last_name) && 
      (record2.oldest_member_first_name || record2.oldest_member_last_name)) {
    
    // Compare first names
    const tenCellLeaderFirstNameMatch = namesMatch(
      record1.oldest_member_first_name, 
      record2.oldest_member_first_name,
      language
    );
    
    // Compare last names
    const tenCellLeaderLastNameMatch = namesMatch(
      record1.oldest_member_last_name,
      record2.oldest_member_last_name,
      language
    );
    
    const householdMemberMatch = tenCellLeaderFirstNameMatch || tenCellLeaderLastNameMatch;
    const householdMemberWeight = calculateFieldWeight(
      DEFAULT_MATCH_PROBABILITIES.householdMember,
      DEFAULT_UNMATCH_PROBABILITIES.householdMember,
      householdMemberMatch
    );
    
    totalWeight += householdMemberWeight;
    fieldScores['householdMember'] = householdMemberWeight;
    if (householdMemberMatch) matchedOn.push('Household Member/Ten-Cell Leader');
  }
  
  // Normalize score to percentage using the approach mentioned in the sample
  // Convert logarithmic weights to a 0-100 probability scale
  // Adding 12 and multiplying by 5 is a scaling factor to convert log weights to a reasonable percentage
  const normalizedScore = Math.min(100, Math.max(0, Math.round((totalWeight + 12) * 5)));
  
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
 * This function implements a thresholding approach similar to the sample:
 * - Creates multiple thresholds based on match score distribution
 * - Returns all matches above the specified minimum threshold
 * 
 * @param sourceRecord Source record to find matches for
 * @param targetRecords Pool of records to search for matches
 * @param minScore Minimum score threshold (default: 40)
 * @returns Array of potential matches with scores
 */
export const findProbabilisticMatches = (
  sourceRecord: Record,
  targetRecords: Record[],
  minScore: number = 40
): Array<{ record: Record; score: number; matchedOn: string[]; fieldScores: {[key: string]: number}; }> => {
  console.log(`Finding matches for ${sourceRecord.firstName} ${sourceRecord.lastName} against ${targetRecords.length} records`);
  
  const matches = targetRecords
    .map(record => {
      const { score, matchedOn, fieldScores } = calculateProbabilisticMatch(sourceRecord, record);
      return { record, score, matchedOn, fieldScores };
    })
    .filter(match => match.score >= minScore)
    .sort((a, b) => b.score - a.score);
  
  console.log(`Found ${matches.length} matches with score >= ${minScore}`);
  
  return matches;
};

// Re-export everything for backward compatibility
export * from './types';
export * from './defaultProbabilities';
export * from './stringComparison';
export * from './fieldMatching';
