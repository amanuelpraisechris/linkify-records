
import { MatchProbabilities, UnmatchProbabilities } from './types';

/**
 * Default match probabilities (m-probabilities) based on the Fellegi-Sunter model
 * 
 * These values represent the probability that identifiers match among true matches
 * For example, firstName: 0.95 means there's a 95% chance that first names will match
 * for records that truly represent the same person
 */
export const DEFAULT_MATCH_PROBABILITIES: MatchProbabilities = {
  firstName: 0.95,        // 95% of true matches have matching first names
  lastName: 0.92,         // 92% of true matches have matching last names
  middleName: 0.80,       // 80% of true matches have matching middle names
  birthYear: 0.88,        // 88% of true matches have matching birth years (within tolerance)
  birthMonth: 0.75,       // 75% of true matches have matching birth months
  birthDay: 0.65,         // 65% of true matches have matching birth days
  gender: 0.99,           // 99% of true matches have matching gender
  village: 0.85,          // 85% of true matches have matching village
  subVillage: 0.75,       // 75% of true matches have matching sub-village
  householdMember: 0.70,  // 70% of true matches have matching household member/ten-cell leader
};

/**
 * Default unmatch probabilities (u-probabilities) based on the Fellegi-Sunter model
 * 
 * These values represent the probability that identifiers match by random chance
 * For example, firstName: 0.05 means there's a 5% chance that first names will match
 * between records of different people purely by coincidence
 */
export const DEFAULT_UNMATCH_PROBABILITIES: UnmatchProbabilities = {
  firstName: 0.05,        // 5% chance of random first name matches
  lastName: 0.05,         // 5% chance of random last name matches
  middleName: 0.05,       // 5% chance of random middle name matches
  birthYear: 0.03,        // 3% chance of random birth year matches (within tolerance)
  birthMonth: 1/12,       // 1/12 chance of random birth month matches (uniform distribution)
  birthDay: 1/30,         // 1/30 chance of random birth day matches (simplified)
  gender: 0.5,            // 50% chance of random gender matches (binary)
  village: 0.1,           // 10% chance of random village matches
  subVillage: 0.03,       // 3% chance of random sub-village matches
  householdMember: 0.01,  // 1% chance of random household member/ten-cell leader matches
};
