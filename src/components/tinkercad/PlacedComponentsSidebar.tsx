import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PlacedComponent, PlacedWire } from '../../types/builder';
import { COMPONENTS_CATALOG } from '../../lib/componentsCatalog';
import {
  Search,
  X,
  RotateCw,
  Trash2,
  CopyPlus,
  Crosshair,
  Sliders,
  Cpu,
  Layers,
  Cable,
  Download,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Zap,
  Info
} from 'lucide-react';

interface PlacedComponentsSidebarProps {
  components: PlacedComponent[];
  wires: PlacedWire[];
  selectedInstanceId: string | null;
  selectedInstanceIds?: string[];
  onSelectComponent: (instanceId: string) => void;
  onUpdateComponent: (instanceId: string, updates: Partial<PlacedComponent>) => void;
  onUpdateComponentState: (
    instanceId: string,
    stateUpdates: Partial<NonNullable<PlacedComponent['state']>>
  ) => void;
  onRotateComponent: (instanceId: string) => void;
  onDuplicateComponent: (instanceId: string) => void;
  onDeleteComponent: (instanceId: string) => void;
  onGroupSelected?: () => void;
  onUngroupSelected?: () => void;
  onSelectWire?: (wireId: string) => void;
  onLocateComponent?: (instanceId: string) => void;
  onClose: () => void;
}

const RESISTOR_PRESETS = ['100Ω', '220Ω', '330Ω', '1kΩ', '2.2kΩ', '4.7kΩ', '10kΩ', '100kΩ', '1MΩ'];
const LED_COLORS = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'White', value: 'white', hex: '#F8FAFC' },
  { name: 'Orange', value: 'orange', hex: '#F97316' }
];

