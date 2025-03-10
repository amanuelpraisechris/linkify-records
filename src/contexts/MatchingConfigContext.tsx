
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
  // Modified the default config to have very low thresholds for better match detection
  const [config, setConfig] = useState<MatchingConfig>({
    ...DEFAULT_MATCHING_CONFIG,
    threshold: {
      high: 60,  // Lowered for better matching
      medium: 35, // Lowered for better matching
      low: 15     // Lowered for better matching
    }
  });
  
  const [savedProfiles, setSavedProfiles] = useState<Record<string, MatchingConfig>>({
    'Default': DEFAULT_MATCHING_CONFIG,
    'DSS Linkage': {
      ...DEFAULT_MATCHING_CONFIG,
      fieldWeights: {
        ...DEFAULT_FIELD_WEIGHTS,
        firstName: 35,
        lastName: 35,
        birthDate: 25,
        balozi: 10,
        village: 15,
        district: 10
      },
      threshold: {
        high: 85,
        medium: 70,
        low: 50
      }
    },
    'Name Priority': {
      ...DEFAULT_MATCHING_CONFIG,
      fieldWeights: {
        ...DEFAULT_FIELD_WEIGHTS,
        firstName: 40,
        lastName: 40,
        birthDate: 25,
        gender: 10,
        village: 15,
        balozi: 5
      },
      threshold: {
        high: 70,
        medium: 45,
        low: 25
      }
    },
    'Lenient Matching': {
      ...DEFAULT_MATCHING_CONFIG,
      threshold: {
        high: 60,
        medium: 35,
        low: 15
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
