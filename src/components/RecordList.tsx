
import { useState } from 'react';
import { Record } from '@/types';
import RecordCard from './RecordCard';
import SearchBar from './SearchBar';
import { Filter, Globe } from 'lucide-react';
import { SupportedLanguage, compareStrings } from '@/utils/languageUtils';

interface RecordListProps {
  records: Record[];
  title?: string;
  emptyMessage?: string;
}

const RecordList = ({ 
  records, 
  title = "Records",
  emptyMessage = "No records found" 
}: RecordListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchLanguage, setSearchLanguage] = useState<SupportedLanguage>('latin');

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
        
        <div className="flex items-center space-x-2">
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
        <div className="grid gap-4 animate-fade-in">
          {filteredRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RecordList;
