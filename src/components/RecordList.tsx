
import { useState } from 'react';
import { Record } from '@/types';
import RecordCard from './RecordCard';
import SearchBar from './SearchBar';
import { Filter, Globe, Table, LayoutList } from 'lucide-react';
import { SupportedLanguage, compareStrings } from '@/utils/languageUtils';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';

interface RecordListProps {
  records: Record[];
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
  const { config } = useMatchingConfig();

  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    
    // Use language-aware comparison for search
    return (
      compareStrings(record.firstName, searchQuery, searchLanguage) ||
      compareStrings(record.lastName, searchQuery, searchLanguage) ||
      compareStrings(record.patientId || '', searchQuery, searchLanguage) ||
      compareStrings(record.healthFacility || '', searchQuery, searchLanguage) ||
      compareStrings(record.village || '', searchQuery, searchLanguage) ||
      compareStrings(record.district || '', searchQuery, searchLanguage) ||
      record.identifiers?.some(id => compareStrings(id.value, searchQuery, searchLanguage))
    );
  });

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
              <RecordCard key={record.id} record={record} />
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">TCL First Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">TCL Last Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Match Score</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRecords.map((record, index) => {
                    // Calculate match score if we're in a matching context
                    const matchScore = record.metadata?.matchScore || record.fuzzyScore;
                    
                    // Format the date nicely
                    const formatDate = (dateString: string) => {
                      if (!dateString) return '';
                      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
                      return new Date(dateString).toLocaleDateString(undefined, options);
                    };
                    
                    return (
                      <tr 
                        key={record.id} 
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">{index + 1}</td>
                        <td className="px-4 py-3">{record.firstName}</td>
                        <td className="px-4 py-3">{record.lastName}</td>
                        <td className="px-4 py-3">{record.gender}</td>
                        <td className="px-4 py-3">{formatDate(record.birthDate)}</td>
                        <td className="px-4 py-3">{record.village || '-'}</td>
                        <td className="px-4 py-3">{record.subVillage || '-'}</td>
                        <td className="px-4 py-3">{record.cellLeaderFirstName || '-'}</td>
                        <td className="px-4 py-3">{record.cellLeaderLastName || '-'}</td>
                        <td className="px-4 py-3">
                          {matchScore ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              matchScore >= config.threshold.high
                                ? 'bg-success/10 text-success'
                                : matchScore >= config.threshold.medium
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-destructive/10 text-destructive'
                            }`}>
                              {matchScore}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
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
