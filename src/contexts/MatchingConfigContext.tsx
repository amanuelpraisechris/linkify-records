
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { FieldWeights } from '@/utils/matchingAlgorithms';
import { useToast } from '@/components/ui/use-toast';
import { 
  MatchingConfigContextType, 
  ExtendedMatchingConfig, 
  AlgorithmType 
} from '@/types/matchingConfig';
import { 
  getInitialConfig, 
  getInitialProfiles,
  saveProfilesToStorage,
  saveConfigToStorage
} from '@/utils/matchingConfigStorage';
import { EXTENDED_DEFAULT_CONFIG } from '@/utils/matchingConfigDefaults';

const MatchingConfigContext = createContext<MatchingConfigContextType | undefined>(undefined);

export const useMatchingConfig = () => {
  const context = useContext(MatchingConfigContext);
  if (!context) {
    throw new Error('useMatchingConfig must be used within a MatchingConfigProvider');
  }
  return context;
};

// Re-export AlgorithmType so consumers don't need to import from types
export type { AlgorithmType } from '@/types/matchingConfig';

interface MatchingConfigProviderProps {
  children: ReactNode;
}

export const MatchingConfigProvider: React.FC<MatchingConfigProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState<ExtendedMatchingConfig>(getInitialConfig());
  const [savedProfiles, setSavedProfiles] = useState<Record<string, ExtendedMatchingConfig>>(getInitialProfiles());
  
  // Save profiles to local storage when they change
  useEffect(() => {
    try {
      saveProfilesToStorage(savedProfiles);
    } catch (error) {
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
      saveConfigToStorage(config);
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
    if (Object.keys(savedProfiles).includes(name) && !Object.keys(getInitialProfiles()).includes(name)) {
      setSavedProfiles(prev => {
        const newProfiles = { ...prev };
        delete newProfiles[name];
        return newProfiles;
      });
      
      toast({
        title: "Profile Deleted",
        description: `"${name}" matching profile has been deleted.`,
      });
    } else {
      toast({
        title: "Cannot Delete Default Profile",
        description: "Default profiles cannot be deleted.",
        variant: "destructive",
      });
    }
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
