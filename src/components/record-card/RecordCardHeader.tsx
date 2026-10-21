
import { Record } from '@/types';
import { getFullName } from '@/utils/nameFieldUtils';
import { formatDate } from '@/utils/dateUtils';
import MatchBandBadge from '@/components/matching-interface/MatchBandBadge';

interface RecordCardHeaderProps {
  record: Record;
  matchScore?: number;
}

const RecordCardHeader = ({ record, matchScore }: RecordCardHeaderProps) => {
  // Use the consistent utilities for displaying names with firstMiddleLast format
  const fullName = getFullName(record, 'firstMiddleLast');
  
  // For debugging - log the birth date to see what format it's in
  if (process.env.NODE_ENV !== 'production') {
    console.log('Record in RecordCardHeader:', record);
    console.log('Birth date value:', record.birthDate, typeof record.birthDate);
    console.log('Formatted date result:', formatDate(record.birthDate));
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
          <div className="mt-2">
            <MatchBandBadge score={matchScore} />
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
