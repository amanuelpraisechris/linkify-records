
import { useState, useEffect } from 'react';
import { Record as PatientRecord } from '@/types';
import RecordCard from './RecordCard';
import SearchBar from './SearchBar';
import { Filter, Globe, Table, LayoutList, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { SupportedLanguage, compareStrings } from '@/utils/languageUtils';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecordListProps {
  records: PatientRecord[];
  title?: string;
  emptyMessage?: string;
  showMatchDetail?: boolean;
}

const RecordList = ({ 
  records, 
  title = "Records",
  emptyMessage = "No records found",
  showMatchDetail = false
}: RecordListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchLanguage, setSearchLanguage] = useState<SupportedLanguage>('latin');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const { config } = useMatchingConfig();
  
  useEffect(() => {
    console.log(`RecordList received ${records.length} records`);
    if (records.length > 0) {
      console.log('Sample record:', records[0]);
    }
  }, [records]);

  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    
    console.log(`Filtering record: ${record.firstName} ${record.lastName}`);
    
    const fields = Object.entries(record).reduce((acc, [key, value]) => {
      if (key.startsWith('"') && typeof value === 'string') {
        const cleanKey = key.replace(/"/g, '');
        acc[cleanKey] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    const matches = 
      compareStrings(record.firstName, searchQuery, searchLanguage) ||
      compareStrings(record.lastName, searchQuery, searchLanguage) ||
      compareStrings(record.patientId || '', searchQuery, searchLanguage) ||
      compareStrings(record.healthFacility || '', searchQuery, searchLanguage) ||
      compareStrings(record.village || '', searchQuery, searchLanguage) ||
      compareStrings(record.district || '', searchQuery, searchLanguage) ||
      record.identifiers?.some(id => compareStrings(id.value, searchQuery, searchLanguage)) ||
      compareStrings(fields.FirstName || '', searchQuery, searchLanguage) ||
      compareStrings(fields.LastName || '', searchQuery, searchLanguage) ||
      compareStrings(fields.villagename || '', searchQuery, searchLanguage) ||
      compareStrings(fields.subvillagename || '', searchQuery, searchLanguage);
    
    if (matches) {
      console.log(`Match found for "${searchQuery}": ${record.firstName || fields.FirstName} ${record.lastName || fields.LastName}`);
    }
    
    return matches;
  });

  const toggleRecordDetails = (recordId: string) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(recordId);
    }
  };

  const getDisplayName = (record: Record) => {
    if (record["\"FirstName\""] && record["\"LastName\""]) {
      const firstName = record["\"FirstName\""].replace(/"/g, '');
      const lastName = record["\"LastName\""].replace(/"/g, '');
      return `${firstName} ${lastName}`;
    }
    
    return `${record.firstName || ''} ${record.lastName || ''}`.trim() || 'Unknown';
  };

  const getVillageName = (record: Record) => {
    if (record["\"villagename\""]) {
      return record["\"villagename\""].replace(/"/g, '');
    }
    
    return record.village || '-';
  };

  const getSubVillageName = (record: Record) => {
    if (record["\"subvillagename\""]) {
      return record["\"subvillagename\""].replace(/"/g, '');
    }
    
    return record.subVillage || '-';
  };

  const getGender = (record: Record) => {
    if (record["\"Sex\""]) {
      const sex = record["\"Sex\""].replace(/"/g, '');
      return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
    }
    
    return record.gender || '-';
  };

  const getBirthDate = (record: Record) => {
    if (record["\"dob\""]) {
      return record["\"dob\""].replace(/"/g, '');
    }
    
    return record.birthDate || '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'card' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Card view"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Table view"
          >
            <Table className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1"></div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-all-medium"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </button>
          
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-1 text-muted-foreground" />
            <select
              value={searchLanguage}
              onChange={(e) => setSearchLanguage(e.target.value as SupportedLanguage)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="latin">Latin</option>
              <option value="amharic">Amharic</option>
              <option value="tigrinya">Tigrinya</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <SearchBar 
          placeholder={searchLanguage === 'latin' 
            ? "Search by name, ID, or facility..." 
            : searchLanguage === 'amharic' 
              ? "በስም፣ መታወቂያ ወይም ተቋም ይፈልጉ..." 
              : "ብስም፡ መንነት ወይ ትካል ይድለዩ..."}
          onSearch={setSearchQuery}
        />
      </div>
      
      {showFilters && (
        <div className="p-4 bg-muted/40 rounded-lg animate-fade-in mb-4">
          <div className="text-sm font-medium mb-2">Filter Options</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Search Language</label>
              <select
                value={searchLanguage}
                onChange={(e) => setSearchLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-2 text-sm border rounded-md bg-background"
              >
                <option value="latin">Latin</option>
                <option value="amharic">አማርኛ (Amharic)</option>
                <option value="tigrinya">ትግርኛ (Tigrinya)</option>
              </select>
            </div>
            <div className="text-xs text-muted-foreground">
              Additional filters would appear here in a full implementation.
            </div>
          </div>
        </div>
      )}
      
      {filteredRecords.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid gap-4 animate-fade-in">
            {filteredRecords.map((record) => (
              <RecordCard key={record.id} record={{
                ...record,
                firstName: record.firstName || (record["\"FirstName\""] ? record["\"FirstName\""].replace(/"/g, '') : ''),
                lastName: record.lastName || (record["\"LastName\""] ? record["\"LastName\""].replace(/"/g, '') : ''),
                gender: getGender(record),
                birthDate: getBirthDate(record),
                village: getVillageName(record),
                subVillage: getSubVillageName(record),
              }} />
            ))}
          </div>
        ) : (
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
                  {filteredRecords.map((record, index) => {
                    const matchScore = record.metadata?.matchScore || record.fuzzyScore;
                    
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
                    
                    const firstName = record.firstName || (record["\"FirstName\""] ? record["\"FirstName\""].replace(/"/g, '') : '');
                    const lastName = record.lastName || (record["\"LastName\""] ? record["\"LastName\""].replace(/"/g, '') : '');
                    
                    return (
                      <>
                        <tr 
                          key={record.id} 
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-center">{index + 1}</td>
                          <td className="px-4 py-3">{firstName}</td>
                          <td className="px-4 py-3">{lastName}</td>
                          <td className="px-4 py-3">{getGender(record)}</td>
                          <td className="px-4 py-3">{formatDate(getBirthDate(record))}</td>
                          <td className="px-4 py-3">{getVillageName(record)}</td>
                          <td className="px-4 py-3">{getSubVillageName(record)}</td>
                          
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
                          <tr>
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
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RecordList;
