
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { FieldWeights } from '@/utils/matching';
import { DEFAULT_PROFILES, EXTENDED_DEFAULT_CONFIG, GOLD_STANDARD_CONFIG } from '@/utils/matchingConfigDefaults';
import { ExtendedMatchingConfig, AlgorithmType } from '@/types/matchingConfig';
import { saveConfigToStorage, saveProfilesToStorage, getInitialConfig, getInitialProfiles } from '@/utils/matchingConfigStorage';

interface MatchingConfigContextType {
  config: ExtendedMatchingConfig;
  updateFieldWeights: (weights: FieldWeights) => void;
  resetConfig: () => void;
  updateThresholds: (thresholds: { high: number; medium: number; low: number }) => void;
  saveConfigProfile: (name: string) => void;
  loadConfigProfile: (name: string) => void;
  availableProfiles: string[];
  defaultConfig: ExtendedMatchingConfig;
  // Add the missing functions
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
  const [config, setConfig] = useState<ExtendedMatchingConfig>(getInitialConfig());
  const [profiles, setProfiles] = useState<Record<string, ExtendedMatchingConfig>>(getInitialProfiles());
  
  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      saveConfigToStorage(config);
    } catch (error) {
      console.error('Error saving matching configuration:', error);
    }
  }, [config]);
  
  // Save profiles to localStorage whenever they change
  useEffect(() => {
    try {
      saveProfilesToStorage(profiles);
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
  
  const updateConfig = (partialConfig: Partial<ExtendedMatchingConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...partialConfig
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
  
  const setAlgorithmType = (type: AlgorithmType) => {
    setConfig(prev => ({
      ...prev,
      algorithmType: type
    }));
  };
  
  return (
    <MatchingConfigContext.Provider 
      value={{ 
        config, 
        updateFieldWeights,
        updateConfig,
        resetConfig,
        updateThresholds,
        saveConfigProfile,
        loadConfigProfile,
        availableProfiles: Object.keys(profiles),
        defaultConfig: GOLD_STANDARD_CONFIG,
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

// Export the AlgorithmType for components that need it
export type { AlgorithmType };
