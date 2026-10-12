import React, { useState, useRef, useEffect } from 'react';
import { Shape3D } from '../../types/builder';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Box,
  Layers,
  RotateCw,
  Trash2,
  CopyPlus,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Eye,
  Sliders,
  Sparkles,
  X,
  Sun,
  Moon,
  Plus
} from 'lucide-react';

interface Tinkercad3DBuilderProps {
  onBack: () => void;
  designTitle?: string;
}

const DEFAULT_SHAPES: Shape3D[] = [
  {
    id: 'shape-box-1',
    name: 'Red Box',
    type: 'box',
    x: 0,
    y: 0,
    z: 10,
    width: 30,
    length: 30,
    height: 20,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    color: '#EF4444',
    isHole: false
  },
  {
    id: 'shape-cylinder-1',
    name: 'Orange Cylinder',
    type: 'cylinder',
    x: 45,
    y: -15,
    z: 15,
    width: 25,
    length: 25,
    height: 30,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    color: '#F97316',
    isHole: false
  },
  {
    id: 'shape-roof-1',
    name: 'Green Roof',
    type: 'roof',
    x: -40,
    y: 10,
    z: 12,
    width: 28,
    length: 28,
    height: 24,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    color: '#10B981',
    isHole: false
  }
];

const BASIC_SHAPES_CATALOG = [
  { type: 'box', name: 'Box', color: '#EF4444', icon: '■', desc: 'Standard rectangular prism' },
  { type: 'cylinder', name: 'Cylinder', color: '#F97316', icon: '⬬', desc: 'Circular extrusion column' },
  { type: 'sphere', name: 'Sphere', color: '#3B82F6', icon: '●', desc: 'Symmetrical 3D globe' },
  { type: 'roof', name: 'Roof', color: '#10B981', icon: '▲', desc: 'Triangular roof prism' },
  { type: 'cone', name: 'Cone', color: '#EAB308', icon: '▲', desc: 'Tapered circular cone' },
  { type: 'pyramid', name: 'Pyramid', color: '#8B5CF6', icon: '▲', desc: 'Square 4-sided pyramid' },
  { type: 'wedge', name: 'Wedge', color: '#06B6D4', icon: '◢', desc: 'Right-angled ramp' },
  { type: 'tube', name: 'Tube', color: '#EC4899', icon: '◎', desc: 'Hollow cylinder ring' }
] as const;

