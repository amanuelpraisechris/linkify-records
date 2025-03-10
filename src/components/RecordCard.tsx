
import { useState } from 'react';
import { Record } from '@/types';
import { Calendar, Phone, MapPin, Tag, Check, X, AlertTriangle, Home, User, RefreshCw } from 'lucide-react';

interface RecordCardProps {
  record: Record;
  showActions?: boolean;
  onMatch?: () => void;
  onReject?: () => void;
  matchScore?: number;
  matchedOn?: string[];
  isHighlighted?: boolean;
}

// List of keys that should be excluded from name fields
const nonPatientNameFields = [
  "balozi_first_name", "\"balozi_first_name\"",
  "balozi_middle_name", "\"balozi_middle_name\"", 
  "balozi_last_name", "\"balozi_last_name\"",
  "oldest_member_first_name", "\"oldest_member_first_name\"",
  "oldest_member_middle_name", "\"oldest_member_middle_name\"",
  "oldest_member_last_name", "\"oldest_member_last_name\"",
  "cellLeaderFirstName", "cellLeaderMiddleName", "cellLeaderLastName",
  "oldestHouseholdMemberFirstName", "oldestHouseholdMemberMiddleName", "oldestHouseholdMemberLastName",
  "Ten Cell Leader First Name", "\"Ten Cell Leader First Name\"",
  "Ten Cell Leader Middle Name", "\"Ten Cell Leader Middle Name\"",
  "Ten Cell Leader Last Name", "\"Ten Cell Leader Last Name\""
];

