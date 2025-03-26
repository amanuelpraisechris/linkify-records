
import React, { useState } from 'react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Save, Settings, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { FieldWeights } from '@/utils/matching';
import { FieldWeightsTab } from './matching-config/FieldWeightsTab';
import { ThresholdsTab } from './matching-config/ThresholdsTab';
import { AdvancedSettingsTab } from './matching-config/AdvancedSettingsTab';
import { AlgorithmTypeTab } from './algorithm-config/AlgorithmTypeTab';

const MatchingConfigAdmin = () => {
  const { 
    config, 
    updateConfig, 
    updateFieldWeights, 
    resetConfig, 
    saveConfigProfile, 
    loadConfigProfile, 
    availableProfiles 
  } = useMatchingConfig();
  
  const [newProfileName, setNewProfileName] = useState('');
  const [activeTab, setActiveTab] = useState('weights');
  const { toast } = useToast();

  const handleSaveProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid profile name",
        variant: "destructive"
      });
      return;
    }
    
    saveConfigProfile(newProfileName);
    toast({
      title: "Profile Saved",
      description: `"${newProfileName}" matching profile has been saved successfully.`
    });
    setNewProfileName('');
  };

  const handleLoadProfile = (profileName: string) => {
    loadConfigProfile(profileName);
    toast({
      title: "Profile Loaded",
      description: `"${profileName}" matching profile has been loaded.`
    });
  };

  const handleReset = () => {
    resetConfig();
    toast({
      title: "Settings Reset",
      description: "Matching configuration has been reset to default values."
    });
  };

  // Fix the type issue when updating field weights
  const handleFieldWeightChange = (field: keyof FieldWeights, value: number) => {
    // Create a properly typed update
    const weightUpdate: Partial<FieldWeights> = {};
    weightUpdate[field] = value;
    
    // Apply the update
    updateFieldWeights(weightUpdate);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Matching Configuration
            </CardTitle>
            <CardDescription>
              Configure parameters for patient record matching algorithms
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value="" onValueChange={handleLoadProfile}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Load Profile" />
              </SelectTrigger>
              <SelectContent>
                {availableProfiles.map(profile => (
                  <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="shrink-0"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weights" className="flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Field Weights
            </TabsTrigger>
            <TabsTrigger value="thresholds" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Match Thresholds
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Algorithm Type
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="weights">
            <FieldWeightsTab 
              config={config} 
              onWeightChange={handleFieldWeightChange} 
            />
          </TabsContent>
          
          <TabsContent value="thresholds">
            <ThresholdsTab 
              config={config}
              onThresholdChange={(level, value) => updateConfig({
                threshold: {
                  ...config.threshold,
                  [level]: value[0]
                }
              })}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedSettingsTab 
              config={config}
              onConfigUpdate={updateConfig}
            />
          </TabsContent>
          
          <TabsContent value="algorithm">
            <AlgorithmTypeTab />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Input
            placeholder="New profile name"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSaveProfile} className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          Changes are applied automatically
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchingConfigAdmin;

