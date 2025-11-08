/**
 * Setup Wizard Types
 * First-run configuration and setup
 */

import { MatchingConfig } from './matchingConfig';

export type SetupStep =
  | 'welcome'
  | 'profile'
  | 'data_source'
  | 'matching_config'
  | 'demo_data'
  | 'complete';

export type UseCase =
  | 'healthcare'
  | 'census'
  | 'research'
  | 'custom';

export type EnvironmentProfile =
  | 'development'
  | 'testing'
  | 'production';

export interface SetupWizardState {
  currentStep: SetupStep;
  completedSteps: SetupStep[];
  useCase: UseCase;
  environment: EnvironmentProfile;
  machineName?: string;
  organizationName?: string;
  adminUser?: {
    name: string;
    email: string;
    role: string;
  };
  dataSourceConfig?: {
    hasExistingData: boolean;
    primarySource: 'clinic' | 'community' | 'both';
    loadDemoData: boolean;
  };
  matchingConfig?: MatchingConfig;
  isComplete: boolean;
  completedAt?: string;
}

export interface UseCaseTemplate {
  id: UseCase;
  name: string;
  description: string;
  icon: string;
  matchingConfig: Partial<MatchingConfig>;
  features: string[];
  recommendedSettings: {
    autoMatchThreshold: number;
    manualReviewThreshold: number;
    algorithmType: 'deterministic' | 'probabilistic';
  };
}

export interface EnvironmentConfig {
  profile: EnvironmentProfile;
  settings: {
    enableLogging: boolean;
    enableAuditTrail: boolean;
    enableAutoBackup: boolean;
    backupFrequency?: 'daily' | 'weekly' | 'monthly';
    dataRetentionDays?: number;
  };
}

export interface DemoDataset {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  categories: string[];
  dataUrl?: string; // URL or path to demo data
}

export interface SetupValidation {
  isValid: boolean;
  errors: {
    step: SetupStep;
    field: string;
    message: string;
  }[];
  warnings: {
    step: SetupStep;
    message: string;
  }[];
}

export interface HealthCheck {
  category: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    id: 'healthcare',
    name: 'Healthcare Record Linkage',
    description: 'Link patient records across clinics and health facilities',
    icon: 'Hospital',
    matchingConfig: {
      fieldWeights: {
        firstName: 40,
        lastName: 40,
        birthDate: 30,
        gender: 15,
        middleName: 15,
        village: 20,
        subVillage: 15,
        phoneNumber: 20,
        oldestHouseholdMember: 15
      },
      thresholds: {
        high: 85,
        medium: 65,
        low: 45
      }
    },
    features: [
      'Patient consent tracking',
      'Visit history management',
      'Health facility integration',
      'HIPAA compliance audit logs'
    ],
    recommendedSettings: {
      autoMatchThreshold: 85,
      manualReviewThreshold: 65,
      algorithmType: 'probabilistic'
    }
  },
  {
    id: 'census',
    name: 'Population Census',
    description: 'Match and deduplicate census records',
    icon: 'Users',
    matchingConfig: {
      fieldWeights: {
        firstName: 35,
        lastName: 35,
        birthDate: 25,
        gender: 10,
        middleName: 10,
        village: 25,
        subVillage: 20,
        phoneNumber: 15,
        oldestHouseholdMember: 20
      },
      thresholds: {
        high: 80,
        medium: 60,
        low: 40
      }
    },
    features: [
      'Household member tracking',
      'Residency timeline',
      'Location-based matching',
      'Duplicate detection'
    ],
    recommendedSettings: {
      autoMatchThreshold: 80,
      manualReviewThreshold: 60,
      algorithmType: 'deterministic'
    }
  },
  {
    id: 'research',
    name: 'Research Study',
    description: 'Link participant records for research projects',
    icon: 'FlaskConical',
    matchingConfig: {
      fieldWeights: {
        firstName: 45,
        lastName: 45,
        birthDate: 35,
        gender: 20,
        middleName: 20,
        village: 15,
        subVillage: 10,
        phoneNumber: 25,
        oldestHouseholdMember: 10
      },
      thresholds: {
        high: 90,
        medium: 70,
        low: 50
      }
    },
    features: [
      'High precision matching',
      'Detailed audit trail',
      'Data quality checks',
      'Export for analysis'
    ],
    recommendedSettings: {
      autoMatchThreshold: 90,
      manualReviewThreshold: 70,
      algorithmType: 'probabilistic'
    }
  },
  {
    id: 'custom',
    name: 'Custom Configuration',
    description: 'Manually configure all settings',
    icon: 'Settings',
    matchingConfig: {},
    features: [
      'Full customization',
      'All features enabled',
      'Manual threshold setting',
      'Flexible algorithm selection'
    ],
    recommendedSettings: {
      autoMatchThreshold: 80,
      manualReviewThreshold: 60,
      algorithmType: 'deterministic'
    }
  }
];
