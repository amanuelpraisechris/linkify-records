
import { useState } from 'react';
import { Record } from '@/types';
import RecordCard from './RecordCard';
import SearchBar from './SearchBar';
import { Filter } from 'lucide-react';

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

  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      record.firstName.toLowerCase().includes(query) ||
      record.lastName.toLowerCase().includes(query) ||
      record.patientId?.toLowerCase().includes(query) ||
      record.healthFacility?.toLowerCase().includes(query) ||
      record.identifiers?.some(id => id.value.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-all-medium"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </button>
      </div>
      
      <div className="mb-6">
        <SearchBar 
          placeholder="Search by name, ID, or facility..." 
          onSearch={setSearchQuery}
        />
      </div>
      
      {showFilters && (
        <div className="p-4 bg-muted/40 rounded-lg animate-fade-in mb-4">
          <div className="text-sm font-medium mb-2">Filter Options</div>
          <div className="text-xs text-muted-foreground">
            Advanced filters would appear here in a full implementation.
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
