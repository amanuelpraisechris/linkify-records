
import { ExtendedMatchingConfig } from '@/types/matchingConfig';
import { CURRENT_CONFIG_KEY, SAVED_PROFILES_KEY } from '@/types/matchingConfig';
import { DEFAULT_PROFILES, GOLD_STANDARD_CONFIG } from './matchingConfigDefaults';

export const getInitialProfiles = (): Record<string, ExtendedMatchingConfig> => {
  try {
    const savedProfilesJson = localStorage.getItem(SAVED_PROFILES_KEY);
    return savedProfilesJson ? 
      { ...DEFAULT_PROFILES, ...JSON.parse(savedProfilesJson) } : 
      DEFAULT_PROFILES;
  } catch (error) {
    console.error('Failed to load saved matching profiles:', error);
    return DEFAULT_PROFILES;
  }
};

export const getInitialConfig = (): ExtendedMatchingConfig => {
  try {
    const currentConfigJson = localStorage.getItem(CURRENT_CONFIG_KEY);
    // Use Gold Standard as the default configuration
    const defaultConfig = GOLD_STANDARD_CONFIG;
    
    const parsedConfig = currentConfigJson ?
      JSON.parse(currentConfigJson) :
      defaultConfig;
    
    // Ensure algorithmType exists in loaded config
    if (!parsedConfig.algorithmType) {
      parsedConfig.algorithmType = 'probabilistic';
    }
    
    return parsedConfig;
  } catch (error) {
    console.error('Failed to load current matching config:', error);
    return GOLD_STANDARD_CONFIG;
  }
};

export const saveProfilesToStorage = (savedProfiles: Record<string, ExtendedMatchingConfig>): void => {
  try {
    // Only save user-defined profiles, not the defaults
    const userProfiles = { ...savedProfiles };
    Object.keys(DEFAULT_PROFILES).forEach(key => {
      delete userProfiles[key];
    });
    
    if (Object.keys(userProfiles).length > 0) {
      localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(userProfiles));
    }
  } catch (error) {
    console.error('Failed to save matching profiles:', error);
    throw error;
  }
};

export const saveConfigToStorage = (config: ExtendedMatchingConfig): void => {
  try {
    localStorage.setItem(CURRENT_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save current matching config:', error);
    throw error;
  }
};
