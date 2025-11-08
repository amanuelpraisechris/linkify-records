
import { FieldWeights, MatchingConfig } from './types';
import { SupportedLanguage } from '../languageUtils';

/**
 * Default field weights with adjusted priorities
 * IMPROVED: Added parent names and adjusted weights for better matching
 */
export const DEFAULT_FIELD_WEIGHTS: FieldWeights = {
  firstName: 40, // Increased priority for firstName
  lastName: 40,  // Increased priority for lastName
  middleName: 15, // Added middleName as secondary attribute
  birthDate: 30,
  gender: 15,
  fatherName: 25, // NEW: Parent names are important family identifiers
  motherName: 25, // NEW: Parent names are important family identifiers
  village: 20,
  subVillage: 15,
  phoneNumber: 20,
  oldestHouseholdMember: 15,
  // Additional location identifiers
  tabiaName: 15,
  kushetName: 15,
  gotName: 15,
  houseNumber: 10,
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
