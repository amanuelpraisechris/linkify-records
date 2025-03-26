
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { FieldWeights } from '@/utils/matching';
import { DEFAULT_PROFILES, EXTENDED_DEFAULT_CONFIG, GOLD_STANDARD_CONFIG } from '@/utils/matchingConfigDefaults';
import { ExtendedMatchingConfig } from '@/types/matchingConfig';

// Export this type for use in other components
export type AlgorithmType = 'deterministic' | 'probabilistic';

interface MatchingConfigContextType {
  config: ExtendedMatchingConfig;
  updateFieldWeights: (weights: FieldWeights) => void;
  resetConfig: () => void;
  updateThresholds: (thresholds: { high: number; medium: number; low: number }) => void;
  saveConfigProfile: (name: string) => void;
  loadConfigProfile: (name: string) => void;
  availableProfiles: string[];
  defaultConfig: ExtendedMatchingConfig;
  // Add the missing methods
  updateConfig: (partialConfig: Partial<ExtendedMatchingConfig>) => void;
  setAlgorithmType: (type: AlgorithmType) => void;
}

const MatchingConfigContext = createContext<MatchingConfigContextType | undefined>(undefined);

interface MatchingConfigProviderProps {
  children: ReactNode;
  initialConfig?: ExtendedMatchingConfig;
}

export const MatchingConfigProvider: React.FC<MatchingConfigProviderProps> = ({ 
  children,
  initialConfig = GOLD_STANDARD_CONFIG // Use Gold Standard as default
}) => {
  const [config, setConfig] = useState<ExtendedMatchingConfig>(initialConfig);
  const [profiles, setProfiles] = useState<Record<string, ExtendedMatchingConfig>>(DEFAULT_PROFILES);
  
  // Update config from localStorage if available
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('matching_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
      
      const savedProfiles = localStorage.getItem('matching_profiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
    } catch (error) {
      console.error('Error loading matching configuration:', error);
    }
  }, []);
  
  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('matching_config', JSON.stringify(config));
    } catch (error) {
      console.error('Error saving matching configuration:', error);
    }
  }, [config]);
  
  // Save profiles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('matching_profiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving matching profiles:', error);
    }
  }, [profiles]);
  
  const updateFieldWeights = (weights: FieldWeights) => {
    setConfig(prev => ({
      ...prev,
      fieldWeights: {
        ...prev.fieldWeights,
        ...weights
      }
    }));
  };
  
  const resetConfig = () => {
    setConfig(GOLD_STANDARD_CONFIG);
  };
  
  const updateThresholds = (thresholds: { high: number; medium: number; low: number }) => {
    setConfig(prev => ({
      ...prev,
      threshold: thresholds
    }));
  };
  
  // Add the missing updateConfig method
  const updateConfig = (partialConfig: Partial<ExtendedMatchingConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...partialConfig
    }));
  };
  
  // Add the missing setAlgorithmType method
  const setAlgorithmType = (type: AlgorithmType) => {
    setConfig(prev => ({
      ...prev,
      algorithmType: type
    }));
  };
  
  const saveConfigProfile = (name: string) => {
    setProfiles(prev => ({
      ...prev,
      [name]: config
    }));
  };
  
  const loadConfigProfile = (name: string) => {
    if (profiles[name]) {
      setConfig(profiles[name]);
    }
  };
  
  return (
    <MatchingConfigContext.Provider 
      value={{ 
        config, 
        updateFieldWeights, 
        resetConfig,
        updateThresholds,
        saveConfigProfile,
        loadConfigProfile,
        availableProfiles: Object.keys(profiles),
        defaultConfig: GOLD_STANDARD_CONFIG,
        // Include the new methods
        updateConfig,
        setAlgorithmType
      }}
    >
      {children}
    </MatchingConfigContext.Provider>
  );
};

export const useMatchingConfig = () => {
  const context = useContext(MatchingConfigContext);
  if (!context) {
    throw new Error('useMatchingConfig must be used within a MatchingConfigProvider');
  }
  return context;
};
