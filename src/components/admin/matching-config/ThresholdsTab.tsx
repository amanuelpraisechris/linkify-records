
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ThresholdsTabProps {
  config: {
    threshold: {
      high: number;
      medium: number;
      low: number;
    };
  };
  onThresholdChange: (level: 'high' | 'medium' | 'low', value: number[]) => void;
}

const ThresholdVisualizer = ({ high, medium, low }: { high: number; medium: number; low: number; }) => {
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

export const ThresholdsTab: React.FC<ThresholdsTabProps> = ({ config, onThresholdChange }) => {
  return (
    <div className="space-y-6 pt-4">
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
            onValueChange={(value) => onThresholdChange('high', value)}
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
            onValueChange={(value) => onThresholdChange('medium', value)}
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
            onValueChange={(value) => onThresholdChange('low', value)}
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
    </div>
  );
};
