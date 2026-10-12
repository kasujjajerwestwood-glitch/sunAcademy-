import React, { useState, useMemo, useEffect } from 'react';
import { getDatabaseCircuits, saveDatabaseCircuits, getCurrentUser, UserProfile } from '../lib/database';
import { COURSES } from '../lib/courses';
import { CircuitDesign } from '../types';
import { TinkercadNavbar } from '../components/tinkercad/TinkercadNavbar';
import { TinkercadSidebar, DashboardViewType } from '../components/tinkercad/TinkercadSidebar';
import { TinkercadCircuitCard } from '../components/tinkercad/TinkercadCircuitCard';
import { TinkercadEditor } from '../components/tinkercad/TinkercadEditor';
import { Tinkercad3DBuilder } from '../components/tinkercad/Tinkercad3DBuilder';
import { TinkercadCodeblocksBuilder } from '../components/tinkercad/TinkercadCodeblocksBuilder';
import { AuthModal } from '../components/tinkercad/AuthModal';
import { ProfileModal } from '../components/tinkercad/ProfileModal';
import { TUTORIAL_VIDEOS } from '../lib/tutorialVideos';
import { TutorialVideoPlayerModal } from '../components/tinkercad/TutorialVideoPlayerModal';
import { CIRCUIT_STARTERS } from '../lib/circuitStarters';
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Cpu,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code2,
  MapPin,
  Phone,
  User,
  Box,
  Video,
  Play,
  Clock,
  Wrench
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ProgressBar';
import { CheckCircle2 } from 'lucide-react';

