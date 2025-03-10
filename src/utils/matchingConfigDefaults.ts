
import { FieldWeights, DEFAULT_MATCHING_CONFIG, DEFAULT_FIELD_WEIGHTS } from '@/utils/matchingAlgorithms';
import { ExtendedMatchingConfig } from '@/types/matchingConfig';

// Modified field weights to exclude Balozi information and prioritize FirstName and LastName
export const UPDATED_FIELD_WEIGHTS: FieldWeights = {
  ...DEFAULT_FIELD_WEIGHTS,
  firstName: 45,
  lastName: 45,
  middleName: 20,
  birthDate: 30,
  gender: 15,
  village: 25,
  district: 20,
  motherName: 25,
  householdHead: 25,
  phoneNumber: 20
  // Note: baloziFirstName, baloziMiddleName, and baloziLastName are intentionally omitted
};

// Extended default config
export const EXTENDED_DEFAULT_CONFIG: ExtendedMatchingConfig = {
  ...DEFAULT_MATCHING_CONFIG,
  fieldWeights: UPDATED_FIELD_WEIGHTS,
  algorithmType: 'deterministic'
};

// Default profiles with extended config
export const DEFAULT_PROFILES: Record<string, ExtendedMatchingConfig> = {
  'Default': EXTENDED_DEFAULT_CONFIG,
  'DSS Linkage': {
    ...EXTENDED_DEFAULT_CONFIG,
    fieldWeights: {
      ...UPDATED_FIELD_WEIGHTS,
      firstName: 40,
      lastName: 40,
      middleName: 15,
      birthDate: 25,
      village: 20,
      district: 15,
      phoneNumber: 20,
      householdHead: 15
    },
    threshold: {
      high: 85,
      medium: 70,
      low: 50
    }
  },
  'Name Priority': {
    ...EXTENDED_DEFAULT_CONFIG,
    fieldWeights: {
      ...UPDATED_FIELD_WEIGHTS,
      firstName: 45,
      lastName: 45,
      middleName: 20,
      birthDate: 25,
      gender: 15,
      village: 20,
      phoneNumber: 20
    },
    threshold: {
      high: 70,
      medium: 45,
      low: 25
    }
  },
  'Lenient Matching': {
    ...EXTENDED_DEFAULT_CONFIG,
    threshold: {
      high: 60,
      medium: 35,
      low: 15
    }
  },
  'Probabilistic': {
    ...EXTENDED_DEFAULT_CONFIG,
    algorithmType: 'probabilistic',
    threshold: {
      high: 70,
      medium: 50,
      low: 30
    }
  }
};
