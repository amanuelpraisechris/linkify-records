
/**
 * Import the language type from languageUtils
 */
import { SupportedLanguage } from '../languageUtils';

/**
 * Interface for field weight configuration
 * IMPROVED: Added parent name fields for family-based matching
 */
export interface FieldWeights {
  firstName: number;
  lastName: number;
  birthDate: number;
  gender: number;
  village: number;
  subVillage: number;
  phoneNumber: number;
  middleName: number;
  oldestHouseholdMember: number;
  // Family identifiers - NEW!
  fatherName?: number;
  motherName?: number;
  // Additional location-based identifiers
  tabiaName?: number;
  kushetName?: number;
  gotName?: number;
  houseNumber?: number;
  [key: string]: number | undefined; // Allow for additional custom fields
}

/**
 * Interface for matching algorithm configuration
 */
export interface MatchingConfig {
  fieldWeights: FieldWeights;
  threshold: {
    high: number;
    medium: number;
    low: number;
  };
  fuzzyMatching: boolean;
  languageConfig: {
    defaultLanguage: SupportedLanguage;
    enableScriptDetection: boolean;
  };
}

// Re-export language types for convenience
export type { SupportedLanguage };
