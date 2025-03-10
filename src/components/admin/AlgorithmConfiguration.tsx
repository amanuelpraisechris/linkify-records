
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sliders, BarChart, Save, RotateCcw } from 'lucide-react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { useToast } from '@/components/ui/use-toast';

const AlgorithmConfiguration = () => {
  const { config, updateFieldWeights, resetConfig, saveConfigProfile } = useMatchingConfig();
  const { toast } = useToast();
  
  // Local state for field weights
  const [fieldWeights, setFieldWeights] = useState(config.fieldWeights);
  // State for algorithm performance metrics (in a real app, these would come from backend)
  const [metrics, setMetrics] = useState({
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.79,
    f1: 0.80
  });
  const [profileName, setProfileName] = useState('');
  
  // Update local state when config changes
  useEffect(() => {
    setFieldWeights(config.fieldWeights);
  }, [config.fieldWeights]);
  
  // Handle field weight change
  const handleWeightChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setFieldWeights(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  // Save updated weights
  const saveWeights = () => {
    updateFieldWeights(fieldWeights);
    toast({
      title: "Configuration Updated",
      description: "Matching algorithm weights have been updated.",
    });
  };
  
  // Reset to defaults
  const resetWeights = () => {
    resetConfig();
    toast({
      title: "Configuration Reset",
      description: "Matching algorithm weights have been reset to defaults.",
    });
  };
  
  // Save as profile
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
  
  const algorithmTypes = [
    { id: 'deterministic', name: 'Deterministic Matching', description: 'Rule-based matching using weighted fields' },
    { id: 'probabilistic', name: 'Probabilistic Matching', description: 'Statistical matching using Fellegi-Sunter model' }
  ];
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" /> Algorithm Configuration
        </CardTitle>
        <CardDescription>
          Configure matching algorithm settings and view performance metrics
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="weights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weights">Field Weights</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm Type</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        {/* Field Weights Tab */}
        <TabsContent value="weights" className="space-y-4">
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fieldWeights).map(([field, weight]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`weight-${field}`} className="capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()} Weight
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id={`weight-${field}`}
                      type="number" 
                      min="0" 
                      max="100" 
                      value={weight}
                      onChange={(e) => handleWeightChange(field, e.target.value)}
                      className="w-20"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weight}
                      onChange={(e) => handleWeightChange(field, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
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
        </TabsContent>
        
        {/* Algorithm Type Tab */}
        <TabsContent value="algorithm">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-4">
              {algorithmTypes.map(algorithm => (
                <div key={algorithm.id} className="flex items-start gap-2">
                  <input
                    type="radio"
                    id={`alg-${algorithm.id}`}
                    name="algorithm-type"
                    value={algorithm.id}
                    defaultChecked={algorithm.id === 'deterministic'}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={`alg-${algorithm.id}`} className="font-medium">
                      {algorithm.name}
                    </Label>
                    <p className="text-sm text-gray-500">{algorithm.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t mt-4">
              <h3 className="font-medium mb-2">Current Configuration</h3>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p><strong>Threshold - High:</strong> {config.threshold.high}</p>
                <p><strong>Threshold - Medium:</strong> {config.threshold.medium}</p>
                <p><strong>Threshold - Low:</strong> {config.threshold.low}</p>
                <p><strong>Fuzzy Matching:</strong> {config.fuzzyMatching ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Default Language:</strong> {config.languageConfig.defaultLanguage}</p>
                <p><strong>Script Detection:</strong> {config.languageConfig.enableScriptDetection ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* Performance Metrics Tab */}
        <TabsContent value="performance">
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(metrics).map(([metric, value]) => (
                <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm uppercase text-gray-500">{metric}</h3>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-2xl font-bold">{(value * 100).toFixed(1)}%</span>
                    <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${value * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t mt-4">
              <h3 className="font-medium mb-2">Performance Analysis</h3>
              <p className="text-sm text-gray-500">
                These metrics are generated based on matches that have been validated by users.
                Higher values indicate better algorithm performance.
              </p>
              <ul className="list-disc text-sm ml-4 mt-2 text-gray-500">
                <li><strong>Accuracy:</strong> Percentage of correct classifications (true positives + true negatives)</li>
                <li><strong>Precision:</strong> Percentage of correct positive identifications</li>
                <li><strong>Recall:</strong> Percentage of actual positives correctly identified</li>
                <li><strong>F1 Score:</strong> Harmonic mean of precision and recall</li>
              </ul>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t p-4 text-xs text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default AlgorithmConfiguration;
