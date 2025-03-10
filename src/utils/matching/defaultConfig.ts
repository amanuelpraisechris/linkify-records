
import { FieldWeights, MatchingConfig } from './types';
import { SupportedLanguage } from '../languageUtils';

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
    defaultLanguage: 'latin' as SupportedLanguage,
    enableScriptDetection: true,
  },
};
