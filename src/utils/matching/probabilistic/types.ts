
import { Record } from '@/types';
import { SupportedLanguage } from '../../languageUtils';

/**
 * Interface for match probabilities (m-probabilities) in Fellegi-Sunter model
 * These represent the probability that a field matches for true matches
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
 * Interface for unmatch probabilities (u-probabilities) in Fellegi-Sunter model
 * These represent the probability that a field matches by random chance for non-matches
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

/**
 * Result interface for probabilistic matching
 */
export interface ProbabilisticMatchResult {
  score: number;               // Final match score (normalized 0-100)
  matchedOn: string[];         // List of fields that matched
  fieldScores: {               // Individual field contributions to match score
    [key: string]: number;
  };
  totalWeight: number;         // Total log weight before normalization
}

/**
 * Match threshold levels for probabilistic matching
 * Based on the sample, these thresholds can be adjusted to control
 * the tradeoff between sensitivity and specificity
 */
export interface MatchThresholds {
  minimum: number;    // Minimum score to be considered a potential match
  low: number;        // 25th percentile threshold
  medium: number;     // 50th percentile threshold
  high: number;       // 75th percentile threshold
}
