
import { Record } from '@/types';
import { MatchingConfig } from './types';
import { DEFAULT_MATCHING_CONFIG } from './defaultConfig';
import { calculateStringSimilarity, calculateDateSimilarity } from './stringSimilarity';

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
