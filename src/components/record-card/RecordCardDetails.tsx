
import { Record } from '@/types';
import { Calendar, Phone, MapPin, Tag, User, RefreshCw, Home } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface RecordCardDetailsProps {
  record: Record;
  matchedOn?: string[];
}

const RecordCardDetails = ({ record, matchedOn }: RecordCardDetailsProps) => {
  return (
    <div className="mt-4 space-y-2 animate-fade-in">
      {(record.village || record.district) && (
        <div className="flex items-start text-sm">
          <Home className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
          <span>
            {record.village && record.village}
            {record.village && record.district && ', '}
            {record.district && record.district}
          </span>
        </div>
      )}
      
      {record.address && (
        <div className="flex items-start text-sm">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
          <span>{record.address}</span>
        </div>
      )}
      
      {record.phoneNumber && (
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{record.phoneNumber}</span>
        </div>
      )}
      
      {(record.householdHead || record.motherName) && (
        <div className="flex items-start text-sm">
          <User className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
          <span>
            {record.householdHead && `Household Head: ${record.householdHead}`}
            {record.householdHead && record.motherName && ', '}
            {record.motherName && `Mother: ${record.motherName}`}
          </span>
        </div>
      )}
      
      {record.lastVisit && (
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>Last visit: {formatDate(record.lastVisit)}</span>
        </div>
      )}
      
      {record.healthFacility && (
        <div className="flex items-center text-sm">
          <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{record.healthFacility}</span>
        </div>
      )}
      
      {record.identifiers && record.identifiers.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium mb-1.5">Identifiers</h4>
          <div className="flex flex-wrap gap-2">
            {record.identifiers.map((id, index) => (
              <div 
                key={index} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
              >
                {id.type}: {id.value}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {matchedOn && matchedOn.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium mb-1.5">Matched On</h4>
          <div className="flex flex-wrap gap-2">
            {matchedOn.map((field, index) => (
              <div 
                key={index} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success"
              >
                {field}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {record.metadata && (
        <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center">
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>
              {record.metadata.source} | Last updated: {formatDate(record.metadata.updatedAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordCardDetails;
