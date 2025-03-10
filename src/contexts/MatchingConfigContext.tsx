import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  MatchingConfig, 
  DEFAULT_MATCHING_CONFIG,
  FieldWeights,
  DEFAULT_FIELD_WEIGHTS
} from '@/utils/matchingAlgorithms';
import { useToast } from '@/components/ui/use-toast';

// Algorithm types definition
export type AlgorithmType = 'deterministic' | 'probabilistic';

// Extended MatchingConfig interface to include algorithm type
export interface ExtendedMatchingConfig extends MatchingConfig {
  algorithmType: AlgorithmType;
}

// Modified field weights to exclude Balozi information and prioritize FirstName and LastName
const UPDATED_FIELD_WEIGHTS: FieldWeights = {
  ...DEFAULT_FIELD_WEIGHTS,
  firstName: 45,
  lastName: 45,
  middleName: 20,
  birthDate: 30,
  gender: 15,
  village: 25,
  district: 20,
  motherName: 25,
  householdHead: 25,
  phoneNumber: 20
  // Note: baloziFirstName, baloziMiddleName, and baloziLastName are intentionally omitted
};

// Extended default config
const EXTENDED_DEFAULT_CONFIG: ExtendedMatchingConfig = {
  ...DEFAULT_MATCHING_CONFIG,
  fieldWeights: UPDATED_FIELD_WEIGHTS,
  algorithmType: 'deterministic'
};

interface MatchingConfigContextType {
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

const MatchingConfigContext = createContext<MatchingConfigContextType | undefined>(undefined);

export const useMatchingConfig = () => {
  const context = useContext(MatchingConfigContext);
  if (!context) {
    throw new Error('useMatchingConfig must be used within a MatchingConfigProvider');
  }
  return context;
};

// Local Storage key
const SAVED_PROFILES_KEY = 'matching-config-profiles';
const CURRENT_CONFIG_KEY = 'matching-config-current';

interface MatchingConfigProviderProps {
  children: ReactNode;
}

export const MatchingConfigProvider: React.FC<MatchingConfigProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  // Default profiles with extended config
  const defaultProfiles: Record<string, ExtendedMatchingConfig> = {
    'Default': EXTENDED_DEFAULT_CONFIG,
    'DSS Linkage': {
      ...EXTENDED_DEFAULT_CONFIG,
      fieldWeights: {
        ...UPDATED_FIELD_WEIGHTS,
        firstName: 40,
        lastName: 40,
        middleName: 15,
        birthDate: 25,
        village: 20,
        district: 15,
        phoneNumber: 20,
        householdHead: 15
      },
      threshold: {
        high: 85,
        medium: 70,
        low: 50
      }
    },
    'Name Priority': {
      ...EXTENDED_DEFAULT_CONFIG,
      fieldWeights: {
        ...UPDATED_FIELD_WEIGHTS,
        firstName: 45, // Further increased for name priority profile
        lastName: 45,  // Further increased for name priority profile
        middleName: 20, // Added middleName with good weight
        birthDate: 25,
        gender: 15,
        village: 20,
        phoneNumber: 20
      },
      threshold: {
        high: 70,
        medium: 45,
        low: 25
      }
    },
    'Lenient Matching': {
      ...EXTENDED_DEFAULT_CONFIG,
      threshold: {
        high: 60,
        medium: 35,
        low: 15
      }
    },
    'Probabilistic': {
      ...EXTENDED_DEFAULT_CONFIG,
      algorithmType: 'probabilistic',
      threshold: {
        high: 70,
        medium: 50,
        low: 30
      }
    }
  };
  
  // Get initial saved profiles from local storage if available
  const initSavedProfiles = () => {
    try {
      const savedProfilesJson = localStorage.getItem(SAVED_PROFILES_KEY);
      return savedProfilesJson ? 
        { ...defaultProfiles, ...JSON.parse(savedProfilesJson) } : 
        defaultProfiles;
    } catch (error) {
      console.error('Failed to load saved matching profiles:', error);
      return defaultProfiles;
    }
  };
  
