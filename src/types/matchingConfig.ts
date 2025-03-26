
import { MatchingConfig } from '@/utils/matching/types';

// Constants for localStorage keys
export const CURRENT_CONFIG_KEY = 'matching_config';
export const SAVED_PROFILES_KEY = 'matching_profiles';

export interface ExtendedMatchingConfig extends MatchingConfig {
  // Adding algorithm type for switching between deterministic and probabilistic
  algorithmType: 'deterministic' | 'probabilistic';
}

// Export the algorithm type as a separate type
export type AlgorithmType = 'deterministic' | 'probabilistic';
