import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTrack?: string;
  onTrackChange?: (t: string) => void;
  selectedLevel?: string;
  onLevelChange: (l: string) => void;
  trackOptions?: { label: string; value: string }[];
  levelOptions?: { label: string; value: string }[];
  placeholder?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedTrack,
  onTrackChange,
  selectedLevel = 'all',
  onLevelChange,
  trackOptions = [],
  levelOptions = [
    { label: 'All Levels', value: 'all' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ],
  placeholder = 'Search by keyword, topic, or hardware...'
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Track Pills (if provided) */}
        {trackOptions.length > 0 && onTrackChange && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" /> Track:
            </span>
            {trackOptions.map((opt) => {
              const active = selectedTrack === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onTrackChange(opt.value)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Level Pills */}
        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          <span className="text-slate-400 mr-1">Level:</span>
          {levelOptions.map((lvl) => {
            const active = selectedLevel === lvl.value;
            return (
              <button
                key={lvl.value}
                onClick={() => onLevelChange(lvl.value)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
