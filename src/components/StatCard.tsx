
import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  isPercentage?: boolean;
  isLoading?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  change,
  isPercentage = false,
  isLoading = false,
  color = 'primary'
}: StatCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = typeof value === 'number' ? value : parseInt(value as string) || 0;
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  useEffect(() => {
    if (isLoading) return;

    if (typeof value === 'number') {
      // Animate count up
      let startValue = 0;
      const duration = 1000;
      const step = Math.max(1, Math.floor(targetValue / (duration / 16)));
      let startTime: number | null = null;
      
      const animateValue = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        setDisplayValue(Math.floor(progress * targetValue));
        
        if (progress < 1) {
          window.requestAnimationFrame(animateValue);
        } else {
          setDisplayValue(targetValue);
        }
      };
      
      window.requestAnimationFrame(animateValue);
    }
  }, [isLoading, value, targetValue]);
  
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'danger':
        return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'neutral':
        return 'bg-muted border-muted-foreground/20 text-muted-foreground';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };
  
  const getChangeClasses = () => {
    if (!change) return '';
    return change > 0 
      ? 'text-success flex items-center' 
      : 'text-destructive flex items-center';
  };
  
  const displayChangeValue = () => {
    if (!change) return null;
    
    const prefix = change > 0 ? '+' : '';
    const changeValue = `${prefix}${change}${isPercentage ? '%' : ''}`;
    
    return (
      <span className={getChangeClasses()}>
        {change > 0 ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2v-1H5a1 1 0 010-2h2V9H5a1 1 0 110-2h2V6a1 1 0 011-1h2a1 1 0 011 1v1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H9v1h2a1 1 0 110 2H5a1 1 0 110-2h2v-1H5a1 1 0 010-2h2v-1H5a1 1 0 110-2h2V9a1 1 0 011-1h2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1h1a1 1 0 110 2h-1v1z" clipRule="evenodd" />
          </svg>
        )}
        {changeValue}
      </span>
    );
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl border backdrop-blur-sm shadow-subtle transition-all-medium ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${getColorClasses()}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="mt-2 flex items-baseline">
              {isLoading ? (
                <div className="h-9 w-24 rounded bg-muted animate-pulse"></div>
              ) : (
                <span className="text-3xl font-semibold tracking-tight">
                  {typeof value === 'number' ? displayValue : value}
                  {isPercentage && '%'}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            {displayChangeValue() && (
              <div className="mt-2 text-xs font-medium">
                {displayChangeValue()}
                <span className="text-muted-foreground ml-1">from last week</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`p-2 rounded-full ${getColorClasses()}`}>
              {icon}
            </div>
          )}
        </div>
      </div>
      {/* Optional decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"></div>
    </div>
  );
};

export default StatCard;
