import React from 'react';
import { UserProfile } from '../../types/builder';
import {
  Box,
  Cpu,
  Code2,
  BookOpen,
  GraduationCap,
  FolderHeart,
  Folder,
  Trash2,
  Settings,
  Star,
  Sparkles,
  User,
  MapPin
} from 'lucide-react';

export type DashboardViewType = '3d-designs' | 'circuits' | 'tutorials' | 'codeblocks' | 'classes' | 'favorites';

interface TinkercadSidebarProps {
  currentView: DashboardViewType;
  onSelectView: (view: DashboardViewType) => void;
  circuitsCount: number;
  currentUser: UserProfile | null;
  onOpenProfile: () => void;
}

export const TinkercadSidebar: React.FC<TinkercadSidebarProps> = ({
  currentView,
  onSelectView,
  circuitsCount,
  currentUser,
  onOpenProfile
}) => {
  return (
    <aside className="w-64 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none py-4 px-3 min-h-[calc(100vh-56px)] transition-colors">
      {/* User Mini Profile Card */}
      {currentUser ? (
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-[#0084FF] transition-all group"
          title="Click to view delivery address & profile"
        >
          <div className="w-10 h-10 rounded-full bg-[#0084FF] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>{currentUser.role}</span>
              <span>•</span>
              <span className="truncate">{currentUser.address?.city || 'SF'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 px-3 py-2 mb-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-[#0084FF] font-bold cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Sign In / Create Account</span>
        </div>
      )}

      {/* Section 1: Designs */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Designs
        </div>

        <nav className="space-y-1">
          {/* 3D Designs */}
          <button
            onClick={() => onSelectView('3d-designs')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              currentView === '3d-designs'
                ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Box className="w-4 h-4 text-amber-500" />
              <span>3D Designs</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600">
              3
            </span>
          </button>

          {/* Circuits */}
          <button
            onClick={() => onSelectView('circuits')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'circuits'
                ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-[#0084FF]" />
              <span>Circuits</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0084FF]">
              {circuitsCount}
            </span>
          </button>

          {/* Codeblocks */}
          <button
            onClick={() => onSelectView('codeblocks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'codeblocks'
                ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <span>Codeblocks</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">1</span>
          </button>

          {/* Lessons & Tutorials */}
          <button
            onClick={() => onSelectView('tutorials')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'tutorials'
                ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#F5A623]" />
              <span>Lessons & Tutorials</span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950">
              8
            </span>
          </button>
        </nav>
      </div>

      {/* Section 2: Classes */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Classes
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => onSelectView('classes')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'classes'
                ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>My Classrooms</span>
          </button>
        </nav>
      </div>

      {/* Section 3: Collections */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Collections
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => onSelectView('favorites')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'favorites'
                ? 'bg-[#EBF5FF] dark:bg-blue-950/40 text-[#0084FF] font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Favorites</span>
          </button>

          <button
            onClick={() => onSelectView('circuits')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4 text-blue-500" />
            <span>Arduino Starter Kits</span>
          </button>

          <button
            onClick={() => onSelectView('circuits')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FolderHeart className="w-4 h-4 text-rose-500" />
            <span>Sensors & Robotics</span>
          </button>
        </nav>
      </div>

      {/* Bottom Workbench Info */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-xs">
          <div className="font-bold text-[#0084FF] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Lab
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
            Drag components, connect wires, and run live Arduino & Python simulations.
          </p>
        </div>
      </div>
    </aside>
  );
};
