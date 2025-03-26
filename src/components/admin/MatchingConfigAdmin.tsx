
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Badge } from '@/components/ui/badge';
import { Save, Settings, Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldWeights } from '@/utils/matching/types';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExtendedMatchingConfig } from '@/types/matchingConfig';

const MatchingConfigAdmin = () => {
  const { config, saveConfigProfile, loadConfigProfile, availableProfiles } = useMatchingConfig();
  const [profileName, setProfileName] = useState('');
  const [thresholds, setThresholds] = useState(config.threshold);
  const [weights, setWeights] = useState<FieldWeights>(config.fieldWeights);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'deterministic' | 'probabilistic'>(
    config.algorithmType || 'probabilistic'
  );
  const { toast } = useToast();

  // Handle threshold change
  const handleThresholdChange = (type: 'high' | 'medium' | 'low', value: number) => {
    setThresholds({ ...thresholds, [type]: value });
  };

  // Handle weight change
  const handleWeightChange = (field: string, value: number) => {
    setWeights({ ...weights, [field]: value });
  };

  // Save configuration profile
  const handleSaveProfile = () => {
    if (!profileName) {
      toast({
        title: "Profile name required",
        description: "Please enter a name for this configuration profile",
        variant: "destructive",
      });
      return;
    }

    const updatedConfig: ExtendedMatchingConfig = {
      ...config,
      threshold: thresholds,
      fieldWeights: weights,
      algorithmType: selectedAlgorithm
    };

    saveConfigProfile(profileName, updatedConfig);
    toast({
      title: "Configuration saved",
      description: `Profile "${profileName}" has been saved successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Matching Configuration
        </h3>
        
        <div className="flex items-center space-x-3">
          <Select
            value={selectedAlgorithm}
            onValueChange={(value: 'deterministic' | 'probabilistic') => setSelectedAlgorithm(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Algorithm Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="probabilistic">Probabilistic</SelectItem>
              <SelectItem value="deterministic">Deterministic</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Profile name"
              className="w-[200px]"
            />
            <Button onClick={handleSaveProfile} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="thresholds">
        <TabsList>
          <TabsTrigger value="thresholds">Matching Thresholds</TabsTrigger>
          <TabsTrigger value="field-weights">Field Weights</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thresholds" className="space-y-6 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sliders className="mr-2 h-5 w-5" />
                Match Threshold Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* High Threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>High Match Threshold</Label>
                  <Badge className="bg-green-500">{thresholds.high}%</Badge>
                </div>
                <Slider
                  value={[thresholds.high]}
                  min={70}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleThresholdChange('high', value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Scores above this threshold will be considered a confident match
                </p>
              </div>
              
              {/* Medium Threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Medium Match Threshold</Label>
                  <Badge className="bg-amber-500">{thresholds.medium}%</Badge>
                </div>
                <Slider
                  value={[thresholds.medium]}
                  min={40}
                  max={80}
                  step={1}
                  onValueChange={(value) => handleThresholdChange('medium', value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Scores between medium and high thresholds require manual review
                </p>
              </div>
              
              {/* Low Threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Low Match Threshold</Label>
                  <Badge variant="outline">{thresholds.low}%</Badge>
                </div>
                <Slider
                  value={[thresholds.low]}
                  min={10}
                  max={50}
                  step={1}
                  onValueChange={(value) => handleThresholdChange('low', value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Scores below this threshold will be considered non-matches
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="field-weights" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Field Weight Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(weights).map(([field, weight]) => (
                  <div key={field} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`weight-${field}`}>
                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <Badge variant="outline">{weight}</Badge>
                    </div>
                    <Slider
                      id={`weight-${field}`}
                      value={[weight]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleWeightChange(field, value[0])}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Load Existing Profile</Label>
                <div className="flex items-center space-x-2">
                  <Select onValueChange={loadConfigProfile}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProfiles.map(profile => (
                        <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    Load
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Algorithm Settings</Label>
                <div className="text-sm text-muted-foreground">
                  <p>Current Algorithm: <Badge>{selectedAlgorithm === 'probabilistic' ? 'Probabilistic (Fellegi-Sunter)' : 'Deterministic'}</Badge></p>
                  <p className="mt-2">
                    The probabilistic algorithm uses statistical methods to determine the likelihood of a match,
                    while the deterministic algorithm requires exact matches on key fields.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchingConfigAdmin;
