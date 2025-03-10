
import { Record } from '@/types';
import { MatchingConfig } from './types';
import { DEFAULT_MATCHING_CONFIG } from './defaultConfig';
import { calculateStringSimilarity, calculateDateSimilarity } from './stringSimilarity';
import { getNameField, normalizeNameFields } from '../nameFieldUtils';

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
): { score: number; matchedOn: string[]; fieldScores?: {[key: string]: number} } => {
  const matchedOn: string[] = [];
  let totalScore = 0;
  let totalWeight = 0;
  const fieldScores: {[key: string]: number} = {};
  
  // Extract names using the consistent utilities
  const firstName1 = getNameField(record1, 'firstName', '');
  const firstName2 = getNameField(record2, 'firstName', ''); 
  const lastName1 = getNameField(record1, 'lastName', '');
  const lastName2 = getNameField(record2, 'lastName', '');
  const middleName1 = getNameField(record1, 'middleName', '');
  const middleName2 = getNameField(record2, 'middleName', '');
  
  // Compare first name (primary identifier)
  const firstNameWeight = config.fieldWeights.firstName;
  const firstNameScore = calculateStringSimilarity(firstName1, firstName2, config);
  totalScore += firstNameScore * firstNameWeight;
  totalWeight += firstNameWeight;
  fieldScores['firstName'] = firstNameScore;
  
  if (firstNameScore > 80) matchedOn.push('First Name');
  else if (firstNameScore > 50) matchedOn.push('First Name (partial)');
  
  // Compare last name (primary identifier)
  const lastNameWeight = config.fieldWeights.lastName;
  const lastNameScore = calculateStringSimilarity(lastName1, lastName2, config);
  totalScore += lastNameScore * lastNameWeight;
  totalWeight += lastNameWeight;
  fieldScores['lastName'] = lastNameScore;
  
  if (lastNameScore > 80) matchedOn.push('Last Name');
  else if (lastNameScore > 50) matchedOn.push('Last Name (partial)');
  
  // Compare middle name (secondary identifier)
  if (middleName1 && middleName2) {
    const middleNameWeight = config.fieldWeights.middleName || 15; // Default to 15 if not specified
    const middleNameScore = calculateStringSimilarity(middleName1, middleName2, config);
    totalScore += middleNameScore * middleNameWeight;
    totalWeight += middleNameWeight;
    fieldScores['middleName'] = middleNameScore;
    
    if (middleNameScore > 80) matchedOn.push('Middle Name');
    else if (middleNameScore > 50) matchedOn.push('Middle Name (partial)');
  }
  
  // Compare birth date (high importance)
  const birthDateWeight = config.fieldWeights.birthDate;
  const birthDateScore = calculateDateSimilarity(record1.birthDate, record2.birthDate);
  totalScore += birthDateScore * birthDateWeight;
  totalWeight += birthDateWeight;
  fieldScores['birthDate'] = birthDateScore;
  
  if (birthDateScore === 100) matchedOn.push('Birth Date');
  else if (birthDateScore === 80) matchedOn.push('Birth Year/Month');
  else if (birthDateScore === 50) matchedOn.push('Birth Year');
  
  // Compare gender
  const genderWeight = config.fieldWeights.gender;
  const gender1 = record1.gender || record1.sex || '';
  const gender2 = record2.gender || record2.sex || '';
  const genderScore = gender1.toLowerCase() === gender2.toLowerCase() ? 100 : 0;
  totalScore += genderScore * genderWeight;
  totalWeight += genderWeight;
  fieldScores['gender'] = genderScore;
  
  if (genderScore === 100) matchedOn.push('Gender');
  
  // Compare village
  if (record1.village && record2.village) {
    const villageWeight = config.fieldWeights.village;
    const villageScore = calculateStringSimilarity(record1.village, record2.village, config);
    totalScore += villageScore * villageWeight;
    totalWeight += villageWeight;
    fieldScores['village'] = villageScore;
    
    if (villageScore > 80) matchedOn.push('Village');
    else if (villageScore > 50) matchedOn.push('Village (partial)');
  }
  
  // Compare subVillage
  if (record1.subVillage && record2.subVillage) {
    const subVillageWeight = config.fieldWeights.subVillage;
    const subVillageScore = calculateStringSimilarity(record1.subVillage, record2.subVillage, config);
    totalScore += subVillageScore * subVillageWeight;
    totalWeight += subVillageWeight;
    fieldScores['subVillage'] = subVillageScore;
    
    if (subVillageScore > 80) matchedOn.push('Sub-Village');
    else if (subVillageScore > 50) matchedOn.push('Sub-Village (partial)');
  }
  
  // Compare phone number
  const phone1 = record1.phoneNumber || record1.telephone || '';
  const phone2 = record2.phoneNumber || record2.telephone || '';
  
  if (phone1 && phone2) {
    const phoneNumberWeight = config.fieldWeights.phoneNumber;
    const phoneNumberScore = phone1 === phone2 ? 100 : 0;
    totalScore += phoneNumberScore * phoneNumberWeight;
    totalWeight += phoneNumberWeight;
    fieldScores['phoneNumber'] = phoneNumberScore;
    
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
    fieldScores['oldestHouseholdMember'] = oldestMemberScore;
    
    if (oldestMemberScore > 80) matchedOn.push('Oldest Household Member');
    else if (oldestMemberScore > 50) matchedOn.push('Oldest Household Member (partial)');
  }
  
  // Calculate final score
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  
  return {
    score: finalScore,
    matchedOn,
    fieldScores
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
): Array<{ record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number} }> => {
  return targetRecords
    .map(record => {
      const { score, matchedOn, fieldScores } = calculateMatchScore(sourceRecord, record, config);
      return { record, score, matchedOn, fieldScores };
    })
    .filter(match => match.score >= config.threshold.low)
    .sort((a, b) => b.score - a.score);
};
