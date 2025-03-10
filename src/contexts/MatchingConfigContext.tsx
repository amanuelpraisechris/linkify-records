
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
  const [config, setConfig] = useState<MatchingConfig>(DEFAULT_MATCHING_CONFIG);

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

  return (
    <MatchingConfigContext.Provider value={{ config, updateConfig, updateFieldWeights, resetConfig }}>
      {children}
    </MatchingConfigContext.Provider>
  );
};
