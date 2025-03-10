
import { Record } from '@/types';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';

interface RecordTableViewProps {
  records: Record[];
  expandedRecord: string | null;
  toggleRecordDetails: (recordId: string) => void;
  showMatchDetail?: boolean;
}

const RecordTableView = ({ 
  records, 
  expandedRecord, 
  toggleRecordDetails, 
  showMatchDetail = false 
}: RecordTableViewProps) => {
  const { config } = useMatchingConfig();
  
  const formatMatchScore = (score?: number) => {
    if (score === undefined) return '--';
    
    // Format the score based on thresholds
    if (score >= config.threshold.high) {
      return (
        <Badge variant="default" className="bg-green-500 text-white font-normal">High Match ({score}%)</Badge>
      );
    } else if (score >= config.threshold.medium) {
      return (
        <Badge variant="default" className="bg-amber-500 text-white font-normal">Medium Match ({score}%)</Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="font-normal text-muted-foreground">Low Match ({score}%)</Badge>
      );
    }
  };

  const getDisplayValue = (record: Record, field: string, defaultValue = '-') => {
    const quotedField = `"${field}"`;
    if (record[quotedField as keyof Record]) {
      return String(record[quotedField as keyof Record]).replace(/"/g, '');
    }
    return String(record[field as keyof Record] || defaultValue);
  };

  const getGender = (record: Record) => {
    if (record["\"Sex\""]) {
      const sex = record["\"Sex\""].replace(/"/g, '');
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    return record.gender || '-';
  };

  return (
    <div className="rounded-lg border overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider w-10"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Birth Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Village</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">District</th>
              {showMatchDetail && (
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Match Score</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y bg-white dark:bg-black">
            {records.map((record) => (
              <>
                <tr 
                  key={record.id}
                  className={`hover:bg-muted/30 transition-colors ${expandedRecord === record.id ? 'bg-muted/20' : ''}`}
                >
                  <td className="px-3 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleRecordDetails(record.id)}>
                    {expandedRecord === record.id ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium">
                      {getDisplayValue(record, 'firstName', '-')} {getDisplayValue(record, 'lastName', '-')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {record.patientId || record.id.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getGender(record)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getDisplayValue(record, 'birthDate', '-')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getDisplayValue(record, 'village', '-')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getDisplayValue(record, 'district', '-')}
                  </td>
                  {showMatchDetail && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatMatchScore(record.metadata?.matchScore || record.fuzzyScore)}
                    </td>
                  )}
                </tr>
                {expandedRecord === record.id && (
                  <tr className="bg-muted/10">
                    <td colSpan={showMatchDetail ? 7 : 6} className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <Info className="w-4 h-4 mr-1 text-muted-foreground" />
                            Personal Details
                          </h4>
                          <dl className="grid grid-cols-2 gap-2 text-sm">
                            <dt className="text-muted-foreground">Full Name</dt>
                            <dd>{getDisplayValue(record, 'firstName', '-')} {getDisplayValue(record, 'middleName', '')} {getDisplayValue(record, 'lastName', '-')}</dd>
                            
                            <dt className="text-muted-foreground">Gender</dt>
                            <dd>{getGender(record)}</dd>
                            
                            <dt className="text-muted-foreground">Birth Date</dt>
                            <dd>{getDisplayValue(record, 'birthDate', '-')}</dd>
                            
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>{getDisplayValue(record, 'phoneNumber', '-')}</dd>
                          </dl>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <Info className="w-4 h-4 mr-1 text-muted-foreground" />
                            Location Details
                          </h4>
                          <dl className="grid grid-cols-2 gap-2 text-sm">
                            <dt className="text-muted-foreground">Village</dt>
                            <dd>{getDisplayValue(record, 'village', '-')}</dd>
                            
                            <dt className="text-muted-foreground">Sub-Village</dt>
                            <dd>{getDisplayValue(record, 'subVillage', '-')}</dd>
                            
                            <dt className="text-muted-foreground">District</dt>
                            <dd>{getDisplayValue(record, 'district', '-')}</dd>
                            
                            <dt className="text-muted-foreground">Household Head</dt>
                            <dd>{getDisplayValue(record, 'householdHead', '-')}</dd>
                          </dl>
                        </div>
                        
                        {showMatchDetail && record.matchedOn && (
                          <div className="md:col-span-2">
                            <h4 className="font-medium mb-2 flex items-center">
                              <Info className="w-4 h-4 mr-1 text-muted-foreground" />
                              Match Details
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {record.matchedOn.map((field, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {record.identifiers && record.identifiers.length > 0 && (
                          <div className="md:col-span-2">
                            <h4 className="font-medium mb-2">Identifiers</h4>
                            <div className="flex flex-wrap gap-2">
                              {record.identifiers.map((id, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {id.type}: {id.value}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordTableView;