export const TinkercadDashboardPage: React.FC = () => {
  const { navigate, currentPath } = useNavigation();
  const { progress, getCourseCompletionPercentage } = useProgress();

  // User Profile & Authentication
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Active view: 3d-designs, circuits, tutorials, codeblocks, classes, favorites
  const [currentView, setCurrentView] = useState<DashboardViewType>(() => {
    if (currentPath.startsWith('/3d-designs')) return '3d-designs';
    if (currentPath.startsWith('/tutorials') || currentPath.startsWith('/courses')) return 'tutorials';
    if (currentPath.startsWith('/codeblocks')) return 'codeblocks';
    if (currentPath.startsWith('/classes')) return 'classes';
    if (currentPath.startsWith('/favorites')) return 'favorites';
    return 'circuits';
  });

  // Sync view when currentPath changes
  useEffect(() => {
    if (currentPath.startsWith('/3d-designs')) {
      setCurrentView('3d-designs');
    } else if (currentPath.startsWith('/tutorials') || currentPath.startsWith('/courses')) {
      setCurrentView('tutorials');
    } else if (currentPath.startsWith('/codeblocks')) {
      setCurrentView('codeblocks');
    } else if (currentPath.startsWith('/classes')) {
      setCurrentView('classes');
    } else if (currentPath.startsWith('/favorites')) {
      setCurrentView('favorites');
    } else if (currentPath === '/' || currentPath.startsWith('/circuits')) {
      setCurrentView('circuits');
    }
  }, [currentPath]);

  const [circuits, setCircuits] = useState<CircuitDesign[]>(getDatabaseCircuits);

  // Sync circuits with database
  useEffect(() => {
    saveDatabaseCircuits(circuits);
  }, [circuits]);

  // Active Builders: Circuit, 3D Design, Codeblocks
  const [activeEditingCircuit, setActiveEditingCircuit] = useState<CircuitDesign | null>(null);
  const [active3DDesign, setActive3DDesign] = useState<{ title: string } | null>(null);
  const [activeCodeblock, setActiveCodeblock] = useState<boolean>(false);
  const [activeVideoTutorial, setActiveVideoTutorial] = useState<typeof TUTORIAL_VIDEOS[0] | null>(null);
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('All');

  // Sample 3D Designs
  const [designs3D, setDesigns3D] = useState([
    {
      id: 'des-3d-1',
      title: 'Aerodynamic Space Rocket',
      shapesCount: 8,
      lastEdited: '2 hours ago',
      color: '#EF4444',
      icon: '🚀'
    },
    {
      id: 'des-3d-2',
      title: 'Arduino Uno Protection Enclosure',
      shapesCount: 4,
      lastEdited: 'Yesterday',
      color: '#0084FF',
      icon: '🧊'
    },
    {
      id: 'des-3d-3',
      title: 'Planetary 24-Tooth Mechanism Gear',
      shapesCount: 6,
      lastEdited: '3 days ago',
      color: '#F59E0B',
      icon: '⚙️'
    }
  ]);

  // Filters & layout controls
  const [selectedTab, setSelectedTab] = useState<'All' | 'Starters' | 'Circuits' | 'Codeblocks'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'modified' | 'name' | 'difficulty'>('modified');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtered circuits
  const filteredCircuits = useMemo(() => {
    return circuits
      .filter((c) => {
        const matchesTab = selectedTab === 'All' || c.category === selectedTab;
        const matchesSearch =
          searchQuery.trim() === '' ||
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'difficulty') return a.difficulty.localeCompare(b.difficulty);
        return 0; // modified
      });
  }, [circuits, selectedTab, searchQuery, sortBy]);

  const handleCreateNewCircuit = () => {
    const newCircuit: CircuitDesign = {
      id: `circ-${Date.now()}`,
      slug: `custom-circuit-${Date.now()}`,
      title: 'New Circuit (Empty Breadboard)',
      category: 'Circuits',
      lastEdited: 'Just now',
      isPublic: true,
      difficulty: 'Beginner',
      componentsCount: 1,
      simulationType: 'led',
      description: 'Clean breadboard prototyping workspace ready for components and wiring.',
      parts: [
        { name: 'Small Breadboard', quantity: 1, role: 'Circuit prototyping' }
      ],
      wiringSteps: [],
      codeLanguage: 'cpp',
      code: `// sunAcademy Custom Circuit Sketch
void setup() {
  // Initialize pins here
}

void loop() {
  // Circuit loop code
}`,
      troubleshootingTips: [],
      placedComponents: [
        {
          instanceId: 'inst-breadboard-main',
          componentId: 'comp-breadboard',
          name: 'Breadboard Small',
          x: 340,
          y: 120,
          rotation: 0
        }
      ],
      placedWires: []
    };

    setCircuits([newCircuit, ...circuits]);
    setActiveEditingCircuit(newCircuit);
  };

  const handleDuplicateCircuit = (circuitToDup: CircuitDesign) => {
    const duplicated: CircuitDesign = {
      ...circuitToDup,
      id: `circ-${Date.now()}`,
      slug: `${circuitToDup.slug}-copy`,
      title: `Copy of ${circuitToDup.title}`,
      lastEdited: 'Just now',
      placedComponents: circuitToDup.placedComponents
        ? JSON.parse(JSON.stringify(circuitToDup.placedComponents))
        : undefined,
      placedWires: circuitToDup.placedWires
        ? JSON.parse(JSON.stringify(circuitToDup.placedWires))
        : undefined
    };
    setCircuits([duplicated, ...circuits]);
  };

  const handleDeleteCircuit = (id: string) => {
    setCircuits(circuits.filter((c) => c.id !== id));
  };

  // 1. If 3D Design is active:
  if (active3DDesign) {
    return (
      <Tinkercad3DBuilder
        designTitle={active3DDesign.title}
        onBack={() => setActive3DDesign(null)}
      />
    );
  }

  // 2. If Codeblock is active:
  if (activeCodeblock) {
    return (
      <TinkercadCodeblocksBuilder
        onBack={() => setActiveCodeblock(false)}
      />
    );
  }

  // 3. If a circuit is being edited / tinkered, show the Fullscreen Tinkercad Editor!
  if (activeEditingCircuit) {
    return (
      <TinkercadEditor
        circuit={activeEditingCircuit}
        onBack={() => setActiveEditingCircuit(null)}
        onSaveTitle={(newTitle) => {
          setCircuits((prev) =>
            prev.map((c) =>
              c.id === activeEditingCircuit.id ? { ...c, title: newTitle } : c
            )
          );
        }}
        onSaveCircuit={(updatedComponents, updatedWires) => {
          setCircuits((prev) =>
            prev.map((c) =>
              c.id === activeEditingCircuit.id
                ? {
                    ...c,
                    placedComponents: updatedComponents,
                    placedWires: updatedWires,
                    componentsCount: updatedComponents.length,
                    lastEdited: 'Just now'
                  }
                : c
            )
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col font-sans select-none transition-colors">
      {/* 1. Tinkercad Top Navigation Bar */}
      <TinkercadNavbar
        onCreateCircuit={handleCreateNewCircuit}
        onCreate3D={() => setActive3DDesign({ title: 'New 3D Design' })}
        onCreateCodeblock={() => setActiveCodeblock(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onSignOut={() => setCurrentUser(null)}
      />

      {/* 2. Main Dashboard Layout (Left Sidebar + Right Content Area) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <TinkercadSidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          circuitsCount={circuits.length}
          currentUser={currentUser}
          onOpenProfile={() => {
            if (currentUser) setProfileModalOpen(true);
            else setAuthModalOpen(true);
          }}
        />

        {/* Right Main Content Dashboard */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* VIEW 0: 3D DESIGNS DASHBOARD */}
          {currentView === '3d-designs' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Box className="w-6 h-6 text-amber-500" />
                    <span>3D Designs</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Build 3D models with primitive shapes, solid & hole groups, millimeter workplane, and STL export.
                  </p>
                </div>

                <button
                  onClick={() => setActive3DDesign({ title: 'New 3D Design' })}
                  className="bg-[#0084FF] hover:bg-[#0070E0] active:bg-[#005DBF] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create new 3D Design</span>
                </button>
              </div>

              {/* 3D Designs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                {designs3D.map((design) => (
                  <div
                    key={design.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-[#0084FF] transition-all"
                  >
                    {/* Visual 3D model banner */}
                    <div
                      onClick={() => setActive3DDesign({ title: design.title })}
                      className="h-44 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative cursor-pointer overflow-hidden border-b border-slate-100 dark:border-slate-700/60"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, rgba(0,132,255,0.08) 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                      }}
                    >
                      <div className="text-5xl group-hover:scale-110 transition-transform drop-shadow-md">
                        {design.icon}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white font-bold">
                        {design.shapesCount} Shapes
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 group-hover:text-[#0084FF] transition-colors">
                          {design.title}
                        </h3>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Edited {design.lastEdited} • Public
                        </div>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-3">
                        <button
                          onClick={() => setActive3DDesign({ title: design.title })}
                          className="bg-[#0084FF] hover:bg-[#0070E0] text-white px-3 py-1.5 rounded font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                        >
                          Open in 3D Studio
                        </button>
                        <span className="text-[10px] font-mono text-slate-400">STL / OBJ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 1: CIRCUITS DASHBOARD */}
          {currentView === 'circuits' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header Title & Primary Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-[#0084FF]" />
                    <span>Circuits</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Design and simulate interactive electronics, microcontrollers, and wiring diagrams with Arduino C++ or MicroPython.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('tutorials')}
                    className="px-3 py-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Tutorials</span>
                  </button>

                  <button
                    onClick={handleCreateNewCircuit}
                    className="bg-[#0084FF] hover:bg-[#0070E0] active:bg-[#005DBF] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Create new Circuit</span>
                  </button>
                </div>
              </div>

              {/* Tinkercad Video Learning Callout Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1B2733] to-[#162330] border border-[#2C3E50] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0084FF] to-cyan-400 p-0.5 shrink-0 flex items-center justify-center shadow-md">
                    <div className="w-full h-full bg-[#101726] rounded-xl flex items-center justify-center">
                      <Play className="w-5 h-5 text-cyan-300 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#0084FF] text-white font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                        Official Videos
                      </span>
                      <span className="text-xs text-slate-400 font-medium">7 Masterclasses Available</span>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-0.5">
                      New to Sun Academy Circuits? Watch video guides & start building!
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveVideoTutorial(TUTORIAL_VIDEOS[0])}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Getting Started (5:24)</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('tutorials')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    All Videos
                  </button>
                </div>
              </div>

              {/* Sub-Tabs & Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Segmented Category Filter Tabs */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs">
                  {(['All', 'Circuits', 'Starters', 'Codeblocks'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        selectedTab === tab
                          ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Right: Search, Sort & View Switches */}
                <div className="flex items-center gap-3 ml-auto">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your circuits..."
                      className="pl-8 pr-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0084FF] w-48 lg:w-56"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="hidden sm:inline">Order by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:border-[#0084FF]"
                    >
                      <option value="modified">Last modified</option>
                      <option value="name">Title (A-Z)</option>
                      <option value="difficulty">Difficulty</option>
                    </select>
                  </div>

                  {/* Grid / List View Toggle */}
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-0.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                      title="List view"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tinkercad Grid of Cards */}
              {filteredCircuits.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2'
                      : 'space-y-3 pt-2'
                  }
                >
                  {filteredCircuits.map((circ) => (
                    <TinkercadCircuitCard
                      key={circ.id}
                      circuit={circ}
                      onTinker={(c) => setActiveEditingCircuit(c)}
                      onDuplicate={handleDuplicateCircuit}
                      onDelete={handleDeleteCircuit}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    🔍
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">No circuits found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Try clearing your search query or creating a new circuit design.
                  </p>
                  <button
                    onClick={handleCreateNewCircuit}
                    className="bg-[#0084FF] text-white px-4 py-2 rounded-md font-bold text-xs uppercase"
                  >
                    + Create New Circuit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: TUTORIALS & LESSONS */}
          {currentView === 'tutorials' && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Video className="w-6 h-6 text-[#0084FF]" />
                    <span>Sun Academy Video Learning Center & Arduino Masterclasses</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Step-by-step video tutorials, wiring guides, microcontrollers, 3D design, and interactive coding.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveVideoTutorial(TUTORIAL_VIDEOS[0])}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Getting Started (5:24)</span>
                  </button>
                </div>
              </div>

              {/* SECTION A: Video Masterclasses Grid */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Categories:
                    </span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                      {(['All', 'Circuits', 'Arduino', '3D Design', 'MicroPython', 'Codeblocks'] as const).map(
                        (cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedVideoCategory(cat)}
                            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                              selectedVideoCategory === cat
                                ? 'bg-[#0084FF] text-white font-bold shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    7 Interactive Masterclasses Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TUTORIAL_VIDEOS.filter(
                    (tut) =>
                      selectedVideoCategory === 'All' ||
                      tut.category.toLowerCase().includes(selectedVideoCategory.toLowerCase())
                  ).map((tut) => (
                    <div
                      key={tut.id}
                      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#0084FF]"
                    >
                      <div>
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video bg-black overflow-hidden group">
                          <img
                            src={tut.thumbnailUrl}
                            alt={tut.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                            <button
                              onClick={() => setActiveVideoTutorial(tut)}
                              className="w-12 h-12 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-2xl scale-95 group-hover:scale-110 transition-transform cursor-pointer"
                              title="Play Video"
                            >
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-white font-mono text-[10px] font-bold shadow">
                            {tut.duration}
                          </span>
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0084FF] text-white text-[10px] font-bold shadow">
                            {tut.category}
                          </span>
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-bold border border-amber-400/40">
                            {tut.level}
                          </span>
                        </div>

                        {/* Video Info */}
                        <div className="p-4 space-y-2">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-snug group-hover:text-[#0084FF] transition-colors">
                            {tut.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {tut.description}
                          </p>

                          {/* Key topics pills */}
                          <div className="pt-1 flex flex-wrap gap-1">
                            {tut.topics.slice(0, 2).map((tp, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                              >
                                {tp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                        <button
                          onClick={() => setActiveVideoTutorial(tut)}
                          className="flex-1 py-2 rounded-lg bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Video</span>
                        </button>

                        {tut.circuitStarterId && (
                          <button
                            onClick={() => {
                              const starter = CIRCUIT_STARTERS.find((s) => s.id === tut.circuitStarterId);
                              if (starter) {
                                const newCircuit: CircuitDesign = {
                                  id: `circuit-${Date.now()}`,
                                  slug: `starter-${starter.id}-${Date.now()}`,
                                  title: starter.name,
                                  category: 'Circuits',
                                  lastEdited: 'Just now',
                                  isPublic: true,
                                  difficulty: 'Beginner',
                                  componentsCount: starter.components.length,
                                  simulationType: 'led',
                                  description: starter.description,
                                  parts: starter.components.map((c) => ({
                                    name: c.name,
                                    quantity: 1,
                                    role: 'Electronic Component'
                                  })),
                                  wiringSteps: [],
                                  codeLanguage: starter.codeLanguage,
                                  code: starter.code,
                                  troubleshootingTips: [],
                                  placedComponents: starter.components,
                                  placedWires: starter.wires
                                };
                                setActiveEditingCircuit(newCircuit);
                              }
                            }}
                            className="py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Tinker with starter circuit in CAD Workbench"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Tinker Circuit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: Interactive Course Tracks */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <span>Curriculum Lessons & Course Tracks</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive structured syllabus with quizzes, assignments, and guided workbench sessions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COURSES.map((course) => {
                    const lessonIds = course.lessons.map((l) => l.id);
                    const completionPercent = getCourseCompletionPercentage(lessonIds);
                    const completedCount = lessonIds.filter((id) =>
                      progress.completedLessons.includes(id)
                    ).length;
                    const matchingCirc =
                      circuits.find((c) => c.slug === course.slug || c.simulationType === 'led') ||
                      circuits[0];

                    return (
                      <div
                        key={course.id}
                        onClick={() => navigate(`/courses/${course.slug}`)}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-[#0084FF]"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-amber-600 mb-2">
                            <span className="uppercase tracking-wider">{course.trackId}</span>
                            <span className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-mono text-[11px]">
                              {course.level}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-slate-800 dark:text-white group-hover:text-[#0084FF] transition-colors leading-snug">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {/* Progress and Action Footer */}
                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-500 dark:text-slate-400">
                                {completedCount > 0 ? (
                                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {completedCount}/{course.lessonCount} Lessons
                                  </span>
                                ) : (
                                  `${course.lessonCount} Lessons`
                                )}
                              </span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">
                                {completionPercent}%
                              </span>
                            </div>
                            <ProgressBar
                              progress={completionPercent}
                              size="sm"
                              variant={completionPercent === 100 ? 'emerald' : 'cyan'}
                              showLabel={false}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-semibold text-[#0084FF] flex items-center gap-1 group-hover:underline">
                              {completionPercent > 0 ? 'Continue Lesson' : 'Start Track'}
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveEditingCircuit(matchingCirc);
                              }}
                              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-2.5 py-1 rounded transition-colors cursor-pointer"
                              title="Open in Tinkercad Circuit Workbench"
                            >
                              Workbench
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: CODEBLOCKS */}
          {currentView === 'codeblocks' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Code2 className="w-6 h-6 text-emerald-500" />
                    <span>Codeblocks</span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Computational 3D design using visual programming blocks, loops, math, and MicroPython.
                  </p>
                </div>

                <button
                  onClick={() => setActiveCodeblock(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create new Codeblock</span>
                </button>
              </div>

              {/* Codeblock Projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveCodeblock(true)}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-500 transition-all cursor-pointer group hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                        🚀
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                          Procedural Rocket Generator
                        </h3>
                        <span className="text-[11px] text-slate-400">7 Code Blocks • 3D Primitive Loop</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Parametric cylindrical fuselage with nose cone and 4-way radial symmetry fins generated using repeat loops.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">
                      Open Codeblock
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">Visual Blocks</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveCodeblock(true)}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-500 transition-all cursor-pointer group hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-sky-500 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                        ❄️
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                          Parametric Snowflake Algorithm
                        </h3>
                        <span className="text-[11px] text-slate-400">12 Code Blocks • Hexagonal Math</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Mathematical 6-fold rotational symmetry generator creating crystalline fractal structures.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">
                      Open Codeblock
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">Visual Blocks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: CLASSROOMS */}
          {currentView === 'classes' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                  <span>My Classrooms</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Classrooms, teacher assignments, and shared student lab spaces.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto text-2xl font-bold">
                  🎓
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Join a sunAcademy Classroom
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Enter your teacher's class code to access course assignments, hardware starter kits, and peer projects.
                </p>
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <input
                    type="text"
                    placeholder="Enter Class Code"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md text-xs font-mono font-bold uppercase w-48 text-center focus:border-[#0084FF] focus:outline-none"
                  />
                  <button className="bg-[#0084FF] text-white px-4 py-2 rounded-md font-bold text-xs uppercase cursor-pointer">
                    Join
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: FAVORITES */}
          {currentView === 'favorites' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Favorites & Starred Circuits</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your bookmarked hardware designs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {circuits.slice(0, 2).map((circ) => (
                  <TinkercadCircuitCard
                    key={circ.id}
                    circuit={circ}
                    onTinker={(c) => setActiveEditingCircuit(c)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Auth & Profile Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {currentUser && (
        <ProfileModal
          isOpen={profileModalOpen}
          user={currentUser}
          onClose={() => setProfileModalOpen(false)}
          onUpdate={(updated) => {
            setCurrentUser(updated);
          }}
          onSignOut={() => {
            setCurrentUser(null);
          }}
        />
      )}

      {/* Tutorial Video Player Modal */}
      {activeVideoTutorial && (
        <TutorialVideoPlayerModal
          tutorial={activeVideoTutorial}
          onClose={() => setActiveVideoTutorial(null)}
          onTinkerCircuit={(circuitStarterId) => {
            setActiveVideoTutorial(null);
            if (circuitStarterId) {
              const starter = CIRCUIT_STARTERS.find((s) => s.id === circuitStarterId);
              if (starter) {
                const newCircuit: CircuitDesign = {
                  id: `circuit-${Date.now()}`,
                  slug: `starter-${starter.id}-${Date.now()}`,
                  title: starter.name,
                  category: 'Circuits',
                  lastEdited: 'Just now',
                  isPublic: true,
                  difficulty: 'Beginner',
                  componentsCount: starter.components.length,
                  simulationType: 'led',
                  description: starter.description,
                  parts: starter.components.map((c) => ({
                    name: c.name,
                    quantity: 1,
                    role: 'Electronic Component'
                  })),
                  wiringSteps: [],
                  codeLanguage: starter.codeLanguage,
                  code: starter.code,
                  troubleshootingTips: [],
                  placedComponents: starter.components,
                  placedWires: starter.wires
                };
                setActiveEditingCircuit(newCircuit);
              }
            }
          }}
        />
      )}
    </div>
  );
};