// Enhanced helper to get name fields correctly with improved priority handling
const getNameField = (record: Record, field: 'firstName' | 'lastName' | 'middleName', defaultValue = '-'): string => {
  // Direct exact property check with highest priority
  if (field === 'firstName') {
    // Exact matches with highest priority
    if (record.FirstName !== undefined) return String(record.FirstName);
    if (record.firstName !== undefined) return String(record.firstName);
    
    // Check specific quoted formats
    if (record["FirstName"] !== undefined) return String(record["FirstName"]);
    if (record["firstName"] !== undefined) return String(record["firstName"]);
    if (record["\"FirstName\""] !== undefined) return String(record["\"FirstName\""]).replace(/"/g, '');
    if (record["\"firstName\""] !== undefined) return String(record["\"firstName\""]).replace(/"/g, '');
    
    // Standard naming conventions
    if (record.first_name !== undefined) return String(record.first_name);
    if (record["first_name"] !== undefined) return String(record["first_name"]);
    if (record["\"first_name\""] !== undefined) return String(record["\"first_name\""]).replace(/"/g, '');
    
    // Special case for common alternate name field
    if (record.name !== undefined && !nonPatientNameFields.some(field => field.toLowerCase().includes('name'))) {
      return String(record.name);
    }
    
    // Case-insensitive check for first name variants
    for (const key in record) {
      const lcKey = key.toLowerCase();
      if ((lcKey === "firstname" || lcKey === "first_name") && 
          !nonPatientNameFields.some(field => field.toLowerCase() === lcKey) &&
          typeof record[key as keyof Record] === 'string') {
        return String(record[key as keyof Record]);
      }
    }
    
    // Scan for other matching fields but explicitly exclude non-patient name fields
    for (const key in record) {
      if (nonPatientNameFields.some(field => 
          field.toLowerCase() === key.toLowerCase() || 
          field.replace(/"/g, '') === key)) continue;
      
      const lcKey = key.toLowerCase();
      if ((lcKey.includes('first') && lcKey.includes('name')) &&
          !lcKey.includes('cell') &&
          !lcKey.includes('leader') &&
          !lcKey.includes('oldest') &&
          !lcKey.includes('balozi') &&
          !lcKey.includes('household') &&
          !lcKey.includes('member') &&
          typeof record[key as keyof Record] === 'string') {
        return String(record[key as keyof Record]);
      }
    }
  }
  
  if (field === 'lastName') {
    // Exact matches with highest priority
    if (record.LastName !== undefined) return String(record.LastName);
    if (record.lastName !== undefined) return String(record.lastName);
    
    // Check specific quoted formats
    if (record["LastName"] !== undefined) return String(record["LastName"]);
    if (record["lastName"] !== undefined) return String(record["lastName"]);
    if (record["\"LastName\""] !== undefined) return String(record["\"LastName\""]).replace(/"/g, '');
    if (record["\"lastName\""] !== undefined) return String(record["\"lastName\""]).replace(/"/g, '');
    
    // Standard naming conventions
    if (record.last_name !== undefined) return String(record.last_name);
    if (record["last_name"] !== undefined) return String(record["last_name"]);
    if (record["\"last_name\""] !== undefined) return String(record["\"last_name\""]).replace(/"/g, '');
    
    // Check surname variants
    if (record.surname !== undefined) return String(record.surname);
    if (record["surname"] !== undefined) return String(record["surname"]);
    if (record["\"surname\""] !== undefined) return String(record["\"surname\""]).replace(/"/g, '');
    
    // Case-insensitive check for last name variants
    for (const key in record) {
      const lcKey = key.toLowerCase();
      if ((lcKey === "lastname" || lcKey === "last_name" || lcKey === "surname") && 
          !nonPatientNameFields.some(field => field.toLowerCase() === lcKey) &&
          typeof record[key as keyof Record] === 'string') {
        return String(record[key as keyof Record]);
      }
    }
    
    // Scan for other matching fields but explicitly exclude non-patient name fields
    for (const key in record) {
      if (nonPatientNameFields.some(field => 
          field.toLowerCase() === key.toLowerCase() || 
          field.replace(/"/g, '') === key)) continue;
      
      const lcKey = key.toLowerCase();
      if ((lcKey.includes('last') && lcKey.includes('name')) &&
          !lcKey.includes('cell') &&
          !lcKey.includes('leader') &&
          !lcKey.includes('oldest') &&
          !lcKey.includes('balozi') &&
          !lcKey.includes('household') &&
          !lcKey.includes('member') &&
          typeof record[key as keyof Record] === 'string') {
        return String(record[key as keyof Record]);
      }
    }
  }
  
  if (field === 'middleName') {
    // Exact matches with highest priority
    if (record.MiddleName !== undefined) return String(record.MiddleName);
    if (record.middleName !== undefined) return String(record.middleName);
    
    // Check specific quoted formats
    if (record["MiddleName"] !== undefined) return String(record["MiddleName"]);
    if (record["middleName"] !== undefined) return String(record["middleName"]);
    if (record["\"MiddleName\""] !== undefined) return String(record["\"MiddleName\""]).replace(/"/g, '');
    if (record["\"middleName\""] !== undefined) return String(record["\"middleName\""]).replace(/"/g, '');
    
    // Standard naming conventions
    if (record.middle_name !== undefined) return String(record.middle_name);
    if (record["middle_name"] !== undefined) return String(record["middle_name"]);
    if (record["\"middle_name\""] !== undefined) return String(record["\"middle_name\""]).replace(/"/g, '');
    
    // Case-insensitive check for middle name variants
    for (const key in record) {
      const lcKey = key.toLowerCase();
      if ((lcKey === "middlename" || lcKey === "middle_name") && 
          !nonPatientNameFields.some(field => field.toLowerCase() === lcKey) &&
          typeof record[key as keyof Record] === 'string') {
        return String(record[key as keyof Record]);
      }
    }
    
    // Scan for other matching fields but explicitly exclude non-patient name fields
    for (const key in record) {
      if (nonPatientNameFields.some(field => 
          field.toLowerCase() === key.toLowerCase() || 
          field.replace(/"/g, '') === key)) continue;
      
      const lcKey = key.toLowerCase();
      if ((lcKey.includes('middle') && lcKey.includes('name')) &&
          !lcKey.includes('cell') &&
          !lcKey.includes('leader') &&
          !lcKey.includes('oldest') &&
          !lcKey.includes('balozi') &&
          !lcKey.includes('household') &&
          !lcKey.includes('member') &&
          typeof record[key as keyof Record] === 'string') {
        return String(record[key as keyof Record]);
      }
    }
  }
  
  return defaultValue;
};

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
  
  // Get the correct name fields
  const firstName = getNameField(record, 'firstName', '');
  const lastName = getNameField(record, 'lastName', '');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine match confidence level
  const getConfidenceLevel = (score?: number) => {
    if (score === undefined) return null;
    if (score >= 80) return { label: 'High', color: 'bg-success/10 text-success' };
    if (score >= 60) return { label: 'Medium', color: 'bg-warning/10 text-warning' };
    return { label: 'Low', color: 'bg-destructive/10 text-destructive' };
  };
  
  const confidenceLevel = getConfidenceLevel(matchScore);

  // For debugging
  if (process.env.NODE_ENV !== 'production') {
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
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {firstName} {lastName}
            </h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span>{record.gender}</span>
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
        
        {(isExpanded || isHighlighted) && (
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
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary font-medium hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
          
          {showActions && (
            <div className="flex space-x-2">
              <button
                onClick={onReject}
                className="inline-flex items-center justify-center p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all-medium"
                aria-label="Reject match"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={onMatch}
                className="inline-flex items-center justify-center p-2 rounded-full bg-success/10 text-success hover:bg-success/20 transition-all-medium"
                aria-label="Confirm match"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
