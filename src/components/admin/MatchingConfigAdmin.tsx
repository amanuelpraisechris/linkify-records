import React, { useState } from 'react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Settings, 
  SlidersHorizontal, 
  Search, 
  BarChart3, 
  Plus, 
  X,
  Check,
  Copy
} from 'lucide-react';
import { FieldWeights } from '@/utils/matchingAlgorithms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

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

  const handleWeightChange = (field: keyof FieldWeights, value: number) => {
    updateFieldWeights({ [field]: value });
  };

  const handleThresholdChange = (level: 'high' | 'medium' | 'low', value: number[]) => {
    updateConfig({
      threshold: {
        ...config.threshold,
        [level]: value[0]
      }
    });
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

  const handleToggleFuzzyMatching = (checked: boolean) => {
    updateConfig({
      fuzzyMatching: checked
    });
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
          <TabsList className="grid w-full grid-cols-3">
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
          </TabsList>
          
          <TabsContent value="weights" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Primary Identifiers</h3>
                <div className="space-y-4">
                  <FieldWeightSlider 
                    label="First Name" 
                    value={config.fieldWeights.firstName} 
                    onChange={(val) => handleWeightChange('firstName', val)} 
                  />
                  <FieldWeightSlider 
                    label="Last Name" 
                    value={config.fieldWeights.lastName} 
                    onChange={(val) => handleWeightChange('lastName', val)} 
                  />
                  <FieldWeightSlider 
                    label="Birth Date" 
                    value={config.fieldWeights.birthDate} 
                    onChange={(val) => handleWeightChange('birthDate', val)} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Secondary Identifiers</h3>
                <div className="space-y-4">
                  <FieldWeightSlider 
                    label="Gender" 
                    value={config.fieldWeights.gender} 
                    onChange={(val) => handleWeightChange('gender', val)} 
                  />
                  <FieldWeightSlider 
                    label="Village" 
                    value={config.fieldWeights.village} 
                    onChange={(val) => handleWeightChange('village', val)} 
                  />
                  <FieldWeightSlider 
                    label="Sub-Village" 
                    value={config.fieldWeights.subVillage} 
                    onChange={(val) => handleWeightChange('subVillage', val)} 
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Additional Identifiers</h3>
                <div className="space-y-4">
                  <FieldWeightSlider 
                    label="Household Head" 
                    value={config.fieldWeights.householdHead} 
                    onChange={(val) => handleWeightChange('householdHead', val)} 
                  />
                  <FieldWeightSlider 
                    label="Phone Number" 
                    value={config.fieldWeights.phoneNumber} 
                    onChange={(val) => handleWeightChange('phoneNumber', val)} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Location Identifiers</h3>
                <div className="space-y-4">
                  <FieldWeightSlider 
                    label="Balozi" 
                    value={config.fieldWeights.balozi} 
                    onChange={(val) => handleWeightChange('balozi', val)} 
                  />
                </div>
              </div>
            </div>

            <WeightChart fieldWeights={config.fieldWeights} />
          </TabsContent>
          
          <TabsContent value="thresholds" className="space-y-6 pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>High Match Threshold ({config.threshold.high}%)</Label>
                  <Badge variant="default" className="bg-green-500">High Match</Badge>
                </div>
                <Slider
                  value={[config.threshold.high]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleThresholdChange('high', value)}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground">
                  Records with a match score at or above this threshold will be considered a high confidence match.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Medium Match Threshold ({config.threshold.medium}%)</Label>
                  <Badge variant="default" className="bg-amber-500">Medium Match</Badge>
                </div>
                <Slider
                  value={[config.threshold.medium]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleThresholdChange('medium', value)}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground">
                  Records with a match score between medium and high thresholds will be considered medium confidence matches.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Low Match Threshold ({config.threshold.low}%)</Label>
                  <Badge variant="outline" className="text-muted-foreground">Low Match</Badge>
                </div>
                <Slider
                  value={[config.threshold.low]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleThresholdChange('low', value)}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground">
                  Records with a match score between low and medium thresholds will be considered low confidence matches.
                </p>
              </div>
              
              <div className="pt-6">
                <ThresholdVisualizer 
                  high={config.threshold.high}
                  medium={config.threshold.medium}
                  low={config.threshold.low}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fuzzy-matching">Fuzzy Name Matching</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Levenshtein distance algorithm for fuzzy name matching
                  </p>
                </div>
                <Switch
                  id="fuzzy-matching"
                  checked={config.fuzzyMatching}
                  onCheckedChange={handleToggleFuzzyMatching}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>Language Configuration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select 
                      value={config.languageConfig.defaultLanguage}
                      onValueChange={(value) => updateConfig({
                        languageConfig: {
                          ...config.languageConfig,
                          defaultLanguage: value as any
                        }
                      })}
                    >
                      <SelectTrigger id="default-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latin">Latin (English/Swahili)</SelectItem>
                        <SelectItem value="amharic">Amharic</SelectItem>
                        <SelectItem value="tigrinya">Tigrinya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="script-detection">Auto Script Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically detect script (e.g., Latin vs Ethiopic)
                      </p>
                    </div>
                    <Switch
                      id="script-detection"
                      checked={config.languageConfig.enableScriptDetection}
                      onCheckedChange={(checked) => updateConfig({
                        languageConfig: {
                          ...config.languageConfig,
                          enableScriptDetection: checked
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
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
          <Check className="w-4 h-4 mr-1 text-green-500" />
          Changes are applied automatically
        </div>
      </CardFooter>
    </Card>
  );
};

const FieldWeightSlider = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="font-medium">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={50}
        step={5}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};

const WeightChart = ({ fieldWeights }: { fieldWeights: FieldWeights }) => {
  const sortedWeights = Object.entries(fieldWeights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  
  const totalWeight = sortedWeights.reduce((sum, [, weight]) => sum + weight, 0);
  
  return (
    <div className="mt-6 pt-4 border-t">
      <h3 className="font-medium mb-4">Weight Distribution</h3>
      <div className="space-y-2">
        {sortedWeights.map(([field, weight]) => {
          const percentage = (weight / totalWeight) * 100;
          const formattedField = field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          
          return (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{formattedField}</span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ThresholdVisualizer = ({ 
  high, 
  medium, 
  low 
}: { 
  high: number; 
  medium: number; 
  low: number;
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-2">Threshold Visualization</h3>
      <div className="relative w-full h-8 bg-gray-100 rounded-md">
        <div 
          className="absolute h-full rounded-l-md border-r border-gray-200 bg-gray-200"
          style={{ width: `${low}%` }}
        ></div>
        
        <div 
          className="absolute h-full border-r border-gray-200 bg-amber-200"
          style={{ left: `${low}%`, width: `${medium - low}%` }}
        ></div>
        
        <div 
          className="absolute h-full rounded-r-md bg-green-200"
          style={{ left: `${medium}%`, width: `${100 - medium}%` }}
        ></div>
        
        <div className="absolute w-full flex justify-between text-xs text-gray-500 px-2 pt-9">
          <span className="absolute left-0">0%</span>
          <span className="absolute" style={{ left: `${low}%`, transform: 'translateX(-50%)' }}>{low}%</span>
          <span className="absolute" style={{ left: `${medium}%`, transform: 'translateX(-50%)' }}>{medium}%</span>
          <span className="absolute" style={{ left: `${high}%`, transform: 'translateX(-50%)' }}>{high}%</span>
          <span className="absolute right-0">100%</span>
        </div>
      </div>
      
      <div className="flex justify-between mt-8 text-xs">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-gray-200 mr-2 rounded-sm"></span>
          <span>Low Confidence</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-amber-200 mr-2 rounded-sm"></span>
          <span>Medium Confidence</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-200 mr-2 rounded-sm"></span>
          <span>High Confidence</span>
        </div>
      </div>
    </div>
  );
};

export default MatchingConfigAdmin;
