
import { Record } from '@/types';
import { getFullName } from '@/utils/nameFieldUtils';
import { AlertTriangle } from 'lucide-react';

interface RecordCardHeaderProps {
  record: Record;
  matchScore?: number;
}

// Determine match confidence level
const getConfidenceLevel = (score?: number) => {
  if (score === undefined) return null;
  if (score >= 80) return { label: 'High', color: 'bg-success/10 text-success' };
  if (score >= 60) return { label: 'Medium', color: 'bg-warning/10 text-warning' };
  return { label: 'Low', color: 'bg-destructive/10 text-destructive' };
};

const RecordCardHeader = ({ record, matchScore }: RecordCardHeaderProps) => {
  // Use the consistent utilities for displaying names with firstMiddleLast format
  const fullName = getFullName(record, 'firstMiddleLast');
  const confidenceLevel = getConfidenceLevel(matchScore);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };
  
  // For debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log('Record in RecordCardHeader:', record);
    console.log('Extracted name:', fullName);
  }
  
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg text-foreground uppercase">
          {fullName}
        </h3>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <span>{record.gender || record.sex || '-'}</span>
          <span className="mx-2">•</span>
          <span>DOB: {formatDate(record.birthDate)}</span>
        </div>
        
        {matchScore !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${confidenceLevel?.color}`}>
              {confidenceLevel?.label} Match ({matchScore}%)
            </div>
            
            {confidenceLevel?.label === 'Low' && (
              <div className="inline-flex items-center text-xs text-muted-foreground">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Manual review recommended
              </div>
            )}
          </div>
        )}
      </div>
      
      {record.patientId && (
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          ID: {record.patientId}
        </div>
      )}
    </div>
  );
};

export default RecordCardHeader;
