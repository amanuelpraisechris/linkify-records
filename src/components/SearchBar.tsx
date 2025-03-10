
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({ placeholder = "Search records...", onSearch, className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        onSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={`relative w-full transition-all duration-300 ${className}`}
    >
      <div 
        className={`flex items-center relative bg-white dark:bg-black shadow-subtle rounded-lg overflow-hidden transition-all-medium ${
          isFocused 
            ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background' 
            : 'hover:shadow-card'
        }`}
      >
        <Search 
          className={`absolute left-3 w-5 h-5 transition-all duration-300 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 pr-10 py-3 bg-transparent outline-none text-foreground"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-secondary transition-all-medium"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
