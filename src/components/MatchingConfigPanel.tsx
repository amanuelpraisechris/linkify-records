import React, { useState } from 'react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { SupportedLanguage } from '@/utils/languageUtils';

const MatchingConfigPanel = () => {
  const { config, updateConfig, updateFieldWeights, resetConfig } = useMatchingConfig();
  const [localWeights, setLocalWeights] = useState(config.fieldWeights);
  const [localThresholds, setLocalThresholds] = useState(config.threshold);
  const [localFuzzyMatching, setLocalFuzzyMatching] = useState(config.fuzzyMatching);
  const [localLanguageConfig, setLocalLanguageConfig] = useState(config.languageConfig);
  const { toast } = useToast();

  const handleWeightChange = (field: string, value: number[]) => {
    setLocalWeights((prev) => ({
      ...prev,
      [field]: value[0],
    }));
  };

  const handleThresholdChange = (level: 'high' | 'medium' | 'low', value: number[]) => {
    setLocalThresholds((prev) => ({
      ...prev,
      [level]: value[0],
    }));
  };

  const handleLanguageChange = (value: SupportedLanguage) => {
    setLocalLanguageConfig((prev) => ({
      ...prev,
      defaultLanguage: value,
    }));
  };

  const handleToggleScriptDetection = (checked: boolean) => {
    setLocalLanguageConfig((prev) => ({
      ...prev,
      enableScriptDetection: checked,
    }));
  };

  const handleToggleFuzzyMatching = (checked: boolean) => {
    setLocalFuzzyMatching(checked);
  };

  const handleSaveChanges = () => {
    // Apply field weights changes
    updateFieldWeights(localWeights);
    
    // Apply other configuration changes
    updateConfig({
      threshold: localThresholds,
      fuzzyMatching: localFuzzyMatching,
      languageConfig: localLanguageConfig,
    });

    toast({
      title: "Configuration Saved",
      description: "The matching configuration has been updated.",
      duration: 3000,
    });
  };

  const handleReset = () => {
    resetConfig();
    setLocalWeights(config.fieldWeights);
    setLocalThresholds(config.threshold);
    setLocalFuzzyMatching(config.fuzzyMatching);
    setLocalLanguageConfig(config.languageConfig);
    
    toast({
      title: "Configuration Reset",
      description: "The matching configuration has been reset to defaults.",
      duration: 3000,
    });
  };

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Matching Configuration</CardTitle>
        <CardDescription>
          Configure the weights and thresholds used for record matching
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weights">
          <TabsList className="mb-4">
            <TabsTrigger value="weights">Field Weights</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weights" className="space-y-4">
            <div className="grid gap-6">
              {Object.keys(localWeights).map((field) => (
                <div key={field} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`weight-${field}`} className="capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <span className="text-sm font-medium">{localWeights[field]}</span>
                  </div>
                  <Slider
                    id={`weight-${field}`}
                    min={0}
                    max={50}
                    step={5}
                    value={[localWeights[field]]}
                    onValueChange={(value) => handleWeightChange(field, value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="thresholds" className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="threshold-high">High Confidence Threshold</Label>
                <span className="text-sm font-medium">{localThresholds.high}%</span>
              </div>
              <Slider
                id="threshold-high"
                min={50}
                max={100}
                step={5}
                value={[localThresholds.high]}
                onValueChange={(value) => handleThresholdChange('high', value)}
              />
              <p className="text-xs text-muted-foreground">
                Records with match scores above this threshold will be considered high confidence matches
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="threshold-medium">Medium Confidence Threshold</Label>
                <span className="text-sm font-medium">{localThresholds.medium}%</span>
              </div>
              <Slider
                id="threshold-medium"
                min={30}
                max={80}
                step={5}
                value={[localThresholds.medium]}
                onValueChange={(value) => handleThresholdChange('medium', value)}
              />
              <p className="text-xs text-muted-foreground">
                Records with match scores above this threshold will be considered medium confidence matches
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="threshold-low">Low Confidence Threshold</Label>
                <span className="text-sm font-medium">{localThresholds.low}%</span>
              </div>
              <Slider
                id="threshold-low"
                min={10}
                max={60}
                step={5}
                value={[localThresholds.low]}
                onValueChange={(value) => handleThresholdChange('low', value)}
              />
              <p className="text-xs text-muted-foreground">
                Records with match scores above this threshold will be included in potential matches
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="fuzzy-matching"
                checked={localFuzzyMatching}
                onCheckedChange={handleToggleFuzzyMatching}
              />
              <Label htmlFor="fuzzy-matching">Enable fuzzy matching</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default-language">Default Language</Label>
              <Select
                value={localLanguageConfig.defaultLanguage}
                onValueChange={(value) => handleLanguageChange(value as SupportedLanguage)}
              >
                <SelectTrigger id="default-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latin">Latin (English)</SelectItem>
                  <SelectItem value="amharic">አማርኛ (Amharic)</SelectItem>
                  <SelectItem value="tigrinya">ትግርኛ (Tigrinya)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The default language to use for text normalization and comparison
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="script-detection"
                checked={localLanguageConfig.enableScriptDetection}
                onCheckedChange={handleToggleScriptDetection}
              />
              <Label htmlFor="script-detection">Enable automatic script detection</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically detect Ethiopian scripts and apply appropriate normalization
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingConfigPanel;
