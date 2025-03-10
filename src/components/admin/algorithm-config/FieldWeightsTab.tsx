
import React, { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw, XCircle, AlertCircle } from 'lucide-react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fieldDescriptions } from './types';
import { FieldWeightInput } from './FieldWeightInput';

export const FieldWeightsTab: React.FC = () => {
  const { config, updateFieldWeights, resetConfig, saveConfigProfile } = useMatchingConfig();
  const { toast } = useToast();
  
  const [fieldWeights, setFieldWeights] = useState(config.fieldWeights);
  const [profileName, setProfileName] = useState('');
  
  useEffect(() => {
    setFieldWeights(config.fieldWeights);
  }, [config.fieldWeights]);
  
  const handleWeightChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setFieldWeights(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const saveWeights = () => {
    updateFieldWeights(fieldWeights);
    toast({
      title: "Configuration Updated",
      description: "Matching algorithm weights have been updated.",
    });
  };
  
  const resetWeights = () => {
    resetConfig();
    toast({
      title: "Configuration Reset",
      description: "Matching algorithm weights have been reset to defaults.",
    });
  };
  
  const handleSaveProfile = () => {
    if (!profileName.trim()) {
      toast({
        title: "Profile Name Required",
        description: "Please enter a name for this configuration profile.",
        variant: "destructive",
      });
      return;
    }
    
    saveConfigProfile(profileName);
    setProfileName('');
    toast({
      title: "Profile Saved",
      description: `Configuration profile "${profileName}" has been saved.`,
    });
  };
  
  return (
    <CardContent className="space-y-4 pt-4">
      <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
        <XCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700 font-medium">
          <span className="block font-bold mb-1">Balozi Information Explicitly Excluded</span>
          firstName and lastName are set as primary matching attributes with highest weights.
          Balozi information is completely excluded from matching criteria.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(fieldWeights).map(([field, weight]) => {
          const fieldInfo = fieldDescriptions[field] || {
            label: field,
            description: "Weight for this attribute"
          };
          
          return (
            <FieldWeightInput
              key={field}
              field={field}
              weight={weight}
              fieldInfo={fieldInfo}
              onWeightChange={handleWeightChange}
            />
          );
        })}
      </div>
      
      <div className="flex items-center gap-2 pt-4">
        <Button onClick={saveWeights} className="flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
        <Button variant="outline" onClick={resetWeights} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> Reset to Defaults
        </Button>
      </div>
      
      <div className="pt-4 border-t mt-4">
        <Label htmlFor="profile-name">Save as Configuration Profile</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="profile-name"
            placeholder="Profile Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </div>
      </div>
    </CardContent>
  );
};