export const PlacedComponentsSidebar: React.FC<PlacedComponentsSidebarProps> = ({
  components,
  wires,
  selectedInstanceId,
  selectedInstanceIds,
  onSelectComponent,
  onUpdateComponent,
  onUpdateComponentState,
  onRotateComponent,
  onDuplicateComponent,
  onDeleteComponent,
  onGroupSelected,
  onUngroupSelected,
  onSelectWire,
  onLocateComponent,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Basic' | 'Arduino' | 'Sensors' | 'Actuators'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'position' | 'connections'>('name');
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-scroll to selected component card when selection changes
  useEffect(() => {
    if (selectedInstanceId && cardRefs.current[selectedInstanceId]) {
      cardRefs.current[selectedInstanceId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
      // Ensure the selected card is expanded
      setExpandedCards((prev) => ({ ...prev, [selectedInstanceId]: true }));
    }
  }, [selectedInstanceId]);

  // Toggle card expansion
  const toggleCardExpand = (instanceId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [instanceId]: !prev[instanceId]
    }));
  };

  // Connected wires helper for a specific component
  const getComponentWires = (instanceId: string) => {
    return wires.filter(
      (w) => w.fromComponentId === instanceId || w.toComponentId === instanceId
    );
  };

  // Catalog item lookup
  const getCatalogItem = (comp: PlacedComponent) => {
    return COMPONENTS_CATALOG.find((c) => c.id === comp.componentId);
  };

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    let list = components.filter((comp) => {
      const catalog = getCatalogItem(comp);
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.componentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comp.customValue && comp.customValue.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comp.color && comp.color.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'Basic') return catalog?.category === 'Basic';
      if (selectedFilter === 'Arduino') return catalog?.category === 'Arduino' || comp.componentId.includes('arduino');
      if (selectedFilter === 'Sensors') {
        return (
          comp.componentId.includes('potentiometer') ||
          comp.componentId.includes('ultrasonic') ||
          comp.componentId.includes('pushbutton') ||
          comp.componentId.includes('photoresistor') ||
          comp.componentId.includes('pir')
        );
      }
      if (selectedFilter === 'Actuators') {
        return (
          comp.componentId.includes('led') ||
          comp.componentId.includes('servo') ||
          comp.componentId.includes('piezo')
        );
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.componentId.localeCompare(b.componentId);
      if (sortBy === 'position') return a.y - b.y || a.x - b.x;
      if (sortBy === 'connections') {
        const countA = getComponentWires(a.instanceId).length;
        const countB = getComponentWires(b.instanceId).length;
        return countB - countA;
      }
      return 0;
    });
  }, [components, searchQuery, selectedFilter, sortBy, wires]);

  // Export Bill of Materials (BOM) as CSV
  const handleExportBOM = () => {
    const headers = ['Instance ID', 'Component Name', 'Type', 'X (px)', 'Y (px)', 'Rotation', 'Value / Color', 'Connected Wires'];
    const rows = components.map((c) => {
      const wireCount = getComponentWires(c.instanceId).length;
      const spec = c.customValue || c.color || '-';
      return [
        c.instanceId,
        `"${c.name.replace(/"/g, '""')}"`,
        c.componentId,
        c.x,
        c.y,
        `${c.rotation}°`,
        `"${spec}"`,
        wireCount
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tinkercad_bill_of_materials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRename = (comp: PlacedComponent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNameId(comp.instanceId);
    setTempName(comp.name);
  };

  const saveRename = (instanceId: string) => {
    if (tempName.trim()) {
      onUpdateComponent(instanceId, { name: tempName.trim() });
    }
    setEditingNameId(null);
  };

  return (
    <aside className="w-80 lg:w-96 bg-[#182230] text-slate-100 border-r border-[#2C3E50] flex flex-col z-30 shrink-0 shadow-2xl h-full select-none animate-in slide-in-from-left duration-200">
      {/* 1. Sidebar Header */}
      <div className="p-3 bg-[#111A24] border-b border-[#2C3E50] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#0084FF]/20 text-[#0084FF] flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black tracking-wide uppercase text-white">
                Canvas Components
              </h3>
              <span className="px-1.5 py-0.2 rounded-full bg-[#0084FF] text-white font-mono text-[10px] font-bold">
                {components.length}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Live circuit hierarchy & properties
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleExportBOM}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Export Bill of Materials (BOM CSV)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Components Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Circuit Overview Stats Banner */}
      <div className="px-3 py-2 bg-[#1B2733]/60 border-b border-slate-700/50 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1 text-slate-300">
          <span className="text-slate-400">Parts:</span>
          <span className="font-bold text-white">{components.length}</span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <div className="flex items-center gap-1 text-slate-300">
          <span className="text-slate-400">Wires:</span>
          <span className="font-bold text-emerald-400">{wires.length}</span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <div className="flex items-center gap-1 text-slate-300">
          <span className="text-slate-400">Supply:</span>
          <span className="font-bold text-amber-400">
            {components.some((c) => c.componentId === 'comp-battery-9v') ? '9.00V' : '5.00V'}
          </span>
        </div>
      </div>

      {/* 3. Search Bar & Filter Controls */}
      <div className="p-3 border-b border-slate-700/60 bg-[#16202C] space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search placed components (name, pin, value)..."
            className="w-full bg-[#0F1722] text-xs text-white placeholder-slate-500 rounded-md pl-8 pr-7 py-1.5 border border-slate-700 focus:outline-none focus:border-[#0084FF] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
            {(['All', 'Basic', 'Arduino', 'Sensors', 'Actuators'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === cat
                    ? 'bg-[#0084FF] text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 text-[10px] text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-700 focus:outline-none focus:border-[#0084FF] cursor-pointer"
          >
            <option value="name">Sort: Name</option>
            <option value="type">Sort: Type</option>
            <option value="position">Sort: Position</option>
            <option value="connections">Sort: Wires</option>
          </select>
        </div>
      </div>

      {/* 4. Placed Components List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedInstanceIds && selectedInstanceIds.length > 1 && (
          <div className="p-2.5 bg-[#0084FF]/20 border border-[#0084FF] rounded-xl flex items-center justify-between text-xs animate-in fade-in shadow-md">
            <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#0084FF] animate-ping" />
              <span>{selectedInstanceIds.length} selected</span>
            </span>
            <div className="flex items-center gap-1.5">
              {onGroupSelected && (
                <button
                  onClick={onGroupSelected}
                  className="px-2.5 py-1 rounded-md bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-[10px] cursor-pointer shadow-xs transition-colors"
                  title="Group Selected Components (Ctrl+G)"
                >
                  Group (Ctrl+G)
                </button>
              )}
              {onUngroupSelected &&
                components.some((c) => selectedInstanceIds.includes(c.instanceId) && c.groupId) && (
                  <button
                    onClick={onUngroupSelected}
                    className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] cursor-pointer shadow-xs transition-colors"
                    title="Ungroup Selected Components (Ctrl+Shift+G)"
                  >
                    Ungroup
                  </button>
                )}
            </div>
          </div>
        )}

        {components.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Canvas is Empty</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Drag electronic components from the Components Library on the right to start building.
              </p>
            </div>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2">
            <p className="text-xs text-slate-400 font-medium">
              No components match &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('All');
              }}
              className="text-[11px] text-[#0084FF] hover:underline font-bold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredComponents.map((comp) => {
            const isSelected =
              (selectedInstanceIds && selectedInstanceIds.includes(comp.instanceId)) ||
              selectedInstanceId === comp.instanceId;
            const isExpanded = isSelected || expandedCards[comp.instanceId] !== false;
            const catalog = getCatalogItem(comp);
            const compWires = getComponentWires(comp.instanceId);

            return (
              <div
                key={comp.instanceId}
                ref={(el) => {
                  cardRefs.current[comp.instanceId] = el;
                }}
                onClick={() => onSelectComponent(comp.instanceId)}
                className={`rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-[#1E2C3D] border-[#0084FF] ring-2 ring-[#0084FF]/60 shadow-lg'
                    : 'bg-[#151E2A] border-slate-700/80 hover:border-slate-600 hover:bg-[#1A2534]'
                }`}
              >
                {/* Component Card Header */}
                <div className="p-2.5 flex items-start justify-between gap-2 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-lg shrink-0 p-1 rounded bg-slate-800/80 border border-slate-700">
                      {catalog?.icon || '⚙️'}
                    </span>

                    <div className="min-w-0 flex-1">
                      {editingNameId === comp.instanceId ? (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(comp.instanceId);
                              if (e.key === 'Escape') setEditingNameId(null);
                            }}
                            autoFocus
                            className="text-xs font-bold text-white bg-slate-900 border border-[#0084FF] rounded px-1.5 py-0.5 w-full focus:outline-none"
                          />
                          <button
                            onClick={() => saveRename(comp.instanceId)}
                            className="p-1 text-emerald-400 hover:bg-white/10 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 group">
                          <h4 className="text-xs font-bold text-white truncate leading-snug">
                            {comp.name}
                          </h4>
                          {comp.groupId && (
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 font-bold text-[9px] shrink-0 border border-purple-500/40">
                              Group
                            </span>
                          )}
                          <button
                            onClick={(e) => startRename(comp, e)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#0084FF] text-slate-400 transition-opacity"
                            title="Rename component"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                        <span className="font-mono text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-300">
                          {comp.componentId.replace('comp-', '')}
                        </span>
                        <span>•</span>
                        <span className="font-mono">
                          X:{comp.x} Y:{comp.y}
                        </span>
                        {comp.rotation !== 0 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-mono font-bold">
                              {comp.rotation}°
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div
                    className="flex items-center gap-0.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onLocateComponent && (
                      <button
                        onClick={() => onLocateComponent(comp.instanceId)}
                        className="p-1 rounded text-slate-400 hover:text-[#0084FF] hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Locate & Center on Canvas"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onRotateComponent(comp.instanceId)}
                      className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDuplicateComponent(comp.instanceId)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Duplicate Component"
                    >
                      <CopyPlus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteComponent(comp.instanceId)}
                      className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Component"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleCardExpand(comp.instanceId)}
                      className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Properties & Live Controls */}
                {isExpanded && (
                  <div
                    className="p-2.5 space-y-2.5 bg-[#141B26]/50 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Position & Rotation Controls */}
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <label className="text-slate-400 block mb-0.5 font-mono">X (px)</label>
                        <input
                          type="number"
                          value={comp.x}
                          onChange={(e) =>
                            onUpdateComponent(comp.instanceId, { x: Number(e.target.value) })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-white font-mono focus:outline-none focus:border-[#0084FF]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5 font-mono">Y (px)</label>
                        <input
                          type="number"
                          value={comp.y}
                          onChange={(e) =>
                            onUpdateComponent(comp.instanceId, { y: Number(e.target.value) })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-white font-mono focus:outline-none focus:border-[#0084FF]"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5 font-mono">Rotation</label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onRotateComponent(comp.instanceId)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono font-bold rounded py-1 px-1 text-center border border-slate-700 transition-colors"
                            title="Toggle 90° orientation"
                          >
                            {comp.rotation}° ⟳
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* COMPONENT SPECIFIC LIVE PROPERTIES */}

                    {/* 1. Resistor Value */}
                    {comp.componentId === 'comp-resistor' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold">Resistance Value:</span>
                          <span className="text-amber-400 font-mono font-bold">
                            {comp.customValue || '220Ω'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {RESISTOR_PRESETS.map((val) => (
                            <button
                              key={val}
                              onClick={() =>
                                onUpdateComponent(comp.instanceId, { customValue: val })
                              }
                              className={`py-1 px-1 rounded text-[10px] font-mono font-bold text-center border transition-all ${
                                (comp.customValue || '220Ω') === val
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. LED Color & State */}
                    {comp.componentId === 'comp-led' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold">LED Color:</span>
                          <span className="capitalize font-bold text-white">
                            {comp.color || 'red'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {LED_COLORS.map((col) => (
                            <button
                              key={col.value}
                              onClick={() =>
                                onUpdateComponent(comp.instanceId, { color: col.value })
                              }
                              style={{ backgroundColor: col.hex }}
                              className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                                (comp.color || 'red') === col.value
                                  ? 'scale-115 ring-2 ring-white border-white'
                                  : 'border-slate-700 opacity-75 hover:opacity-100'
                              }`}
                              title={col.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Potentiometer Knob Angle */}
                    {comp.componentId === 'comp-potentiometer' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold">Dial Wiper Angle:</span>
                          <span className="text-emerald-400 font-mono font-bold">
                            {comp.state?.knobAngle ?? 135}° (
                            {Math.round(((comp.state?.knobAngle ?? 135) / 270) * 100)}%)
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={270}
                          value={comp.state?.knobAngle ?? 135}
                          onChange={(e) =>
                            onUpdateComponentState(comp.instanceId, {
                              knobAngle: Number(e.target.value)
                            })
                          }
                          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    )}

                    {/* 4. Ultrasonic Distance Slider */}
                    {comp.componentId === 'comp-ultrasonic' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold">Obstacle Distance:</span>
                          <span className="text-cyan-400 font-mono font-bold">
                            {comp.state?.distanceCm ?? 24} cm
                          </span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={200}
                          value={comp.state?.distanceCm ?? 24}
                          onChange={(e) =>
                            onUpdateComponentState(comp.instanceId, {
                              distanceCm: Number(e.target.value)
                            })
                          }
                          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    )}

                    {/* 5. Servo Motor Angle Slider */}
                    {comp.componentId === 'comp-servo' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-bold">Servo Position:</span>
                          <span className="text-blue-400 font-mono font-bold">
                            {comp.state?.servoAngle ?? 60}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={180}
                          value={comp.state?.servoAngle ?? 60}
                          onChange={(e) =>
                            onUpdateComponentState(comp.instanceId, {
                              servoAngle: Number(e.target.value)
                            })
                          }
                          className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    )}

                    {/* 6. Pushbutton Switch State */}
                    {comp.componentId === 'comp-pushbutton' && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-300 font-bold">Contact State:</span>
                        <button
                          onClick={() =>
                            onUpdateComponentState(comp.instanceId, {
                              buttonPressed: !comp.state?.buttonPressed
                            })
                          }
                          className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                            comp.state?.buttonPressed
                              ? 'bg-blue-500 text-white border-blue-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                          }`}
                        >
                          {comp.state?.buttonPressed ? 'PRESSED (CLOSED)' : 'RELEASED (OPEN)'}
                        </button>
                      </div>
                    )}

                    {/* 7. Arduino Microcontroller Info */}
                    {comp.componentId === 'comp-arduino-uno' && (
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] space-y-1 font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">MCU:</span>
                          <span className="text-cyan-400">ATmega328P</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Clock:</span>
                          <span>16.000 MHz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">GPIO:</span>
                          <span>14 Digital / 6 Analog</span>
                        </div>
                      </div>
                    )}

                    {/* 8. Breadboard Info */}
                    {comp.componentId === 'comp-breadboard' && (
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] space-y-1 font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Type:</span>
                          <span className="text-white">Half-size Prototyping</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Tie Points:</span>
                          <span>400 holes (30 cols)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Power Rails:</span>
                          <span className="text-emerald-400">Dual (+ / -)</span>
                        </div>
                      </div>
                    )}

                    {/* Connected Wires Section */}
                    <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <Cable className="w-3 h-3 text-[#0084FF]" />
                          Connected Wires ({compWires.length}):
                        </span>
                      </div>

                      {compWires.length === 0 ? (
                        <div className="text-[10px] text-slate-500 italic bg-slate-900/40 p-1.5 rounded">
                          No wires attached to this component yet.
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {compWires.map((w) => {
                            const isSource = w.fromComponentId === comp.instanceId;
                            const myPin = isSource ? w.fromPin : w.toPin;
                            const otherId = isSource ? w.toComponentId : w.fromComponentId;
                            const otherPin = isSource ? w.toPin : w.fromPin;
                            const otherComp = components.find((c) => c.instanceId === otherId);

                            return (
                              <div
                                key={w.id}
                                onClick={() => onSelectWire && onSelectWire(w.id)}
                                className="flex items-center justify-between p-1.5 rounded bg-slate-900/70 border border-slate-800 hover:border-[#0084FF] text-[10px] cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/40"
                                    style={{
                                      backgroundColor:
                                        w.color === 'green'
                                          ? '#10B981'
                                          : w.color === 'yellow'
                                          ? '#F59E0B'
                                          : w.color === 'red'
                                          ? '#EF4444'
                                          : w.color === 'black'
                                          ? '#1E293B'
                                          : w.color === 'blue'
                                          ? '#3B82F6'
                                          : '#94A3B8'
                                    }}
                                  />
                                  <span className="font-mono text-white font-bold">
                                    {myPin || 'Canvas'}
                                  </span>
                                  <span className="text-slate-500">➔</span>
                                  <span className="text-slate-300 truncate">
                                    {otherComp?.name || 'Canvas'} ({otherPin || 'Pt'})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Footer info & Quick Add Tip */}
      <div className="p-2.5 bg-[#111A24] border-t border-[#2C3E50] text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-[#0084FF]" />
          Click item to select & inspect
        </span>
        <span className="font-mono text-slate-500">CAD Inspector v3</span>
      </div>
    </aside>
  );
};
