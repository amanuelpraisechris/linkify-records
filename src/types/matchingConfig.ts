
import { MatchingConfig } from '@/utils/matching/types';

export interface ExtendedMatchingConfig extends MatchingConfig {
  // Adding algorithm type for switching between deterministic and probabilistic
  algorithmType: 'deterministic' | 'probabilistic';
}
