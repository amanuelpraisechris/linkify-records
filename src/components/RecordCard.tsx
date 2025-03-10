
import { useState } from 'react';
import { Record } from '@/types';
import { AlertTriangle } from 'lucide-react';
import RecordCardHeader from './record-card/RecordCardHeader';
import RecordCardDetails from './record-card/RecordCardDetails';
import RecordCardActions from './record-card/RecordCardActions';
import { getNameField } from '@/utils/nameFieldUtils';

interface RecordCardProps {
  record: Record;
  showActions?: boolean;
  onMatch?: () => void;
  onReject?: () => void;
  matchScore?: number;
  matchedOn?: string[];
  isHighlighted?: boolean;
}

const RecordCard = ({ 
  record,
  showActions = false,
  onMatch,
  onReject,
  matchScore,
  matchedOn,
  isHighlighted = false
}: RecordCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // For debugging
  if (process.env.NODE_ENV !== 'production') {
    const firstName = getNameField(record, 'firstName', '');
    const lastName = getNameField(record, 'lastName', '');
    console.log('Record in RecordCard:', record);
    console.log('Extracted names:', { firstName, lastName });
  }

  return (
    <div 
      className={`bg-white dark:bg-black border rounded-xl transition-all duration-300 ${
        isHighlighted 
          ? 'shadow-highlight border-primary/30 ring-1 ring-primary/20' 
          : 'shadow-subtle hover:shadow-card'
      }`}
    >
      <div className="p-5">
        <RecordCardHeader 
          record={record} 
          matchScore={matchScore} 
        />
        
        {(isExpanded || isHighlighted) && (
          <RecordCardDetails 
            record={record} 
            matchedOn={matchedOn} 
          />
        )}
        
        <RecordCardActions 
          isExpanded={isExpanded}
          showActions={showActions}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onMatch={onMatch}
          onReject={onReject}
        />
      </div>
    </div>
  );
};

export default RecordCard;
