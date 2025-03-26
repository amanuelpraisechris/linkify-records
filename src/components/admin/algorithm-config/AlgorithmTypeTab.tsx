
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMatchingConfig, AlgorithmType } from '@/contexts/MatchingConfigContext';

export const AlgorithmTypeTab: React.FC = () => {
  const { config, setAlgorithmType } = useMatchingConfig();
  
  const handleAlgorithmTypeChange = (value: string) => {
    setAlgorithmType(value as AlgorithmType);
  };
  
  const algorithmTypes = [
    { id: 'deterministic', name: 'Deterministic Matching', description: 'Rule-based matching using weighted fields' },
    { id: 'probabilistic', name: 'Probabilistic Matching', description: 'Statistical matching using Fellegi-Sunter model' }
  ];
  
  return (
    <CardContent className="space-y-4 pt-4">
      <div className="space-y-4">
        <RadioGroup 
          defaultValue={config.algorithmType}
          onValueChange={handleAlgorithmTypeChange}
        >
          {algorithmTypes.map(algorithm => (
            <div key={algorithm.id} className="flex items-start space-x-2">
              <RadioGroupItem value={algorithm.id} id={`alg-${algorithm.id}`} />
              <div className="grid gap-1.5">
                <Label htmlFor={`alg-${algorithm.id}`} className="font-medium">
                  {algorithm.name}
                </Label>
                <p className="text-sm text-gray-500">{algorithm.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
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
          <p><strong>Algorithm Type:</strong> {config.algorithmType}</p>
        </div>
      </div>
    </CardContent>
  );
};
