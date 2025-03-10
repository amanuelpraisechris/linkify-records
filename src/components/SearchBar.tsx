
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { containsEthiopicScript } from '@/utils/languageUtils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  dir?: 'ltr' | 'rtl';
  debounceTime?: number;
  initialValue?: string;
}

const SearchBar = ({ 
  placeholder = "Search records...", 
  onSearch, 
  className = "",
  dir = "ltr",
  debounceTime = 300,
  initialValue = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Apply the search immediately when component mounts with an initial value
    if (initialValue) {
      onSearch(initialValue);
    }
  }, [initialValue, onSearch]);

  useEffect(() => {
    // Add console log to debug when search is triggered
    console.log(`Search query changed: "${query}"`);
    
    const timer = setTimeout(() => {
      console.log(`Executing search for: "${query}"`);
      onSearch(query);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceTime]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Dynamically set direction based on input content
  const getDirection = (): 'ltr' | 'rtl' => {
    if (dir !== 'ltr') return dir;
    return containsEthiopicScript(query) ? 'rtl' : 'ltr';
  };

  const direction = getDirection();

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
          className={`${direction === 'rtl' ? 'right-3' : 'left-3'} absolute w-5 h-5 transition-all duration-300 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          className={`w-full py-3 bg-transparent outline-none text-foreground ${
            direction === 'rtl' 
              ? 'pr-10 pl-10 text-right' 
              : 'pl-10 pr-10 text-left'
          }`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          dir={direction}
        />
        {query && (
          <button
            onClick={handleClear}
            className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} p-1 rounded-full hover:bg-secondary transition-all-medium`}
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
