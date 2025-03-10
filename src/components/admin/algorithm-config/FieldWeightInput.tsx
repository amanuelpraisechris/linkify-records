
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FieldDescription } from './types';

interface FieldWeightInputProps {
  field: string;
  weight: number;
  fieldInfo: FieldDescription;
  onWeightChange: (field: string, value: string) => void;
}

export const FieldWeightInput: React.FC<FieldWeightInputProps> = ({
  field,
  weight,
  fieldInfo,
  onWeightChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={`weight-${field}`} className="font-medium">
          {fieldInfo.label} Weight
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right" className="w-72">
              <p className="text-sm">{fieldInfo.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <Input 
          id={`weight-${field}`}
          type="number" 
          min="0" 
          max="100" 
          value={weight}
          onChange={(e) => onWeightChange(field, e.target.value)}
          className="w-20"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={weight}
          onChange={(e) => onWeightChange(field, e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};
