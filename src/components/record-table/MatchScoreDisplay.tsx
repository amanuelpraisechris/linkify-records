
import { Badge } from '@/components/ui/badge';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Info, BarChart3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface MatchScoreDisplayProps {
  score?: number;
  matchedOn?: string[];
  fieldScores?: {[key: string]: number};
}

const MatchScoreDisplay = ({ score, matchedOn = [], fieldScores = {} }: MatchScoreDisplayProps) => {
  const { config } = useMatchingConfig();
  
  if (score === undefined) return <span>--</span>;
  
  // Determine primary match criteria (first name, last name, birth date)
  const hasPrimaryMatches = matchedOn.some(field => 
    field.includes('First Name') || 
    field.includes('Last Name') || 
    field.includes('Birth')
  );
  
  // Format field scores for display
  const formattedFieldScores = Object.entries(fieldScores)
    .sort(([, a], [, b]) => b - a)
    .map(([field, value]) => ({
      field: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: parseFloat(value.toFixed(2))
    }));
  
  const tooltipContent = (
    <div className="max-w-[280px] text-xs">
      <div className="font-medium mb-2 flex items-center">
        <BarChart3 className="w-3 h-3 mr-1" />
        Match Details ({score}% confidence)
      </div>
      
      {matchedOn.length > 0 && (
        <>
          <p className="font-medium mt-2 mb-1">Matched on:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {matchedOn.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </>
      )}
      
      {Object.keys(fieldScores).length > 0 && (
        <>
          <p className="font-medium mt-3 mb-1">Field contributions:</p>
          <div className="space-y-1.5">
            {formattedFieldScores.slice(0, 6).map(({ field, value }) => (
              <div key={field} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{field}</span>
                  <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
                <Progress 
                  value={50 + (value * 5)} 
                  className="h-1.5" 
                  indicatorClassName={value > 0 ? 'bg-green-500' : 'bg-red-500'}
                />
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-3 pt-2 border-t border-border text-muted-foreground">
        <p className="text-xs">
          {score >= config.threshold.high ? 'High confidence match' : 
           score >= config.threshold.medium ? 'Medium confidence match' : 
           'Low confidence match'} based on current configuration.
        </p>
      </div>
    </div>
  );
  
  if (score >= config.threshold.high) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Badge variant="default" className="bg-green-500 text-white font-normal">
                High Match ({score}%)
              </Badge>
              <Info className="w-4 h-4 ml-1 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" className="p-4">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (score >= config.threshold.medium) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Badge variant="default" className={`${hasPrimaryMatches ? 'bg-amber-500' : 'bg-amber-400'} text-white font-normal`}>
                Medium Match ({score}%)
              </Badge>
              <Info className="w-4 h-4 ml-1 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" className="p-4">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Badge variant="outline" className="font-normal text-muted-foreground">
                Low Match ({score}%)
              </Badge>
              <Info className="w-4 h-4 ml-1 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" className="p-4">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default MatchScoreDisplay;