  // Get current config from local storage if available
  const initCurrentConfig = () => {
    try {
      const currentConfigJson = localStorage.getItem(CURRENT_CONFIG_KEY);
      // Modified the default config to have very low thresholds for better match detection
      const defaultConfig = {
        ...EXTENDED_DEFAULT_CONFIG,
        threshold: {
          high: 60,  // Lowered for better matching
          medium: 35, // Lowered for better matching
          low: 15     // Lowered for better matching
        }
      };
      
      const parsedConfig = currentConfigJson ?
        JSON.parse(currentConfigJson) :
        defaultConfig;
      
      // Ensure algorithmType exists in loaded config
      if (!parsedConfig.algorithmType) {
        parsedConfig.algorithmType = 'deterministic';
      }
      
      return parsedConfig;
    } catch (error) {
      console.error('Failed to load current matching config:', error);
      return EXTENDED_DEFAULT_CONFIG;
    }
  };
  
  const [config, setConfig] = useState<ExtendedMatchingConfig>(initCurrentConfig());
  const [savedProfiles, setSavedProfiles] = useState<Record<string, ExtendedMatchingConfig>>(initSavedProfiles());
  
  // Save profiles to local storage when they change
  useEffect(() => {
    try {
      // Only save user-defined profiles, not the defaults
      const userProfiles = { ...savedProfiles };
      Object.keys(defaultProfiles).forEach(key => {
        delete userProfiles[key];
      });
      
      if (Object.keys(userProfiles).length > 0) {
        localStorage.setItem(SAVED_PROFILES_KEY, JSON.stringify(userProfiles));
      }
    } catch (error) {
      console.error('Failed to save matching profiles:', error);
      toast({
        title: "Error Saving Profiles",
        description: "There was an error saving your matching profiles.",
        variant: "destructive",
      });
    }
  }, [savedProfiles, toast]);
  
  // Save current config to local storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save current matching config:', error);
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<ExtendedMatchingConfig>) => {
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
    setConfig(EXTENDED_DEFAULT_CONFIG);
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
  
  const deleteConfigProfile = (name: string) => {
    // Don't allow deletion of default profiles
    if (Object.keys(defaultProfiles).includes(name)) {
      toast({
        title: "Cannot Delete Default Profile",
        description: "Default profiles cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    setSavedProfiles(prev => {
      const newProfiles = { ...prev };
      delete newProfiles[name];
      return newProfiles;
    });
    
    toast({
      title: "Profile Deleted",
      description: `"${name}" matching profile has been deleted.`,
    });
  };
  
  const exportConfigToJson = () => {
    return JSON.stringify(config, null, 2);
  };
  
  const importConfigFromJson = (jsonString: string) => {
    try {
      const importedConfig = JSON.parse(jsonString);
      
      // Basic validation that it's a matching config
      if (!importedConfig.fieldWeights || !importedConfig.threshold) {
        throw new Error('Invalid configuration format');
      }
      
      // Ensure algorithm type exists
      if (!importedConfig.algorithmType) {
        importedConfig.algorithmType = 'deterministic';
      }
      
      setConfig(importedConfig as ExtendedMatchingConfig);
      toast({
        title: "Configuration Imported",
        description: "The matching configuration has been imported successfully.",
      });
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      toast({
        title: "Import Failed",
        description: "The configuration could not be imported. Please check the format.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const setAlgorithmType = (type: AlgorithmType) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      algorithmType: type
    }));
    
    toast({
      title: "Algorithm Type Changed",
      description: `Matching algorithm changed to ${type}.`,
    });
  };

  return (
    <MatchingConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      updateFieldWeights, 
      resetConfig,
      saveConfigProfile,
      loadConfigProfile,
      availableProfiles: Object.keys(savedProfiles),
      deleteConfigProfile,
      exportConfigToJson,
      importConfigFromJson,
      setAlgorithmType
    }}>
      {children}
    </MatchingConfigContext.Provider>
  );
};
