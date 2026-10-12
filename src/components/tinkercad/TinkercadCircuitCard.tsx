import React, { useState } from 'react';
import { CircuitDesign } from '../../types';
import { Settings, Play, Sparkles, Cpu, Copy, Trash2, Edit } from 'lucide-react';

interface TinkercadCircuitCardProps {
  circuit: CircuitDesign;
  onTinker: (circuit: CircuitDesign) => void;
  onDuplicate?: (circuit: CircuitDesign) => void;
  onDelete?: (circuitId: string) => void;
}

export const TinkercadCircuitCard: React.FC<TinkercadCircuitCardProps> = ({
  circuit,
  onTinker,
  onDuplicate,
  onDelete
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMenuOpen(false);
      }}
      className="group bg-white dark:bg-[#1E293B] rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer select-none"
    >
      {/* Top Workplane Thumbnail Area */}
      <div
        onClick={() => onTinker(circuit)}
        className="relative h-44 bg-[#E9ECEF] dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-3 bg-circuit-workplane"
      >
        {/* Vector SVG Schematic Thumbnail */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          {circuit.simulationType === 'led' && (
            <svg viewBox="0 0 240 140" className="w-full h-full" fill="none">
              <rect x="20" y="30" width="80" height="85" rx="6" fill="#0084FF" stroke="#005DBF" strokeWidth="2" />
              <text x="32" y="55" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ARDUINO</text>
              <rect x="130" y="20" width="90" height="100" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="175" cy="55" r="10" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
              <circle cx="175" cy="55" r="15" fill="#EF4444" opacity="0.25" />
              <path d="M 80 45 C 110 45, 120 75, 150 75" stroke="#10B981" strokeWidth="2.5" fill="none" />
              <path d="M 80 95 C 110 95, 120 100, 150 100" stroke="#0F172A" strokeWidth="2.5" fill="none" />
              <rect x="150" y="73" width="25" height="5" rx="2" fill="#D97706" />
            </svg>
          )}

          {circuit.simulationType === 'traffic-light' && (
            <svg viewBox="0 0 240 140" className="w-full h-full" fill="none">
              <rect x="20" y="30" width="75" height="85" rx="6" fill="#0084FF" stroke="#005DBF" strokeWidth="2" />
              <rect x="120" y="20" width="100" height="100" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <rect x="150" y="30" width="35" height="80" rx="10" fill="#1E293B" />
              <circle cx="167" cy="46" r="7" fill="#EF4444" />
              <circle cx="167" cy="70" r="7" fill="#F59E0B" />
              <circle cx="167" cy="94" r="7" fill="#10B981" />
              <path d="M 80 50 L 140 50" stroke="#EF4444" strokeWidth="2" fill="none" />
              <path d="M 80 70 L 140 70" stroke="#F59E0B" strokeWidth="2" fill="none" />
              <path d="M 80 90 L 140 90" stroke="#10B981" strokeWidth="2" fill="none" />
            </svg>
          )}

          {circuit.simulationType === 'ultrasonic' && (
            <svg viewBox="0 0 240 140" className="w-full h-full" fill="none">
              <rect x="20" y="30" width="75" height="85" rx="6" fill="#0084FF" stroke="#005DBF" strokeWidth="2" />
              <rect x="125" y="45" width="85" height="50" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
              <circle cx="150" cy="70" r="14" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="185" cy="70" r="14" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
              <path d="M 80 55 C 100 55, 110 65, 125 65" stroke="#10B981" strokeWidth="2" fill="none" />
              <path d="M 80 75 C 100 75, 110 75, 125 75" stroke="#F59E0B" strokeWidth="2" fill="none" />
              <circle cx="215" cy="70" r="4" fill="#0084FF" />
              <circle cx="225" cy="70" r="6" stroke="#0084FF" strokeWidth="1.5" />
            </svg>
          )}

          {circuit.simulationType !== 'led' &&
            circuit.simulationType !== 'traffic-light' &&
            circuit.simulationType !== 'ultrasonic' && (
              <svg viewBox="0 0 240 140" className="w-full h-full" fill="none">
                <rect x="25" y="30" width="80" height="85" rx="6" fill="#0084FF" stroke="#005DBF" strokeWidth="2" />
                <rect x="130" y="30" width="85" height="85" rx="6" fill="#334155" />
                <path d="M 90 60 L 130 60" stroke="#10B981" strokeWidth="2.5" />
                <path d="M 90 85 L 130 85" stroke="#EF4444" strokeWidth="2.5" />
              </svg>
            )}
        </div>

        {/* Options Gear Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm flex items-center justify-center transition-opacity cursor-pointer ${
            isHovered || menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          title="Circuit Options"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Options Dropdown Menu */}
        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-11 right-2.5 w-40 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 animate-in fade-in-50 text-xs text-slate-700 dark:text-slate-200"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onTinker(circuit);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#0084FF] flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Open in Studio</span>
            </button>

            {onDuplicate && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate(circuit);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(circuit.id);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}

        {/* Sun Academy Hover Overlay with "Simulate & Edit" and "Copy" Buttons */}
        <div
          className={`absolute inset-0 bg-slate-900/60 flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={() => onTinker(circuit)}
            className="bg-[#0084FF] hover:bg-[#0070E0] active:bg-[#005DBF] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate & Edit</span>
          </button>
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(circuit);
              }}
              className="bg-white hover:bg-slate-100 text-slate-800 px-3.5 py-2 rounded-md font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-all cursor-pointer"
              title="Duplicate / Copy this circuit"
            >
              <Copy className="w-3.5 h-3.5 text-[#0084FF]" />
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Bottom Metadata */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white dark:bg-[#1E293B]">
        <div>
          <h3
            onClick={() => onTinker(circuit)}
            className="font-bold text-sm text-slate-800 dark:text-white hover:text-[#0084FF] transition-colors truncate"
            title={circuit.title}
          >
            {circuit.title}
          </h3>

          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 font-medium">
            <span>{circuit.lastEdited}</span>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">
              {circuit.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
            <Cpu className="w-3 h-3 text-[#0084FF]" />
            {circuit.componentsCount} components
          </span>

          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            {circuit.difficulty}
          </span>
        </div>

        {/* Action Buttons: Tinker & Copy */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTinker(circuit);
            }}
            className="flex-1 py-1.5 px-2.5 rounded bg-[#0084FF] hover:bg-[#0070D6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Open and edit in Circuit Workbench"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Tinker</span>
          </button>

          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(circuit);
              }}
              className="py-1.5 px-2.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Copy / Duplicate this circuit"
            >
              <Copy className="w-3 h-3 text-[#0084FF]" />
              <span>Copy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
