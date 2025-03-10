
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  MatchingConfig, 
  DEFAULT_MATCHING_CONFIG,
  FieldWeights,
  DEFAULT_FIELD_WEIGHTS
} from '@/utils/matchingAlgorithms';
import { useToast } from '@/components/ui/use-toast';

interface MatchingConfigContextType {
  config: MatchingConfig;
  updateConfig: (config: Partial<MatchingConfig>) => void;
  updateFieldWeights: (weights: Partial<FieldWeights>) => void;
  resetConfig: () => void;
  saveConfigProfile: (name: string) => void;
  loadConfigProfile: (name: string) => void;
  availableProfiles: string[];
  deleteConfigProfile: (name: string) => void;
  exportConfigToJson: () => string;
  importConfigFromJson: (jsonString: string) => boolean;
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
  
  // Default profiles
  const defaultProfiles: Record<string, MatchingConfig> = {
    'Default': DEFAULT_MATCHING_CONFIG,
    'DSS Linkage': {
      ...DEFAULT_MATCHING_CONFIG,
      fieldWeights: {
        ...DEFAULT_FIELD_WEIGHTS,
        firstName: 35,
        lastName: 35,
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
      ...DEFAULT_MATCHING_CONFIG,
      fieldWeights: {
        ...DEFAULT_FIELD_WEIGHTS,
        firstName: 40,
        lastName: 40,
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
      ...DEFAULT_MATCHING_CONFIG,
      threshold: {
        high: 60,
        medium: 35,
        low: 15
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
        ...DEFAULT_MATCHING_CONFIG,
        threshold: {
          high: 60,  // Lowered for better matching
          medium: 35, // Lowered for better matching
          low: 15     // Lowered for better matching
        }
      };
      
      return currentConfigJson ?
        JSON.parse(currentConfigJson) :
        defaultConfig;
    } catch (error) {
      console.error('Failed to load current matching config:', error);
      return DEFAULT_MATCHING_CONFIG;
    }
  };
  
  const [config, setConfig] = useState<MatchingConfig>(initCurrentConfig());
  const [savedProfiles, setSavedProfiles] = useState<Record<string, MatchingConfig>>(initSavedProfiles());
  
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
      
      setConfig(importedConfig);
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
      importConfigFromJson
    }}>
      {children}
    </MatchingConfigContext.Provider>
  );
};