export const Tinkercad3DBuilder: React.FC<Tinkercad3DBuilderProps> = ({
  onBack,
  designTitle = 'Amazing Tinkercad 3D Model'
}) => {
  const { theme, toggleTheme } = useTheme();
  const [title, setTitle] = useState(designTitle);
  const [shapes, setShapes] = useState<Shape3D[]>(DEFAULT_SHAPES);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(shapes[0].id);
  const [shapesTrayOpen, setShapesTrayOpen] = useState(true);

  // 3D Camera Angles (Isometric Workplane)
  const [cameraRotX, setCameraRotX] = useState(60); // deg
  const [cameraRotZ, setCameraRotZ] = useState(-35); // deg
  const [zoomScale, setZoomScale] = useState(1.1);

  // Dragging camera to orbit
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitStart, setOrbitStart] = useState<{ x: number; y: number } | null>(null);

  // Dragging 3D shapes across workplane
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const [shapeDragStart, setShapeDragStart] = useState<{
    mouseX: number;
    mouseY: number;
    shapeX: number;
    shapeY: number;
  } | null>(null);

  // Export Modal
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const selectedShape = shapes.find((s) => s.id === selectedShapeId);

  // Window-level mouse listener for smooth 3D shape dragging
  useEffect(() => {
    if (!isDraggingShape || !shapeDragStart || !selectedShapeId) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - shapeDragStart.mouseX) / zoomScale;
      const dy = (e.clientY - shapeDragStart.mouseY) / zoomScale;

      const radZ = (cameraRotZ * Math.PI) / 180;
      const worldDX = dx * Math.cos(-radZ) - dy * Math.sin(-radZ);
      const worldDY = dx * Math.sin(-radZ) + dy * Math.cos(-radZ);

      const newX = Math.round(shapeDragStart.shapeX + worldDX * 0.4);
      const newY = Math.round(shapeDragStart.shapeY + worldDY * 0.4);

      setShapes((prev) =>
        prev.map((s) => (s.id === selectedShapeId ? { ...s, x: newX, y: newY } : s))
      );
    };

    const handleWindowMouseUp = () => {
      setIsDraggingShape(false);
      setShapeDragStart(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDraggingShape, shapeDragStart, selectedShapeId, zoomScale, cameraRotZ]);

  // Keyboard shortcuts for 3D navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!selectedShapeId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteShape();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        handleDuplicateShape();
      } else if (e.key === 'r' || e.key === 'R') {
        setShapes((prev) =>
          prev.map((s) => (s.id === selectedShapeId ? { ...s, rotationZ: (s.rotationZ + 45) % 360 } : s))
        );
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 2;

        setShapes((prev) =>
          prev.map((s) => {
            if (s.id !== selectedShapeId) return s;
            if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
              // Elevate along Z
              return { ...s, z: Math.max(0, s.z + (e.key === 'ArrowUp' ? step : -step)) };
            }
            if (e.key === 'ArrowLeft') return { ...s, x: s.x - step };
            if (e.key === 'ArrowRight') return { ...s, x: s.x + step };
            if (e.key === 'ArrowUp') return { ...s, y: s.y - step };
            if (e.key === 'ArrowDown') return { ...s, y: s.y + step };
            return s;
          })
        );
      } else if (e.key === 'Escape') {
        setSelectedShapeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, shapes]);

  // Orbit camera on mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only orbit if clicking canvas background
    if ((e.target as HTMLElement).closest('.shape-3d-element')) return;
    setIsOrbiting(true);
    setOrbitStart({ x: e.clientX, y: e.clientY });
  };

  const handleShapeMouseDown = (e: React.MouseEvent, shape: Shape3D) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedShapeId(shape.id);
    setIsDraggingShape(true);
    setShapeDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      shapeX: shape.x,
      shapeY: shape.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOrbiting || !orbitStart) return;
    const dx = e.clientX - orbitStart.x;
    const dy = e.clientY - orbitStart.y;

    setCameraRotZ((prev) => (prev + dx * 0.4) % 360);
    setCameraRotX((prev) => Math.max(15, Math.min(85, prev - dy * 0.3)));
    setOrbitStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsOrbiting(false);
    setOrbitStart(null);
  };

  // Add new shape to workplane
  const handleAddShape = (type: Shape3D['type'], color: string, name: string) => {
    const newShape: Shape3D = {
      id: `shape-${type}-${Date.now()}`,
      name: `${name} ${shapes.length + 1}`,
      type,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      z: 10,
      width: 25,
      length: 25,
      height: 20,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      color,
      isHole: false
    };
    setShapes([...shapes, newShape]);
    setSelectedShapeId(newShape.id);
  };

  // Delete selected
  const handleDeleteShape = () => {
    if (!selectedShapeId) return;
    setShapes(shapes.filter((s) => s.id !== selectedShapeId));
    setSelectedShapeId(null);
  };

  // Duplicate selected
  const handleDuplicateShape = () => {
    if (!selectedShape) return;
    const dup: Shape3D = {
      ...selectedShape,
      id: `shape-${selectedShape.type}-${Date.now()}`,
      name: `${selectedShape.name} (Copy)`,
      x: selectedShape.x + 15,
      y: selectedShape.y + 15
    };
    setShapes([...shapes, dup]);
    setSelectedShapeId(dup.id);
  };

  // Preset Camera views (ViewCube)
  const setView = (view: 'top' | 'front' | 'right' | 'iso') => {
    switch (view) {
      case 'top':
        setCameraRotX(85);
        setCameraRotZ(0);
        break;
      case 'front':
        setCameraRotX(20);
        setCameraRotZ(0);
        break;
      case 'right':
        setCameraRotX(20);
        setCameraRotZ(-90);
        break;
      case 'iso':
        setCameraRotX(60);
        setCameraRotZ(-35);
        break;
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors ${
        theme === 'dark' ? 'bg-[#0E131E] text-slate-100' : 'bg-[#E5E9F0] text-slate-800'
      }`}
    >
      {/* 1. Header Toolbar */}
      <header className="h-14 bg-[#1B2733] border-b border-[#2C3E50] px-4 flex items-center justify-between gap-3 shrink-0 shadow-md z-40 text-white">
        {/* Left: Back & Title */}
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
            <span className="text-xs sm:text-sm font-bold text-white max-w-[200px] truncate">
              {title}
            </span>
            <span className="text-[10px] bg-[#0084FF] text-white px-1.5 py-0.5 rounded font-mono font-bold">
              3D DESIGN
            </span>
          </div>
        </div>

        {/* Center: Tools (Rotate, Duplicate, Delete) */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleDuplicateShape}
            disabled={!selectedShapeId}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              selectedShapeId ? 'hover:bg-white/10 text-white' : 'text-slate-500 opacity-50'
            }`}
            title="Duplicate Shape"
          >
            <CopyPlus className="w-4 h-4" />
          </button>

          <button
            onClick={handleDeleteShape}
            disabled={!selectedShapeId}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              selectedShapeId ? 'hover:bg-red-500/20 text-red-400' : 'text-slate-500 opacity-50'
            }`}
            title="Delete Shape"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Export, Theme, Shapes toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExportModalOpen(true)}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export 3D</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShapesTrayOpen(!shapesTrayOpen)}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              shapesTrayOpen
                ? 'bg-[#0084FF] text-white border-[#0084FF]'
                : 'bg-white/10 text-slate-300 border-white/20'
            }`}
            title="3D Shapes Tray"
          >
            <Box className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main 3D Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Surface with 3D CSS Transform */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`flex-1 relative overflow-hidden flex items-center justify-center select-none ${
            isOrbiting ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            perspective: '1200px',
            backgroundColor: theme === 'dark' ? '#090D16' : '#DCE2EC'
          }}
        >
          {/* Tinkercad ViewCube in Top-Left */}
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xl p-1 flex flex-col justify-between text-[9px] font-bold text-slate-700 dark:text-slate-200 text-center select-none">
              <button
                onClick={() => setView('top')}
                className="py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-[#0084FF] hover:text-white cursor-pointer"
              >
                TOP
              </button>
              <div className="flex justify-between gap-1">
                <button
                  onClick={() => setView('front')}
                  className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-[#0084FF] hover:text-white cursor-pointer"
                >
                  FRONT
                </button>
                <button
                  onClick={() => setView('right')}
                  className="flex-1 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-[#0084FF] hover:text-white cursor-pointer"
                >
                  RIGHT
                </button>
              </div>
              <button
                onClick={() => setView('iso')}
                className="py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0084FF] hover:bg-[#0084FF] hover:text-white cursor-pointer"
              >
                ISOMETRIC
              </button>
            </div>

            <div className="text-[10px] text-slate-400 font-medium px-1">
              Drag background to orbit
            </div>
          </div>

          {/* Zoom Buttons in Bottom-Left */}
          <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-lg">
            <button
              onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.15))}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.max(0.4, z - 0.15))}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale(1.1)}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-[10px] font-bold cursor-pointer"
              title="Reset View"
            >
              FIT
            </button>
          </div>

          {/* 3D Workplane Plane (Transforms in 3D Space) */}
          <div
            className="relative w-[500px] h-[500px] transition-transform duration-75 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `scale(${zoomScale}) rotateX(${cameraRotX}deg) rotateZ(${cameraRotZ}deg)`
            }}
          >
            {/* Workplane Grid Surface */}
            <div
              className="absolute inset-0 rounded-lg shadow-2xl border-2 border-[#0084FF]/40"
              style={{
                backgroundImage:
                  theme === 'dark'
                    ? 'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)'
                    : 'linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)',
                backgroundSize: '25px 25px',
                backgroundColor: theme === 'dark' ? '#0F172A' : '#F1F5F9'
              }}
            >
              {/* Millimeter Center Ruler Markings */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#0084FF]/40" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#0084FF]/40" />
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 font-bold">
                WORKPLANE (mm)
              </div>
            </div>

            {/* Render 3D Shapes on Workplane */}
            {shapes.map((shape) => {
              const isSelected = selectedShapeId === shape.id;

              // Screen coordinates translated to center of 500x500 workplane
              const screenX = 250 + shape.x * 3;
              const screenY = 250 + shape.y * 3;

              return (
                <div
                  key={shape.id}
                  onMouseDown={(e) => handleShapeMouseDown(e, shape)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedShapeId(shape.id);
                  }}
                  className={`shape-3d-element absolute cursor-grab active:cursor-grabbing transition-shadow ${
                    isSelected ? 'ring-2 ring-[#0084FF] shadow-2xl' : 'hover:ring-1 hover:ring-white/40'
                  }`}
                  style={{
                    left: `${screenX}px`,
                    top: `${screenY}px`,
                    width: `${shape.width * 2.5}px`,
                    height: `${shape.length * 2.5}px`,
                    transformStyle: 'preserve-3d',
                    transform: `translate(-50%, -50%) translateZ(${shape.z * 1.5}px) rotateZ(${shape.rotationZ}deg)`
                  }}
                >
                  {/* Floating 3D coordinate tooltip while dragging */}
                  {isDraggingShape && selectedShapeId === shape.id && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 px-2 py-0.5 rounded bg-slate-900/95 text-white text-[9px] font-mono shadow-md border border-[#0084FF] whitespace-nowrap pointer-events-none flex items-center gap-1.5">
                      <span>X: {shape.x}</span>
                      <span>Y: {shape.y}</span>
                      <span>Z: {shape.z}</span>
                    </div>
                  )}

                  {/* Visual 3D Shape Facet (Isometric Mock) */}
                  <div
                    className={`w-full h-full rounded shadow-lg flex items-center justify-center font-bold text-xs text-white border transition-all ${
                      shape.isHole
                        ? 'bg-slate-400/40 border-slate-500 border-dashed backdrop-blur-xs'
                        : 'border-white/20'
                    }`}
                    style={{
                      backgroundColor: shape.isHole ? undefined : shape.color,
                      transform: 'translateZ(10px)'
                    }}
                  >
                    <span className="drop-shadow-md">{shape.type.toUpperCase()}</span>
                  </div>

                  {/* Height Extrusion Wall Simulation */}
                  <div
                    className="absolute top-0 left-0 right-0 h-4 bg-black/20 origin-top rounded-t"
                    style={{ transform: 'rotateX(-90deg)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Shape Inspector Panel (Floating on Top-Right when selected) */}
        {selectedShape && (
          <div className="absolute top-4 right-72 z-30 w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                {selectedShape.name}
              </span>
              <button
                onClick={() => setSelectedShapeId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Solid vs Hole Mode (Tinkercad signature!) */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-bold bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() =>
                  setShapes(shapes.map((s) => (s.id === selectedShape.id ? { ...s, isHole: false } : s)))
                }
                className={`flex-1 py-1 rounded transition-colors cursor-pointer ${
                  !selectedShape.isHole
                    ? 'bg-white dark:bg-slate-700 text-[#0084FF] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Solid
              </button>
              <button
                onClick={() =>
                  setShapes(shapes.map((s) => (s.id === selectedShape.id ? { ...s, isHole: true } : s)))
                }
                className={`flex-1 py-1 rounded transition-colors cursor-pointer ${
                  selectedShape.isHole
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Hole (Cut)
              </button>
            </div>

            {/* Color Palette if Solid */}
            {!selectedShape.isHole && (
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Color:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['#EF4444', '#F97316', '#EAB308', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#1E293B'].map(
                    (hex) => (
                      <button
                        key={hex}
                        onClick={() =>
                          setShapes(
                            shapes.map((s) => (s.id === selectedShape.id ? { ...s, color: hex } : s))
                          )
                        }
                        className={`w-5 h-5 rounded-full border border-black/20 transition-transform cursor-pointer ${
                          selectedShape.color === hex ? 'scale-125 ring-2 ring-[#0084FF]' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Dimensions Sliders */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                  <span>Width:</span>
                  <span className="font-mono font-bold">{selectedShape.width} mm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={selectedShape.width}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setShapes(shapes.map((s) => (s.id === selectedShape.id ? { ...s, width: val } : s)));
                  }}
                  className="w-full h-1 accent-[#0084FF] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                  <span>Length:</span>
                  <span className="font-mono font-bold">{selectedShape.length} mm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={selectedShape.length}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setShapes(shapes.map((s) => (s.id === selectedShape.id ? { ...s, length: val } : s)));
                  }}
                  className="w-full h-1 accent-[#0084FF] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                  <span>Height:</span>
                  <span className="font-mono font-bold">{selectedShape.height} mm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={selectedShape.height}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setShapes(shapes.map((s) => (s.id === selectedShape.id ? { ...s, height: val } : s)));
                  }}
                  className="w-full h-1 accent-[#0084FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Right 3D Shapes Tray */}
        {shapesTrayOpen && (
          <aside className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-30 shrink-0 shadow-sm animate-in slide-in-from-right duration-200">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Basic Shapes
              </span>
              <button
                onClick={() => setShapesTrayOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              <div className="text-[10px] text-slate-400 font-semibold mb-2">
                CLICK TO PLACE SHAPE ON WORKPLANE:
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BASIC_SHAPES_CATALOG.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddShape(item.type, item.color, item.name)}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#0084FF] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-2xs"
                  >
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center text-white text-lg font-bold shadow-sm mb-1.5 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Export 3D Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Export 3D Model
              </h3>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred 3D printing or rendering file format:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  alert('Exporting .STL for 3D Printing...');
                  setExportModalOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-[#0084FF] text-[#0084FF] hover:bg-[#0084FF] hover:text-white font-bold text-xs transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>.STL (For 3D Printing)</span>
                <span className="text-[10px] opacity-70">Recommended</span>
              </button>
              <button
                onClick={() => {
                  alert('Exporting .OBJ model with textures...');
                  setExportModalOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>.OBJ (Full 3D mesh)</span>
              </button>
              <button
                onClick={() => {
                  alert('Exporting .GLTF model...');
                  setExportModalOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>.GLTF (Universal 3D)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
