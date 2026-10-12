import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Play,
  Square,
  RotateCw,
  Plus,
  Trash2,
  Code2,
  Box,
  Layers,
  Sparkles,
  Download,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

interface CodeblockItem {
  id: string;
  category: 'shape' | 'modify' | 'control' | 'color';
  text: string;
  params: Record<string, any>;
  color: string;
}

interface TinkercadCodeblocksBuilderProps {
  onBack: () => void;
  title?: string;
}

const DEFAULT_BLOCKS: CodeblockItem[] = [
  {
    id: 'block-1',
    category: 'shape',
    text: 'Create New Object [Rocket Base]',
    params: { name: 'Rocket Base' },
    color: '#0284C7'
  },
  {
    id: 'block-2',
    category: 'shape',
    text: 'Add Cylinder: Radius [12], Height [35]',
    params: { radius: 12, height: 35 },
    color: '#0284C7'
  },
  {
    id: 'block-3',
    category: 'color',
    text: 'Set Color to [Orange]',
    params: { color: '#F97316' },
    color: '#D97706'
  },
  {
    id: 'block-4',
    category: 'modify',
    text: 'Move Z by [17.5 mm]',
    params: { z: 17.5 },
    color: '#059669'
  },
  {
    id: 'block-5',
    category: 'shape',
    text: 'Add Cone: Top Radius [0], Bottom [12], Height [20]',
    params: { topR: 0, bottomR: 12, height: 20 },
    color: '#0284C7'
  },
  {
    id: 'block-6',
    category: 'modify',
    text: 'Move Z by [45 mm]',
    params: { z: 45 },
    color: '#059669'
  },
  {
    id: 'block-7',
    category: 'control',
    text: 'Repeat [4] times: Add Fin & Rotate Z by [90 deg]',
    params: { count: 4, rotZ: 90 },
    color: '#7C3AED'
  }
];

export const TinkercadCodeblocksBuilder: React.FC<TinkercadCodeblocksBuilderProps> = ({
  onBack,
  title = 'Procedural Rocket Codeblocks'
}) => {
  const { theme, toggleTheme } = useTheme();
  const [blocks, setBlocks] = useState<CodeblockItem[]>(DEFAULT_BLOCKS);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [previewProgress, setPreviewProgress] = useState(100);

  // Run codeblocks animation
  const handleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      setActiveStep(-1);
      return;
    }

    setIsRunning(true);
    setActiveStep(0);
    setPreviewProgress(10);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < blocks.length) {
        setActiveStep(step);
        setPreviewProgress(Math.round(((step + 1) / blocks.length) * 100));
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setActiveStep(-1);
        setPreviewProgress(100);
      }
    }, 700);
  };

  const handleAddBlock = (category: CodeblockItem['category'], text: string, color: string) => {
    const newBlock: CodeblockItem = {
      id: `block-${Date.now()}`,
      category,
      text,
      params: {},
      color
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors ${
        theme === 'dark' ? 'bg-[#0E131E] text-slate-100' : 'bg-[#E5E9F0] text-slate-800'
      }`}
    >
      {/* 1. Header Toolbar */}
      <header className="h-14 bg-[#1B2733] border-b border-[#2C3E50] px-4 flex items-center justify-between gap-3 shrink-0 shadow-md z-40 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-5 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-white truncate">{title}</span>
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono font-bold">
              CODEBLOCKS
            </span>
          </div>
        </div>

        {/* Center: Run Execution Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            className={`px-4 py-1.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-[#00A651] hover:bg-[#008F45] text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Codeblocks</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Main Workspace: Left Block Shelf, Middle Scripts Canvas, Right 3D Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Block Shelf / Tool Palette */}
        <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 p-3 overflow-y-auto space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Block Library
          </div>

          {/* Shapes */}
          <div>
            <span className="text-[10px] font-bold text-sky-600 uppercase block mb-1.5">Shapes</span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleAddBlock('shape', 'Add Box [W: 20, L: 20, H: 20]', '#0284C7')}
                className="w-full text-left p-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Add Box
              </button>
              <button
                onClick={() => handleAddBlock('shape', 'Add Cylinder [R: 10, H: 25]', '#0284C7')}
                className="w-full text-left p-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Add Cylinder
              </button>
              <button
                onClick={() => handleAddBlock('shape', 'Add Sphere [Radius: 15]', '#0284C7')}
                className="w-full text-left p-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Add Sphere
              </button>
            </div>
          </div>

          {/* Modify */}
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1.5">Modify</span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleAddBlock('modify', 'Move: X [0], Y [0], Z [10]', '#059669')}
                className="w-full text-left p-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Move X/Y/Z
              </button>
              <button
                onClick={() => handleAddBlock('modify', 'Rotate Around Axis [Z] by [45 deg]', '#059669')}
                className="w-full text-left p-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Rotate
              </button>
              <button
                onClick={() => handleAddBlock('modify', 'Scale: X [1.5], Y [1.5], Z [1.5]', '#059669')}
                className="w-full text-left p-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Scale
              </button>
            </div>
          </div>

          {/* Control & Math */}
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase block mb-1.5">Control</span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleAddBlock('control', 'Repeat [3] times', '#7C3AED')}
                className="w-full text-left p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Repeat Loop
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Block Scripts Canvas (Stacked Visual Blocks) */}
        <div className="flex-1 bg-slate-100 dark:bg-[#0B0F19] p-6 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
              <span>ACTIVE CODEBLOCK SCRIPT:</span>
              <span>{blocks.length} Blocks</span>
            </div>

            {blocks.map((b, idx) => {
              const isActive = activeStep === idx;

              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-lg text-white font-mono text-xs font-bold flex items-center justify-between shadow-md transition-all ${
                    isActive ? 'scale-105 ring-4 ring-amber-400 shadow-2xl' : ''
                  }`}
                  style={{ backgroundColor: b.color }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{b.text}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteBlock(b.id)}
                    className="p-1 rounded hover:bg-black/20 text-white/80 hover:text-white cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live 3D Procedural Result Preview */}
        <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Generated 3D Output
          </div>

          <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col items-center justify-center relative overflow-hidden text-center">
            {/* Visual 3D Rocket Preview Wireframe / Silhouette */}
            <div className="space-y-1 my-auto flex flex-col items-center">
              {/* Cone nose */}
              <div
                className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-amber-400 transition-all duration-300"
                style={{ opacity: previewProgress > 60 ? 1 : 0.2 }}
              />
              {/* Main Body */}
              <div
                className="w-16 h-28 bg-[#F97316] rounded-t-sm rounded-b-md flex items-center justify-center text-[10px] font-mono text-white font-bold transition-all duration-300"
                style={{ opacity: previewProgress > 30 ? 1 : 0.2 }}
              >
                FUSELAGE
              </div>
              {/* Thruster fins */}
              <div
                className="w-24 h-6 bg-slate-700 rounded-sm flex items-center justify-around text-[8px] text-white transition-all duration-300"
                style={{ opacity: previewProgress > 80 ? 1 : 0.2 }}
              >
                <span>FIN</span>
                <span>THRUSTER</span>
                <span>FIN</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-auto">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${previewProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2">
              Construction: {previewProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
