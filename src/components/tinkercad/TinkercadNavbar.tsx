import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { UserProfile } from '../../types/builder';
import {
  Search,
  Bell,
  Plus,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Cpu,
  Code2,
  BookOpen,
  Sun,
  Moon,
  User,
  LogOut,
  MapPin,
  Phone,
  Box
} from 'lucide-react';

interface TinkercadNavbarProps {
  onCreateCircuit: () => void;
  onCreate3D?: () => void;
  onCreateCodeblock?: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onSignOut: () => void;
}

export const TinkercadNavbar: React.FC<TinkercadNavbarProps> = ({
  onCreateCircuit,
  onCreate3D,
  onCreateCodeblock,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onSignOut
}) => {
  const { currentPath, navigate } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1B2733] text-white border-b border-[#2C3E50] shadow-sm select-none">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-6">
            {/* Sun Academy Brand Logo */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Sun Academy Circuits Dashboard"
            >
              <div className="grid grid-cols-2 gap-0.5 w-7 h-7 p-1 bg-amber-500/20 rounded-md group-hover:scale-105 transition-transform shadow-xs border border-amber-500/40">
                <div className="bg-[#0084FF] rounded-xs" />
                <div className="bg-[#F59E0B] rounded-xs" />
                <div className="bg-[#10B981] rounded-xs" />
                <div className="bg-[#EF4444] rounded-xs" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1">
                  SUN<span className="text-[#0084FF]">ACADEMY</span>
                </span>
                <span className="text-[9px] font-bold text-amber-400 tracking-wider">
                  CIRCUITS & ROBOTICS
                </span>
              </div>
            </div>

            {/* Desktop Top Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <button
                onClick={() => navigate('/3d-designs')}
                className={`px-3 py-2 rounded hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  currentPath.startsWith('/3d-designs')
                    ? 'text-white border-b-2 border-[#0084FF]'
                    : ''
                }`}
              >
                3D Designs
              </button>
              <button
                onClick={() => navigate('/circuits')}
                className={`px-3 py-2 rounded hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  currentPath === '/' || currentPath.startsWith('/circuits')
                    ? 'text-white border-b-2 border-[#0084FF]'
                    : ''
                }`}
              >
                Circuits
              </button>
              <button
                onClick={() => navigate('/codeblocks')}
                className={`px-3 py-2 rounded hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  currentPath.startsWith('/codeblocks')
                    ? 'text-white border-b-2 border-[#0084FF]'
                    : ''
                }`}
              >
                Codeblocks
              </button>
              <button
                onClick={() => navigate('/tutorials')}
                className={`px-3 py-2 rounded hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  currentPath.startsWith('/tutorials') || currentPath.startsWith('/courses')
                    ? 'text-white border-b-2 border-[#0084FF]'
                    : ''
                }`}
              >
                Tutorials
              </button>
              <button
                onClick={() => navigate('/classes')}
                className={`px-3 py-2 rounded hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
                  currentPath.startsWith('/classes')
                    ? 'text-white border-b-2 border-[#0084FF]'
                    : ''
                }`}
              >
                Classrooms
              </button>
            </nav>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 3D designs, circuits, and tutorials..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#111922] text-xs text-white placeholder-slate-400 border border-[#2C3E50] focus:outline-none focus:border-[#0084FF] focus:bg-[#0B1017] transition-all"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Large Blue "+ Create" button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                className="flex items-center gap-2 bg-[#0084FF] hover:bg-[#0070E0] active:bg-[#005DBF] text-white px-3.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Create</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {createDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in-50"
                  onMouseLeave={() => setCreateDropdownOpen(false)}
                >
                  {/* Option 1: 3D Design */}
                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      onCreate3D ? onCreate3D() : navigate('/3d-designs');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#0084FF] flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">3D Design</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        Create solid shapes & 3D models
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Circuit */}
                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      onCreateCircuit();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#0084FF] flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Circuit</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        Simulate Arduino & electronics
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Codeblock */}
                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      onCreateCodeblock ? onCreateCodeblock() : navigate('/codeblocks');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#0084FF] flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0084FF]">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Codeblock</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        Computational block coding
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Sign In Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 border-l border-slate-700 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white/20">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in-50 text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {currentUser.phone}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer font-semibold"
                    >
                      <User className="w-4 h-4 text-[#0084FF]" />
                      <span>Edit Profile & Address</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-800 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
