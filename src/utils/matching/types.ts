
/**
 * Import the language type from languageUtils
 */
import { SupportedLanguage } from '../languageUtils';

/**
 * Interface for field weight configuration
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
  [key: string]: number; // Allow for additional custom fields
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
