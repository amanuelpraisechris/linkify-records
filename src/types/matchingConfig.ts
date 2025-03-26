
import { MatchingConfig } from '@/utils/matching/types';

export interface ExtendedMatchingConfig extends MatchingConfig {
  // Adding algorithm type for switching between deterministic and probabilistic
  algorithmType: 'deterministic' | 'probabilistic';
}

// Add the missing constants
export const CURRENT_CONFIG_KEY = 'matching_config';
export const SAVED_PROFILES_KEY = 'matching_profiles';
