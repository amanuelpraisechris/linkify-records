
import { useState } from 'react';
import SearchBar from './SearchBar';
import { Globe, Filter } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageUtils';

interface RecordFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLanguage: SupportedLanguage;
  setSearchLanguage: (language: SupportedLanguage) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const RecordFilters = ({
  searchQuery,
  setSearchQuery,
  searchLanguage,
  setSearchLanguage,
  showFilters,
  setShowFilters
}: RecordFiltersProps) => {
  return (
    <>
      <div className="flex items-center space-x-3">
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
    </>
  );
};

export default RecordFilters;
