import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onInputChange?: (term: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({
  onSearch,
  onInputChange,
  placeholder = "Search...",
  isLoading = false
}: SearchBarProps) {
  const [value, setValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onInputChange?.(newValue);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSearch(value);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
      {isLoading ? (
        <Loader2 className="animate-spin text-white/70" size={20} />
      ) : (
        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="text-white/50 hover:text-white/70 transition-colors disabled:opacity-50"
        >
          <Search size={20} />
        </button>
      )}
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full bg-transparent text-white/90 placeholder-white/50 outline-none
                   transition-all duration-300 focus:placeholder:opacity-60
                   text-base font-medium tracking-normal disabled:opacity-50
                   disabled:cursor-not-allowed focus:ring-0
                   selection:bg-white/20 selection:text-white"
          autoComplete="off"
          spellCheck="false"
          maxLength={50}
        />
        {value && (
          <button
            onClick={() => {
              setValue('');
              onInputChange?.('');
            }}
            disabled={isLoading}
            className="text-white/30 hover:text-white/50 transition-colors p-1 rounded-full
                     hover:bg-white/5 active:bg-white/10
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}