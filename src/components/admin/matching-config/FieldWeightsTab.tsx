
import React from 'react';
import { FieldWeights } from '@/utils/matching';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface FieldWeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const FieldWeightSlider = ({ label, value, onChange }: FieldWeightSliderProps) => {
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

interface FieldWeightsTabProps {
  config: {
    fieldWeights: FieldWeights;
  };
  onWeightChange: (field: keyof FieldWeights, value: number) => void;
}

export const FieldWeightsTab: React.FC<FieldWeightsTabProps> = ({ config, onWeightChange }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">Primary Identifiers</h3>
          <div className="space-y-4">
            <FieldWeightSlider 
              label="First Name" 
              value={config.fieldWeights.firstName} 
              onChange={(val) => onWeightChange('firstName', val)} 
            />
            <FieldWeightSlider 
              label="Last Name" 
              value={config.fieldWeights.lastName} 
              onChange={(val) => onWeightChange('lastName', val)} 
            />
            <FieldWeightSlider 
              label="Birth Date" 
              value={config.fieldWeights.birthDate} 
              onChange={(val) => onWeightChange('birthDate', val)} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Secondary Identifiers</h3>
          <div className="space-y-4">
            <FieldWeightSlider 
              label="Gender" 
              value={config.fieldWeights.gender} 
              onChange={(val) => onWeightChange('gender', val)} 
            />
            <FieldWeightSlider 
              label="Village" 
              value={config.fieldWeights.village} 
              onChange={(val) => onWeightChange('village', val)} 
            />
            <FieldWeightSlider 
              label="Sub-Village" 
              value={config.fieldWeights.subVillage} 
              onChange={(val) => onWeightChange('subVillage', val)} 
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
              onChange={(val) => onWeightChange('householdHead', val)} 
            />
            <FieldWeightSlider 
              label="Phone Number" 
              value={config.fieldWeights.phoneNumber} 
              onChange={(val) => onWeightChange('phoneNumber', val)} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Location Identifiers</h3>
          <div className="space-y-4">
            <FieldWeightSlider 
              label="Balozi" 
              value={config.fieldWeights.balozi} 
              onChange={(val) => onWeightChange('balozi', val)} 
            />
          </div>
        </div>
      </div>

      <WeightChart fieldWeights={config.fieldWeights} />
    </div>
  );
};
