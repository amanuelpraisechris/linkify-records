
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FileCheck, Clock, Users, TrendingUp } from 'lucide-react';

interface MatchSummaryProps {
  currentIndex: number;
  matchDataLength: number;
  completedMatches?: number;
  premium?: boolean;
}

const MatchSummary = ({ 
  currentIndex, 
  matchDataLength, 
  completedMatches = 0,
  premium = true 
}: MatchSummaryProps) => {
  const progress = matchDataLength > 0 ? ((currentIndex + 1) / matchDataLength) * 100 : 0;
  
  if (premium) {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Session Progress</h4>
              <p className="text-xs text-muted-foreground">Interactive record linkage</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">{currentIndex + 1}</div>
            <div className="text-xs text-muted-foreground">of {matchDataLength}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Processed: {completedMatches}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className="text-sm text-muted-foreground">
      Match {currentIndex + 1} of {matchDataLength}
    </span>
  );
};

export default MatchSummary;
