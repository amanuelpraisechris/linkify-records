
import { FieldWeights, MatchingConfig } from '@/utils/matching';

// Algorithm types definition
export type AlgorithmType = 'deterministic' | 'probabilistic';

// Extended MatchingConfig interface to include algorithm type
export interface ExtendedMatchingConfig extends MatchingConfig {
  algorithmType: AlgorithmType;
}

// Context type definition
export interface MatchingConfigContextType {
  config: ExtendedMatchingConfig;
  updateConfig: (config: Partial<ExtendedMatchingConfig>) => void;
  updateFieldWeights: (weights: Partial<FieldWeights>) => void;
  resetConfig: () => void;
  saveConfigProfile: (name: string) => void;
  loadConfigProfile: (name: string) => void;
  availableProfiles: string[];
  deleteConfigProfile: (name: string) => void;
  exportConfigToJson: () => string;
  importConfigFromJson: (jsonString: string) => boolean;
  setAlgorithmType: (type: AlgorithmType) => void;
}

// Local Storage key constants
export const SAVED_PROFILES_KEY = 'matching-config-profiles';
export const CURRENT_CONFIG_KEY = 'matching-config-current';
