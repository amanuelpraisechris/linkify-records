
import { PatientRecord } from '@/types';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';

interface RecordTableViewProps {
  records: PatientRecord[];
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const cleanDate = dateString.replace(/"/g, '');
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(cleanDate).toLocaleDateString(undefined, options);
    } catch (e) {
      return cleanDate;
    }
  };

  const getDisplayValue = (record: PatientRecord, field: string, defaultValue = '-') => {
    const quotedField = `"${field}"`;
    if (record[quotedField as keyof PatientRecord]) {
      return String(record[quotedField as keyof PatientRecord]).replace(/"/g, '');
    }
    return record[field as keyof PatientRecord] || defaultValue;
  };

  const getGender = (record: PatientRecord) => {
    if (record["\"Sex\""]) {
      const sex = record["\"Sex\""].replace(/"/g, '');
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    return record.gender || '-';
  };

  return (
    <div className="animate-fade-in border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">First Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sex</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date of Birth</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Village</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subvillage</th>
              {showMatchDetail && (
                <>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Match Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Matched On</th>
                </>
              )}
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record, index) => {
              const matchScore = record.metadata?.matchScore || record.fuzzyScore;
              const firstName = getDisplayValue(record, "FirstName", record.firstName || '');
              const lastName = getDisplayValue(record, "LastName", record.lastName || '');
              
              return (
                <>
                  <tr 
                    key={`${record.id}-row`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3">{firstName}</td>
                    <td className="px-4 py-3">{lastName}</td>
                    <td className="px-4 py-3">{getGender(record)}</td>
                    <td className="px-4 py-3">{formatDate(getDisplayValue(record, "dob", record.birthDate || ''))}</td>
                    <td className="px-4 py-3">{getDisplayValue(record, "villagename", record.village || '-')}</td>
                    <td className="px-4 py-3">{getDisplayValue(record, "subvillagename", record.subVillage || '-')}</td>
                    
                    {showMatchDetail && (
                      <>
                        <td className="px-4 py-3">
                          {matchScore ? (
                            <Badge className={`px-2 py-1 ${
                              matchScore >= config.threshold.high
                                ? 'bg-success/10 text-success hover:bg-success/20'
                                : matchScore >= config.threshold.medium
                                  ? 'bg-warning/10 text-warning hover:bg-warning/20'
                                  : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                            }`}>
                              {matchScore}%
                            </Badge>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {record.matchedOn?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {record.matchedOn.slice(0, 2).map((field, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                              {record.matchedOn.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{record.matchedOn.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      </>
                    )}
                    
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <button
                          className="p-1 rounded-md hover:bg-muted transition-colors"
                          title="View details"
                          onClick={() => toggleRecordDetails(record.id)}
                        >
                          {expandedRecord === record.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          className="p-1 rounded-md hover:bg-muted transition-colors"
                          title="View details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRecord === record.id && showMatchDetail && (
                    <tr key={`${record.id}-details`}>
                      <td colSpan={showMatchDetail ? 10 : 8} className="px-0 py-0">
                        <div className="bg-muted/20 p-4 border-y">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-muted-foreground" />
                            <h4 className="font-medium">Match Details</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-2">Fields Matched</h5>
                              <div className="flex flex-wrap gap-1">
                                {record.matchedOn?.map((field, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {field}
                                  </Badge>
                                ))}
                                {!record.matchedOn?.length && <span className="text-xs text-muted-foreground">No fields matched</span>}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium mb-2">Match Probability</h5>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      matchScore >= config.threshold.high
                                        ? 'bg-success'
                                        : matchScore >= config.threshold.medium
                                          ? 'bg-warning'
                                          : 'bg-destructive'
                                    }`}
                                    style={{ width: `${matchScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{matchScore}%</span>
                              </div>
                              
                              <div className="mt-2 text-xs text-muted-foreground">
                                {matchScore >= config.threshold.high
                                  ? 'High probability match based on multiple fields'
                                  : matchScore >= config.threshold.medium
                                    ? 'Medium probability match - review carefully'
                                    : 'Low probability match - significant differences exist'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordTableView;
