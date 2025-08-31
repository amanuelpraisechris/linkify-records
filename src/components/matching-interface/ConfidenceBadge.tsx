
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, HelpCircle, Shield } from 'lucide-react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';

interface ConfidenceBadgeProps {
  score: number;
  premium?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConfidenceBadge = ({ score, premium = true, size = 'md' }: ConfidenceBadgeProps) => {
  const { config } = useMatchingConfig();
  
  const getConfidenceLevel = (score: number) => {
    if (score >= config.threshold.high) return 'high';
    if (score >= config.threshold.medium) return 'medium';
    return 'low';
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1';
      case 'lg': return 'text-base px-4 py-2';
      default: return 'text-sm px-3 py-1.5';
    }
  };

  const level = getConfidenceLevel(score);
  
  if (premium) {
    const premiumClasses = {
      high: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 shadow-sm shadow-green-100',
      medium: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm shadow-yellow-100', 
      low: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200 shadow-sm shadow-red-100'
    };
    
    const icons = {
      high: <CheckCircle2 className="w-3 h-3" />,
      medium: <Shield className="w-3 h-3" />,
      low: <AlertCircle className="w-3 h-3" />
    };
    
    const labels = {
      high: 'High Confidence',
      medium: 'Medium Confidence', 
      low: 'Low Confidence'
    };
    
    return (
      <div className={`inline-flex items-center space-x-2 rounded-full font-semibold backdrop-blur-sm ${premiumClasses[level]} ${getSizeClasses(size)}`}>
        {icons[level]}
        <span>{score}%</span>
        <span className="text-xs opacity-75">• {labels[level]}</span>
      </div>
    );
  }
  
  if (level === 'high') {
    return (
      <Badge className="bg-green-500 hover:bg-green-600">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        High Confidence ({score}%)
      </Badge>
    );
  } else if (level === 'medium') {
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600">
        <HelpCircle className="w-3 h-3 mr-1" />
        Medium Confidence ({score}%)
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-500 hover:bg-red-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        Low Confidence ({score}%)
      </Badge>
    );
  }
};

export default ConfidenceBadge;
