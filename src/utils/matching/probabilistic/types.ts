
import { Record } from '@/types';
import { SupportedLanguage } from '../../languageUtils';

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
  householdMember: number;
}

/**
 * Interface for unmatch probabilities (u-probabilities)
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
}

export interface ProbabilisticMatchResult {
  score: number;
  matchedOn: string[];
  fieldScores: {[key: string]: number};
  totalWeight: number;
}
