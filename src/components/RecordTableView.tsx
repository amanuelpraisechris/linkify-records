import { Record } from '@/types';
import { ChevronDown, ChevronRight, Info, CheckCircle, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface RecordTableViewProps {
  records: Record[];
  expandedRecord: string | null;
  toggleRecordDetails: (recordId: string) => void;
  showMatchDetail?: boolean;
  onAssignMatch?: (record: Record) => void;
  onSaveNotes?: (record: Record, notes: string) => void;
}

const RecordTableView = ({ 
  records, 
  expandedRecord, 
  toggleRecordDetails, 
  showMatchDetail = false,
  onAssignMatch,
  onSaveNotes
}: RecordTableViewProps) => {
  const { config } = useMatchingConfig();
  const { toast } = useToast();
  const [activeRecord, setActiveRecord] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<{[key: string]: string}>({});
  
  const formatMatchScore = (score?: number) => {
    if (score === undefined) return '--';
    
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

  const nonPatientNameFields = [
    "balozi_first_name", "\"balozi_first_name\"",
    "balozi_middle_name", "\"balozi_middle_name\"", 
    "balozi_last_name", "\"balozi_last_name\"",
    "oldest_member_first_name", "\"oldest_member_first_name\"",
    "oldest_member_middle_name", "\"oldest_member_middle_name\"",
    "oldest_member_last_name", "\"oldest_member_last_name\"",
    "cellLeaderFirstName", "cellLeaderMiddleName", "cellLeaderLastName",
    "oldestHouseholdMemberFirstName", "oldestHouseholdMemberMiddleName", "oldestHouseholdMemberLastName"
  ];

  const getDisplayValue = (record: Record, field: string, defaultValue = '-') => {
    if (field === 'firstName') {
      if (record.firstName) return record.firstName;
      if (record.FirstName) return record.FirstName as string;
      if (record["FirstName"]) return record["FirstName"] as string;
      if (record["\"FirstName\""]) return String(record["\"FirstName\""]).replace(/"/g, '');
      if (record.first_name) return record.first_name as string;
      if (record["first_name"]) return record["first_name"] as string;
      if (record["\"first_name\""]) return String(record["\"first_name\""]).replace(/"/g, '');
      if (record.name) return record.name as string;
      if (record["name"]) return record["name"] as string;
      if (record["\"name\""]) return String(record["\"name\""]).replace(/"/g, '');
      
      for (const key in record) {
        if (nonPatientNameFields.includes(key)) continue;
        
        if ((key.toLowerCase().includes('first') || key.toLowerCase() === 'name') && 
            !key.toLowerCase().includes('last') && 
            !key.toLowerCase().includes('middle') && 
            !key.toLowerCase().includes('cell') &&
            !key.toLowerCase().includes('oldest') &&
            !key.toLowerCase().includes('balozi') &&
            !key.toLowerCase().includes('household') &&
            typeof record[key as keyof Record] === 'string') {
          return String(record[key as keyof Record]);
        }
      }
      return defaultValue;
    }
    
    if (field === 'lastName') {
      if (record.lastName) return record.lastName;
      if (record.LastName) return record.LastName as string;
      if (record["LastName"]) return record["LastName"] as string;
      if (record["\"LastName\""]) return String(record["\"LastName\""]).replace(/"/g, '');
      if (record.last_name) return record.last_name as string;
      if (record["last_name"]) return record["last_name"] as string;
      if (record["\"last_name\""]) return String(record["\"last_name\""]).replace(/"/g, '');
      if (record.surname) return record.surname as string;
      if (record["surname"]) return record["surname"] as string;
      if (record["\"surname\""]) return String(record["\"surname\""]).replace(/"/g, '');
      
      for (const key in record) {
        if (nonPatientNameFields.includes(key)) continue;
        
        if (key.toLowerCase().includes('last') && 
            !key.toLowerCase().includes('cell') &&
            !key.toLowerCase().includes('oldest') &&
            !key.toLowerCase().includes('balozi') &&
            !key.toLowerCase().includes('household') &&
            typeof record[key as keyof Record] === 'string') {
          return String(record[key as keyof Record]);
        }
      }
      return defaultValue;
    }
    
    if (field === 'middleName' && record.middleName) return record.middleName;
    if (field === 'village' && record.village) return record.village;
    if (field === 'district' && record.district) return record.district;
    if (field === 'subVillage' && record.subVillage) return record.subVillage;
    if (field === 'birthDate' && record.birthDate) return record.birthDate;
    
    const quotedField = `"${field}"`;
    if (record[quotedField as keyof Record]) {
      return String(record[quotedField as keyof Record]).replace(/"/g, '');
    }
    
    if (record[field as keyof Record] !== undefined) {
      return String(record[field as keyof Record] || defaultValue);
    }
    
    const unquotedKey = field.replace(/"/g, '');
    if (record[unquotedKey as keyof Record] !== undefined) {
      return String(record[unquotedKey as keyof Record]);
    }
    
    return defaultValue;
  };

  const getGender = (record: Record) => {
    if (record.gender) return record.gender;
    if (record["\"Sex\""]) {
      const sex = record["\"Sex\""].replace(/"/g, '');
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    if (record["Sex"]) {
      const sex = record["Sex"];
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    if (record["sex"]) {
      const sex = record["sex"];
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    if (record["\"sex\""]) {
      const sex = record["\"sex\""].replace(/"/g, '');
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    return '-';
  };
  
  const handleAssignMatch = (record: Record) => {
    if (onAssignMatch) {
      onAssignMatch(record);
      toast({
        title: "Match Assigned",
        description: `Successfully assigned match for record: ${getDisplayValue(record, 'firstName')} ${getDisplayValue(record, 'lastName')}`,
      });
    }
  };
  
  const handleSaveNotes = (record: Record) => {
    if (onSaveNotes && noteText[record.id]) {
      onSaveNotes(record, noteText[record.id]);
      toast({
        title: "Match Notes Saved",
        description: "Your notes have been saved successfully.",
      });
      setNoteText(prev => ({...prev, [record.id]: ''}));
    } else {
      toast({
        title: "No Notes to Save",
        description: "Please enter some notes before saving.",
        variant: "destructive",
      });
    }
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
              {onAssignMatch && (
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Actions</th>
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
                  {onAssignMatch && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center text-xs"
                          onClick={() => handleAssignMatch(record)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Assign Match
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center text-xs"
                          onClick={() => setActiveRecord(record.id === activeRecord ? null : record.id)}
                        >
                          <MessageSquareText className="w-3 h-3 mr-1" />
                          Match Notes
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
                {expandedRecord === record.id && (
                  <tr className="bg-muted/10">
                    <td colSpan={onAssignMatch ? 8 : showMatchDetail ? 7 : 6} className="px-4 py-3">
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
                        
                        {record.householdMembers && record.householdMembers.length > 0 && (
                          <div className="md:col-span-2">
                            <h4 className="font-medium mb-2">Household Members</h4>
                            <ul className="text-sm space-y-1 pl-5 list-disc">
                              {record.householdMembers.map((member, index) => (
                                <li key={index}>{member}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {activeRecord === record.id && (
                          <div className="md:col-span-2 mt-4 border-t pt-4">
                            <h4 className="font-medium mb-2 flex items-center">
                              <MessageSquareText className="w-4 h-4 mr-1 text-muted-foreground" />
                              Match Notes
                            </h4>
                            <textarea
                              value={noteText[record.id] || ''}
                              onChange={(e) => setNoteText(prev => ({...prev, [record.id]: e.target.value}))}
                              className="w-full h-24 p-2 border rounded-md text-sm"
                              placeholder="Enter notes about this match here. Include date and any relevant details that might help with future matching."
                            />
                            <div className="flex justify-end mt-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSaveNotes(record)}
                              >
                                Save Notes
                              </Button>
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
