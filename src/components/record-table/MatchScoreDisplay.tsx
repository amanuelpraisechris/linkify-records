
import { Badge } from '@/components/ui/badge';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MatchScoreDisplayProps {
  score?: number;
  matchedOn?: string[];
}

const MatchScoreDisplay = ({ score, matchedOn = [] }: MatchScoreDisplayProps) => {
  const { config } = useMatchingConfig();
  
  if (score === undefined) return <span>--</span>;
  
  // Determine primary match criteria (first name, last name, birth date)
  const hasPrimaryMatches = matchedOn.some(field => 
    field.includes('First Name') || 
    field.includes('Last Name') || 
    field.includes('Birth')
  );
  
  const tooltipContent = (
    <div className="max-w-[200px] text-xs">
      <p className="font-medium mb-1">Matched on:</p>
      <ul className="list-disc pl-4 space-y-0.5">
        {matchedOn.map((field, i) => (
          <li key={i}>{field}</li>
        ))}
      </ul>
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
              {matchedOn.length > 0 && (
                <Info className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
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
              {matchedOn.length > 0 && (
                <Info className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
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
              {matchedOn.length > 0 && (
                <Info className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default MatchScoreDisplay;
