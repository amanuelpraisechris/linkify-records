
import { MatchProbabilities, UnmatchProbabilities } from './types';

export const DEFAULT_MATCH_PROBABILITIES: MatchProbabilities = {
  firstName: 0.95,
  lastName: 0.92,
  middleName: 0.80,
  birthYear: 0.88,
  birthMonth: 0.75,
  birthDay: 0.65,
  gender: 0.99,
  village: 0.85,
  subVillage: 0.75,
  householdMember: 0.70,
};

export const DEFAULT_UNMATCH_PROBABILITIES: UnmatchProbabilities = {
  firstName: 0.05,
  lastName: 0.05,
  middleName: 0.05,
  birthYear: 0.03,
  birthMonth: 1/12,
  birthDay: 1/30,
  gender: 0.5,
  village: 0.1,
  subVillage: 0.03,
  householdMember: 0.01,
};
