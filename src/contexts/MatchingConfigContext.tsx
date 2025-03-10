
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  MatchingConfig, 
  DEFAULT_MATCHING_CONFIG,
  FieldWeights,
  DEFAULT_FIELD_WEIGHTS
} from '@/utils/matchingAlgorithms';

interface MatchingConfigContextType {
  config: MatchingConfig;
  updateConfig: (config: Partial<MatchingConfig>) => void;
  updateFieldWeights: (weights: Partial<FieldWeights>) => void;
  resetConfig: () => void;
  saveConfigProfile: (name: string) => void;
  loadConfigProfile: (name: string) => void;
  availableProfiles: string[];
}

const MatchingConfigContext = createContext<MatchingConfigContextType | undefined>(undefined);

export const useMatchingConfig = () => {
  const context = useContext(MatchingConfigContext);
  if (!context) {
    throw new Error('useMatchingConfig must be used within a MatchingConfigProvider');
  }
  return context;
};

interface MatchingConfigProviderProps {
  children: ReactNode;
}

export const MatchingConfigProvider: React.FC<MatchingConfigProviderProps> = ({ children }) => {
  // Modified the default config to have lower thresholds
  const [config, setConfig] = useState<MatchingConfig>({
    ...DEFAULT_MATCHING_CONFIG,
    threshold: {
      high: 70,  // Lowered from 80
      medium: 50, // Lowered from 60
      low: 30     // Lowered from 40
    }
  });
  
  const [savedProfiles, setSavedProfiles] = useState<Record<string, MatchingConfig>>({
    'Default': DEFAULT_MATCHING_CONFIG,
    'DSS Linkage': {
      ...DEFAULT_MATCHING_CONFIG,
      fieldWeights: {
        ...DEFAULT_FIELD_WEIGHTS,
        firstName: 30,
        lastName: 30,
        tclFirstName: 15,
        tclLastName: 15,
        village: 20,
        subvillage: 15
      },
      threshold: {
        high: 85,
        medium: 70,
        low: 50
      }
    },
    'Lenient Matching': {
      ...DEFAULT_MATCHING_CONFIG,
      threshold: {
        high: 70,
        medium: 50,
        low: 30
      }
    }
  });

  const updateConfig = (newConfig: Partial<MatchingConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig,
    }));
  };

  const updateFieldWeights = (weights: Partial<FieldWeights>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      fieldWeights: {
        ...prevConfig.fieldWeights,
        ...weights,
      },
    }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_MATCHING_CONFIG);
  };

  const saveConfigProfile = (name: string) => {
    setSavedProfiles(prev => ({
      ...prev,
      [name]: { ...config }
    }));
  };

  const loadConfigProfile = (name: string) => {
    if (savedProfiles[name]) {
      setConfig(savedProfiles[name]);
    }
  };

  return (
    <MatchingConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      updateFieldWeights, 
      resetConfig,
      saveConfigProfile,
      loadConfigProfile,
      availableProfiles: Object.keys(savedProfiles)
    }}>
      {children}
    </MatchingConfigContext.Provider>
  );
};
