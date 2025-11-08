
import { Record } from '@/types';
import { MatchingConfig } from './types';
import { DEFAULT_MATCHING_CONFIG } from './defaultConfig';
import { calculateStringSimilarity, calculateDateSimilarity } from './stringSimilarity';
import { calculateAdvancedDateSimilarity } from './dateNormalization';
import { getNameField, normalizeNameFields } from '../nameFieldUtils';

/**
 * Calculate overall match score between two records
 * IMPROVED: Uses advanced date normalization and parent names
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
    const middleNameWeight = config.fieldWeights.middleName || 15;
    const middleNameScore = calculateStringSimilarity(middleName1, middleName2, config);
    totalScore += middleNameScore * middleNameWeight;
    totalWeight += middleNameWeight;
    fieldScores['middleName'] = middleNameScore;

    if (middleNameScore > 80) matchedOn.push('Middle Name');
    else if (middleNameScore > 50) matchedOn.push('Middle Name (partial)');
  }

  // Compare birth date (high importance) - USE ADVANCED DATE MATCHING WITH FORMAT NORMALIZATION
  const birthDateWeight = config.fieldWeights.birthDate;
  const birthDateScore = calculateAdvancedDateSimilarity(record1.birthDate, record2.birthDate);
  totalScore += birthDateScore * birthDateWeight;
  totalWeight += birthDateWeight;
  fieldScores['birthDate'] = birthDateScore;

  if (birthDateScore === 100) matchedOn.push('Birth Date');
  else if (birthDateScore === 80) matchedOn.push('Birth Year/Month');
  else if (birthDateScore === 50) matchedOn.push('Birth Year');
  else if (birthDateScore === 30) matchedOn.push('Birth Year (close)');

  // Compare gender/sex
  const genderWeight = config.fieldWeights.gender;
  const gender1 = (record1.gender || record1.sex || '').toString().toLowerCase();
  const gender2 = (record2.gender || record2.sex || '').toString().toLowerCase();
  const genderScore = gender1 && gender2 && gender1 === gender2 ? 100 : 0;
  totalScore += genderScore * genderWeight;
  totalWeight += genderWeight;
  fieldScores['gender'] = genderScore;

  if (genderScore === 100) matchedOn.push('Gender');

  // Compare father name (important family identifier) - NEW!
  const fatherName1 = record1.fatherName || record1.father_name || '';
  const fatherName2 = record2.fatherName || record2.father_name || '';
  if (fatherName1 && fatherName2) {
    const fatherNameWeight = config.fieldWeights.fatherName || 25; // High weight for parent names
    const fatherNameScore = calculateStringSimilarity(fatherName1, fatherName2, config);
    totalScore += fatherNameScore * fatherNameWeight;
    totalWeight += fatherNameWeight;
    fieldScores['fatherName'] = fatherNameScore;

    if (fatherNameScore > 80) matchedOn.push('Father Name');
    else if (fatherNameScore > 50) matchedOn.push('Father Name (partial)');
  }

  // Compare mother name (important family identifier) - NEW!
  const motherName1 = record1.motherName || record1.mother_name || '';
  const motherName2 = record2.motherName || record2.mother_name || '';
  if (motherName1 && motherName2) {
    const motherNameWeight = config.fieldWeights.motherName || 25; // High weight for parent names
    const motherNameScore = calculateStringSimilarity(motherName1, motherName2, config);
    totalScore += motherNameScore * motherNameWeight;
    totalWeight += motherNameWeight;
    fieldScores['motherName'] = motherNameScore;

    if (motherNameScore > 80) matchedOn.push('Mother Name');
    else if (motherNameScore > 50) matchedOn.push('Mother Name (partial)');
  }

  // Compare village (handle both text and numeric formats) - IMPROVED!
  if (record1.village && record2.village) {
    const villageWeight = config.fieldWeights.village;
    const village1 = String(record1.village).trim();
    const village2 = String(record2.village).trim();

    // Try exact match first
    let villageScore = 0;
    if (village1 === village2) {
      villageScore = 100;
    } else {
      // If one is numeric and one is text, use fuzzy matching
      villageScore = calculateStringSimilarity(village1, village2, config);
    }

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
    const oldestMemberWeight = config.fieldWeights.oldestHouseholdMember || 15;

    const oldestFirstNameScore = calculateStringSimilarity(record1.oldest_member_first_name, record2.oldest_member_first_name, config);
    const oldestLastNameScore = calculateStringSimilarity(record1.oldest_member_last_name, record2.oldest_member_last_name, config);

    const oldestMemberScore = Math.max(oldestFirstNameScore, oldestLastNameScore);

    totalScore += oldestMemberScore * oldestMemberWeight;
    totalWeight += oldestMemberWeight;
    fieldScores['oldestHouseholdMember'] = oldestMemberScore;

    if (oldestMemberScore > 80) matchedOn.push('Oldest Household Member');
    else if (oldestMemberScore > 50) matchedOn.push('Oldest Household Member (partial)');
  }

  // Additional identifiers from record.identifiers array

  // Tabia Name
  if (record1.identifiers && record2.identifiers) {
    const tabia1 = record1.identifiers.find(id => id.type === 'Tabia Name')?.value || '';
    const tabia2 = record2.identifiers.find(id => id.type === 'Tabia Name')?.value || '';

    if (tabia1 && tabia2) {
      const tabiaWeight = config.fieldWeights.tabiaName || 15;
      const tabiaScore = calculateStringSimilarity(tabia1, tabia2, config);
      totalScore += tabiaScore * tabiaWeight;
      totalWeight += tabiaWeight;
      fieldScores['tabiaName'] = tabiaScore;

      if (tabiaScore > 80) matchedOn.push('Tabia Name');
      else if (tabiaScore > 50) matchedOn.push('Tabia Name (partial)');
    }
  }

  // Kushet Name
  if (record1.identifiers && record2.identifiers) {
    const kushet1 = record1.identifiers.find(id => id.type === 'Kushet Name')?.value || '';
    const kushet2 = record2.identifiers.find(id => id.type === 'Kushet Name')?.value || '';

    if (kushet1 && kushet2) {
      const kushetWeight = config.fieldWeights.kushetName || 15;
      const kushetScore = calculateStringSimilarity(kushet1, kushet2, config);
      totalScore += kushetScore * kushetWeight;
      totalWeight += kushetWeight;
      fieldScores['kushetName'] = kushetScore;

      if (kushetScore > 80) matchedOn.push('Kushet Name');
      else if (kushetScore > 50) matchedOn.push('Kushet Name (partial)');
    }
  }

  // Got Name
  if (record1.identifiers && record2.identifiers) {
    const got1 = record1.identifiers.find(id => id.type === 'Got Name')?.value || '';
    const got2 = record2.identifiers.find(id => id.type === 'Got Name')?.value || '';

    if (got1 && got2) {
      const gotWeight = config.fieldWeights.gotName || 15;
      const gotScore = calculateStringSimilarity(got1, got2, config);
      totalScore += gotScore * gotWeight;
      totalWeight += gotWeight;
      fieldScores['gotName'] = gotScore;

      if (gotScore > 80) matchedOn.push('Got Name');
      else if (gotScore > 50) matchedOn.push('Got Name (partial)');
    }
  }

  // House Number
  if (record1.identifiers && record2.identifiers) {
    const house1 = record1.identifiers.find(id => id.type === 'House Number')?.value || '';
    const house2 = record2.identifiers.find(id => id.type === 'House Number')?.value || '';

    if (house1 && house2) {
      const houseWeight = config.fieldWeights.houseNumber || 10;
      const houseScore = house1 === house2 ? 100 : 0;
      totalScore += houseScore * houseWeight;
      totalWeight += houseWeight;
      fieldScores['houseNumber'] = houseScore;

      if (houseScore === 100) matchedOn.push('House Number');
    }
  }

  // Calculate final score
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

  // Log matching details for debugging
  console.log('Match calculation:', {
    record1: { firstName: firstName1, lastName: lastName1, dob: record1.birthDate },
    record2: { firstName: firstName2, lastName: lastName2, dob: record2.birthDate },
    scores: {
      firstName: firstNameScore,
      lastName: lastNameScore,
      birthDate: birthDateScore,
      gender: genderScore
    },
    totalScore,
    totalWeight,
    finalScore,
    matchedFields: matchedOn
  });

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
