import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent
} from '@dnd-kit/core';
import { CircuitDesign } from '../../types';
import { COMPONENTS_CATALOG } from '../../lib/componentsCatalog';
import { PlacedComponent, PlacedWire, WireColorType, WireStyleType } from '../../types/builder';
import { useTheme } from '../../context/ThemeContext';
import { getComponentPins, getPinPosition } from '../../lib/componentPins';
import { DraggableComponent } from './DraggableComponent';
import { calculateBreadboardSnap, BreadboardSnapResult } from '../../lib/breadboardSnapping';
import { CIRCUIT_STARTERS } from '../../lib/circuitStarters';
import { TUTORIAL_VIDEOS } from '../../lib/tutorialVideos';
import { TutorialVideoPlayerModal } from './TutorialVideoPlayerModal';
import { PlacedComponentsSidebar } from './PlacedComponentsSidebar';
import {
  ArrowLeft,
  Play,
  Square,
  Code2,
  RotateCw,
  Trash2,
  Undo2,
  Redo2,
  Search,
  Terminal,
  Copy,
  Check,
  Layers,
  X,
  Sun,
  Moon,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CopyPlus,
  Sparkles,
  Video,
  Cable,
  HelpCircle,
  ChevronDown,
  Wrench,
  Sliders,
  Cpu,
  Unlink,
  BoxSelect,
  Clipboard,
  ClipboardCheck,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface TinkercadEditorProps {
  circuit: CircuitDesign;
  onBack: () => void;
  onSaveTitle?: (newTitle: string) => void;
  onSaveCircuit?: (components: PlacedComponent[], wires: PlacedWire[]) => void;
}

export const COMPONENT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  'comp-arduino-uno': { w: 270, h: 175 },
  'comp-breadboard': { w: 300, h: 145 },
  'comp-breadboard-mini': { w: 180, h: 100 },
  'comp-led': { w: 74, h: 82 },
  'comp-led-rgb': { w: 88, h: 92 },
  'comp-resistor': { w: 100, h: 50 },
  'comp-capacitor-ceramic': { w: 52, h: 55 },
  'comp-capacitor-electrolytic': { w: 60, h: 75 },
  'comp-diode': { w: 72, h: 44 },
  'comp-transistor-npn': { w: 64, h: 65 },
  'comp-pushbutton': { w: 80, h: 80 },
  'comp-slideswitch': { w: 76, h: 55 },
  'comp-dipswitch': { w: 96, h: 72 },
  'comp-potentiometer': { w: 90, h: 110 },
  'comp-photoresistor': { w: 52, h: 65 },
  'comp-ultrasonic': { w: 116, h: 88 },
  'comp-pir': { w: 100, h: 85 },
  'comp-temp': { w: 70, h: 65 },
  'comp-tilt': { w: 56, h: 65 },
  'comp-servo': { w: 105, h: 95 },
  'comp-dc-motor': { w: 88, h: 85 },
  'comp-piezo': { w: 80, h: 80 },
  'comp-relay': { w: 76, h: 65 },
  'comp-battery-9v': { w: 80, h: 110 },
  'comp-battery-coincell': { w: 64, h: 64 },
  'comp-battery-aa': { w: 88, h: 95 },
  'comp-lcd-16x2': { w: 190, h: 80 },
  'comp-7segment': { w: 76, h: 95 },
  'comp-multimeter': { w: 100, h: 120 },
  'comp-oscilloscope': { w: 170, h: 130 },
  'comp-microbit': { w: 170, h: 150 },
  'comp-attiny85': { w: 80, h: 80 },
  'comp-neopixel-ring': { w: 110, h: 110 },
  'comp-gas-sensor': { w: 90, h: 80 },
  'comp-flex-sensor': { w: 50, h: 130 },
  'comp-logic-gate-and': { w: 120, h: 70 },
  'comp-powersupply': { w: 140, h: 120 }
};

export const TINKERCAD_WIRE_COLORS: Record<WireColorType, { name: string; hex: string; border: string }> = {
  green: { name: 'Green', hex: '#10B981', border: '#059669' },
  black: { name: 'Black', hex: '#1E293B', border: '#0F172A' },
  red: { name: 'Red', hex: '#EF4444', border: '#DC2626' },
  blue: { name: 'Blue', hex: '#3B82F6', border: '#2563EB' },
  yellow: { name: 'Yellow', hex: '#F59E0B', border: '#D97706' },
  white: { name: 'White', hex: '#F8FAFC', border: '#CBD5E1' },
  orange: { name: 'Orange', hex: '#F97316', border: '#EA580C' },
  brown: { name: 'Brown', hex: '#8B5A2B', border: '#6E451E' },
  purple: { name: 'Purple', hex: '#A855F7', border: '#9333EA' },
  gray: { name: 'Gray', hex: '#64748B', border: '#475569' },
  pink: { name: 'Pink', hex: '#EC4899', border: '#DB2777' },
  cyan: { name: 'Cyan', hex: '#06B6D4', border: '#0891B2' }
};

export function getRotatedPinCoords(comp: PlacedComponent, pinName: string) {
  const raw = getPinPosition(comp.componentId, pinName);
  const dims = COMPONENT_DIMENSIONS[comp.componentId] || { w: 80, h: 80 };
  const rot = comp.rotation || 0;
  if (rot === 0) {
    return { x: comp.x + raw.relX, y: comp.y + raw.relY };
  }
  const rad = (rot * Math.PI) / 180;
  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const dx = raw.relX - cx;
  const dy = raw.relY - cy;
  const rx = cx + dx * Math.cos(rad) - dy * Math.sin(rad);
  const ry = cy + dx * Math.sin(rad) + dy * Math.cos(rad);
  return { x: Math.round(comp.x + rx), y: Math.round(comp.y + ry) };
}

export const TinkercadEditor: React.FC<TinkercadEditorProps> = ({
  circuit,
  onBack,
  onSaveTitle,
  onSaveCircuit
}) => {
  const { theme, toggleTheme } = useTheme();
  const [title, setTitle] = useState(circuit.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Simulation mode
  const [isSimulating, setIsSimulating] = useState(false);
  const [codeDrawerOpen, setCodeDrawerOpen] = useState(false);
  const [componentsDrawerOpen, setComponentsDrawerOpen] = useState(true);
  const [languageMode, setLanguageMode] = useState<'cpp' | 'python'>('cpp');

  // Wire tool & styling
  const [isWireToolActive, setIsWireToolActive] = useState(false);
  const [wireColor, setWireColor] = useState<WireColorType>('green');
  const [wireType, setWireType] = useState<WireStyleType>('normal');

  // Placed components sidebar open state (searchable list of all placed components with properties)
  const [placedSidebarOpen, setPlacedSidebarOpen] = useState(false);

  // Component catalog & starters tab
  const [selectedCategory, setSelectedCategory] = useState<'Basic' | 'Arduino' | 'Starters' | 'Tutorials' | 'All'>('Basic');
  const [componentSearch, setComponentSearch] = useState('');

  // Snap to grid setting (0 = off, 5, 10, 20 px)
  const [snapGrid, setSnapGrid] = useState<number>(10);

  // Breadboard snap preview highlight state
  const [activeBreadboardSnap, setActiveBreadboardSnap] = useState<BreadboardSnapResult | null>(null);

  // Active drag delta for 60fps real-time wire following during dnd-kit drag
  const [activeDragDelta, setActiveDragDelta] = useState<{ id: string; dx: number; dy: number; movingIds: string[] } | null>(null);

  // Ghost mode for click-to-place from catalog
  const [placingCatalogItem, setPlacingCatalogItem] = useState<typeof COMPONENTS_CATALOG[0] | null>(null);

  // Tutorial Video Modal
  const [activeTutorialModal, setActiveTutorialModal] = useState<typeof TUTORIAL_VIDEOS[0] | null>(null);

  // Clipboard for copy & paste (Ctrl+C / Ctrl+V)
  const [clipboard, setClipboard] = useState<{ components: PlacedComponent[]; wires: PlacedWire[] } | null>(null);

  // Zoom scale & pan
  const [zoomScale, setZoomScale] = useState(1);
  const workplaneRef = useRef<HTMLDivElement>(null);

  // Placed components state: checks circuit.placedComponents, matched starter, or loads empty breadboard workspace
  const [components, setComponents] = useState<PlacedComponent[]>(() => {
    if (circuit.placedComponents && circuit.placedComponents.length > 0) {
      return circuit.placedComponents;
    }
    const matchedStarter = CIRCUIT_STARTERS.find((s) => circuit.slug?.includes(s.id));
    if (matchedStarter) {
      return matchedStarter.components;
    }
    // Default empty breadboard workspace as confirmed by user in Phase 1
    return [
      {
        instanceId: 'inst-breadboard-main',
        componentId: 'comp-breadboard',
        name: 'Breadboard Small',
        x: 340,
        y: 120,
        rotation: 0
      }
    ];
  });

  // Placed wires state
  const [wires, setWires] = useState<PlacedWire[]>(() => {
    if (circuit.placedWires) {
      return circuit.placedWires;
    }
    const matchedStarter = CIRCUIT_STARTERS.find((s) => circuit.slug?.includes(s.id));
    if (matchedStarter) {
      return matchedStarter.wires;
    }
    return [];
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState<{ components: PlacedComponent[]; wires: PlacedWire[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = (newComps: PlacedComponent[], newWires: PlacedWire[]) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), { components: newComps, wires: newWires }]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setComponents(prev.components);
      setWires(prev.wires);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setComponents(next.components);
      setWires(next.wires);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Multi-Selection State (Supports single or multi-component selection & grouping)
  const [selectedInstanceIds, setSelectedInstanceIds] = useState<string[]>([]);
  const selectedInstanceId = selectedInstanceIds.length === 1 ? selectedInstanceIds[0] : null;
  const setSelectedInstanceId = (id: string | null) => setSelectedInstanceIds(id ? [id] : []);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // Marquee (rubberband) drag selection box state
  const [marqueeBox, setMarqueeBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const isMarqueeActive = useRef(false);

  // Wire tool in progress state (supports pin-to-pin OR free point-to-point wiring)
  const [pendingWireStart, setPendingWireStart] = useState<{
    instanceId?: string;
    pin?: string;
    x: number;
    y: number;
  } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4 // distinguish clicks on pins/switches from component dragging
      }
    })
  );

  // Simulation tick loop
  const [ledDelay, setLedDelay] = useState(500);
  const [ledState, setLedState] = useState(false);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[INIT] Autodesk Tinkercad AVR Physical Engine v3.0 online',
    '[OK] ATmega328P Clock: 16.000 MHz | Supply: 5.00V DC',
    '[READY] Click Start Simulation to run virtual electronics'
  ]);
  const [serialOpen, setSerialOpen] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const addSerialLog = useCallback((msg: string) => {
    setSerialLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  useEffect(() => {
    if (!isSimulating) {
      setComponents((prev) =>
        prev.map((c) =>
          c.state?.ledLit || c.state?.dcMotorRpm || c.state?.multimeterValue || c.state?.isBuzzerActive
            ? {
                ...c,
                state: {
                  ...c.state,
                  ledLit: false,
                  dcMotorRpm: 0,
                  multimeterValue: undefined,
                  isBuzzerActive: false
                }
              }
            : c
        )
      );
      return;
    }

    // Identify power sources placed in the circuit
    const hasBattery9v = components.some((c) => c.componentId === 'comp-battery-9v');
    const hasBatteryCoin = components.some((c) => c.componentId === 'comp-battery-coin');
    const hasBatteryAA = components.some((c) => c.componentId === 'comp-battery-aa');
    const hasArduino = components.some((c) => c.componentId === 'comp-arduino-uno');
    const hasMicrobit = components.some((c) => c.componentId === 'comp-microbit');
    const hasAttiny = components.some((c) => c.componentId === 'comp-attiny85');
    const hasPowerSupply = components.some((c) => c.componentId === 'comp-powersupply');

    const hasPower = hasBattery9v || hasBatteryCoin || hasBatteryAA || hasArduino || hasMicrobit || hasAttiny || hasPowerSupply;
    const sourceVoltage = hasBattery9v ? '9.00 V' : hasBatteryCoin ? '3.00 V' : hasBatteryAA ? '1.50 V' : '5.00 V';

    const pot = components.find((c) => c.componentId === 'comp-potentiometer');
    const effectiveDelay =
      pot && pot.state?.knobAngle
        ? Math.max(100, Math.round(1500 - (pot.state.knobAngle / 270) * 1300))
        : ledDelay;

    const interval = setInterval(() => {
      setLedState((prev) => {
        const next = !prev;
        if (languageMode === 'python') {
          addSerialLog(`MicroPython: Pin(9).value(${next ? 1 : 0})`);
        } else {
          addSerialLog(`digitalWrite(9, ${next ? 'HIGH (' + sourceVoltage + ')' : 'LOW (0.0V)'})`);
        }
        return next;
      });

      // Update simulation dynamic state on placed components
      setComponents((prev) =>
        prev.map((c) => {
          if (c.componentId === 'comp-multimeter') {
            return {
              ...c,
              state: {
                ...c.state,
                multimeterValue: hasPower ? sourceVoltage : '0.00 V'
              }
            };
          }
          if (c.componentId === 'comp-dc-motor') {
            return {
              ...c,
              state: {
                ...c.state,
                dcMotorRpm: hasPower ? 200 + Math.round(Math.random() * 20) : 0
              }
            };
          }
          if (c.componentId === 'comp-7segment') {
            const currentDigit = c.state?.segmentDigit ?? 0;
            return {
              ...c,
              state: {
                ...c.state,
                segmentDigit: hasPower ? (currentDigit + 1) % 10 : 0
              }
            };
          }
          if (c.componentId === 'comp-buzzer') {
            return {
              ...c,
              state: {
                ...c.state,
                isBuzzerActive: hasPower
              }
            };
          }
          if (c.componentId === 'comp-led') {
            return {
              ...c,
              state: {
                ...c.state,
                ledLit: hasPower ? (hasArduino ? !ledState : true) : false
              }
            };
          }
          return c;
        })
      );
    }, effectiveDelay);

    return () => clearInterval(interval);
  }, [isSimulating, ledDelay, languageMode, components, ledState, addSerialLog]);

  // Track cursor position and marquee box selection on workplane canvas
  const handleWorkplaneMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!workplaneRef.current) return;
    const rect = workplaneRef.current.getBoundingClientRect();
    const scrollLeft = workplaneRef.current.scrollLeft;
    const scrollTop = workplaneRef.current.scrollTop;
    const currentX = (e.clientX - rect.left + scrollLeft) / zoomScale;
    const currentY = (e.clientY - rect.top + scrollTop) / zoomScale;

    setCursorPos({ x: Math.round(currentX), y: Math.round(currentY) });

    if (isMarqueeActive.current && marqueeBox) {
      setMarqueeBox((prev) =>
        prev
          ? {
              ...prev,
              currentX: Math.round(currentX),
              currentY: Math.round(currentY)
            }
          : null
      );
    }
  };

  const handleWorkplaneMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isWireToolActive || pendingWireStart || placingCatalogItem) return;
    if ((e.target as HTMLElement).closest('.cursor-grab, .cursor-grabbing, g.cursor-pointer')) return;

    if (!workplaneRef.current) return;
    const rect = workplaneRef.current.getBoundingClientRect();
    const scrollLeft = workplaneRef.current.scrollLeft;
    const scrollTop = workplaneRef.current.scrollTop;
    const x = Math.round((e.clientX - rect.left + scrollLeft) / zoomScale);
    const y = Math.round((e.clientY - rect.top + scrollTop) / zoomScale);

    setMarqueeBox({ startX: x, startY: y, currentX: x, currentY: y });
    isMarqueeActive.current = true;
  };

  const handleWorkplaneMouseUp = () => {
    if (isMarqueeActive.current && marqueeBox) {
      isMarqueeActive.current = false;
      const minX = Math.min(marqueeBox.startX, marqueeBox.currentX);
      const maxX = Math.max(marqueeBox.startX, marqueeBox.currentX);
      const minY = Math.min(marqueeBox.startY, marqueeBox.currentY);
      const maxY = Math.max(marqueeBox.startY, marqueeBox.currentY);

      if (maxX - minX > 8 || maxY - minY > 8) {
        const enclosed = components.filter((comp) => {
          const dims = COMPONENT_DIMENSIONS[comp.componentId] || { w: 80, h: 80 };
          return (
            comp.x < maxX &&
            comp.x + dims.w > minX &&
            comp.y < maxY &&
            comp.y + dims.h > minY
          );
        });

        const enclosedIds = enclosed.map((c) => c.instanceId);
        setSelectedInstanceIds(enclosedIds);
        setSelectedWireId(null);
        if (enclosedIds.length > 0) {
          addSerialLog(`[SELECT] Selected ${enclosedIds.length} components`);
        }
      }
      setMarqueeBox(null);
    }
  };

  // --- dnd-kit Drag Handlers with Breadboard Collision Detection ---
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const activeComp = components.find((c) => c.instanceId === activeId);
    let movingIds: string[] = [activeId];

    if (selectedInstanceIds.includes(activeId) && selectedInstanceIds.length > 1) {
      movingIds = selectedInstanceIds;
    } else if (activeComp?.groupId) {
      movingIds = components
        .filter((c) => c.groupId === activeComp.groupId)
        .map((c) => c.instanceId);
      setSelectedInstanceIds(movingIds);
    } else {
      setSelectedInstanceIds([activeId]);
    }

    setSelectedWireId(null);
    setActiveDragDelta({ id: activeId, dx: 0, dy: 0, movingIds });
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const activeComp = components.find((c) => c.instanceId === String(event.active.id));
    if (!activeComp) return;

    const dx = event.delta.x / zoomScale;
    const dy = event.delta.y / zoomScale;
    const movingIds = activeDragDelta?.movingIds || [activeComp.instanceId];
    setActiveDragDelta({ id: activeComp.instanceId, dx, dy, movingIds });

    const currentX = activeComp.x + dx;
    const currentY = activeComp.y + dy;

    // Check collision against placed breadboard(s)
    const breadboard = components.find(
      (c) => c.componentId === 'comp-breadboard' && !movingIds.includes(c.instanceId)
    );

    if (breadboard) {
      const snap = calculateBreadboardSnap(currentX, currentY, activeComp.componentId, breadboard);
      setActiveBreadboardSnap(snap);
    } else {
      setActiveBreadboardSnap(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const activeComp = components.find((c) => c.instanceId === String(active.id));
    if (!activeComp) {
      setActiveDragDelta(null);
      return;
    }

    const movingIds = activeDragDelta?.movingIds || [activeComp.instanceId];
    setActiveDragDelta(null);

    let targetX = activeComp.x + delta.x / zoomScale;
    let targetY = activeComp.y + delta.y / zoomScale;

    // 1. If breadboard collision detected, snap directly to breadboard socket!
    if (activeBreadboardSnap && activeBreadboardSnap.isColliding) {
      targetX = activeBreadboardSnap.snappedX;
      targetY = activeBreadboardSnap.snappedY;
      addSerialLog(
        `[SNAP] ${activeComp.name} snapped to Breadboard (Col ${activeBreadboardSnap.column}, ${activeBreadboardSnap.rowName})`
      );
    } else if (snapGrid > 0) {
      // 2. Regular workplane grid snap
      targetX = Math.round(targetX / snapGrid) * snapGrid;
      targetY = Math.round(targetY / snapGrid) * snapGrid;
    }

    targetX = Math.max(10, Math.round(targetX));
    targetY = Math.max(10, Math.round(targetY));

    // Vector difference applied to active component
    const deltaX = targetX - activeComp.x;
    const deltaY = targetY - activeComp.y;

    // Move ALL moving components in the selection/group by this exact delta
    const updated = components.map((c) =>
      movingIds.includes(c.instanceId)
        ? {
            ...c,
            x: Math.max(10, Math.round(c.x + deltaX)),
            y: Math.max(10, Math.round(c.y + deltaY))
          }
        : c
    );

    setComponents(updated);
    setActiveBreadboardSnap(null);
    pushHistory(updated, wires);
  };

  const handleDragCancel = () => {
    setActiveDragDelta(null);
    setActiveBreadboardSnap(null);
  };

  // --- Wire Tool & Pin Click Handler ---
  const handlePinClick = (
    instanceId: string,
    pinName: string,
    relX: number,
    relY: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const comp = components.find((c) => c.instanceId === instanceId);
    const pinCoords = comp ? getRotatedPinCoords(comp, pinName) : { x: cursorPos.x, y: cursorPos.y };

    if (!pendingWireStart) {
      // Start wire from this pin
      setPendingWireStart({
        instanceId,
        pin: pinName,
        x: pinCoords.x,
        y: pinCoords.y
      });
      addSerialLog(`[WIRE] Started from ${pinName} (Click destination to complete)`);
    } else {
      // Complete wire
      if (pendingWireStart.instanceId === instanceId && pendingWireStart.pin === pinName) {
        setPendingWireStart(null);
        return;
      }

      const newWire: PlacedWire = {
        id: `wire-${Date.now()}`,
        fromComponentId: pendingWireStart.instanceId,
        fromPin: pendingWireStart.pin,
        startX: pendingWireStart.x,
        startY: pendingWireStart.y,
        toComponentId: instanceId,
        toPin: pinName,
        endX: pinCoords.x,
        endY: pinCoords.y,
        color: wireColor,
        wireType
      };

      const updatedWires = [...wires, newWire];
      setWires(updatedWires);
      setPendingWireStart(null);
      pushHistory(components, updatedWires);
      addSerialLog(
        `[WIRE] Connected: ${pendingWireStart.pin || 'Point'} ➔ ${pinName} [${wireColor.toUpperCase()} ${wireType.toUpperCase()}]`
      );
    }
  };

  // Free-form Point-to-Point Canvas Click wiring
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Ghost placement from catalog
    if (placingCatalogItem) {
      const dims = COMPONENT_DIMENSIONS[placingCatalogItem.id] || { w: 80, h: 80 };
      let placeX = cursorPos.x - dims.w / 2;
      let placeY = cursorPos.y - dims.h / 2;

      // Check breadboard snap on drop
      const breadboard = components.find((c) => c.componentId === 'comp-breadboard');
      if (breadboard) {
        const snap = calculateBreadboardSnap(placeX, placeY, placingCatalogItem.id, breadboard);
        if (snap) {
          placeX = snap.snappedX;
          placeY = snap.snappedY;
        }
      } else if (snapGrid > 0) {
        placeX = Math.round(placeX / snapGrid) * snapGrid;
        placeY = Math.round(placeY / snapGrid) * snapGrid;
      }

      handleAddComponent(placingCatalogItem, Math.max(10, Math.round(placeX)), Math.max(10, Math.round(placeY)));
      setPlacingCatalogItem(null);
      return;
    }

    // 2. Point-to-Point Wire Tool
    if (isWireToolActive) {
      if (!pendingWireStart) {
        // Start wire at arbitrary canvas coordinates
        setPendingWireStart({
          x: cursorPos.x,
          y: cursorPos.y
        });
        addSerialLog(`[WIRE TOOL] Started wire at (${cursorPos.x}, ${cursorPos.y}) - Click destination point`);
      } else {
        // Complete wire between two points
        const newWire: PlacedWire = {
          id: `wire-${Date.now()}`,
          fromComponentId: pendingWireStart.instanceId,
          fromPin: pendingWireStart.pin,
          startX: pendingWireStart.x,
          startY: pendingWireStart.y,
          endX: cursorPos.x,
          endY: cursorPos.y,
          color: wireColor,
          wireType
        };

        const updatedWires = [...wires, newWire];
        setWires(updatedWires);
        setPendingWireStart(null);
        pushHistory(components, updatedWires);
        addSerialLog(
          `[WIRE TOOL] Physical wire placed: (${pendingWireStart.x}, ${pendingWireStart.y}) ➔ (${cursorPos.x}, ${cursorPos.y})`
        );
      }
      return;
    }

    // 3. Deselect when clicking empty space
    setSelectedInstanceId(null);
    setSelectedWireId(null);
    if (pendingWireStart) setPendingWireStart(null);
  };

  // Add component to workplane
  const handleAddComponent = (catalogItem: typeof COMPONENTS_CATALOG[0], dropX?: number, dropY?: number) => {
    const x = dropX ?? 200 + Math.random() * 120;
    const y = dropY ?? 150 + Math.random() * 80;

    const newComp: PlacedComponent = {
      instanceId: `inst-${catalogItem.id}-${Date.now()}`,
      componentId: catalogItem.id,
      name: catalogItem.name,
      x: Math.round(x),
      y: Math.round(y),
      rotation: 0,
      color: catalogItem.id === 'comp-led' ? 'red' : undefined,
      customValue: catalogItem.id === 'comp-resistor' ? '220Ω' : undefined,
      state: {
        knobAngle: 135,
        distanceCm: 24,
        buttonPressed: false,
        servoAngle: 60
      }
    };
    const updated = [...components, newComp];
    setComponents(updated);
    setSelectedInstanceId(newComp.instanceId);
    pushHistory(updated, wires);
    addSerialLog(`[ADD] Added ${catalogItem.name} to workplane`);
  };

  // Load starter circuit preset
  const handleLoadStarter = (starter: typeof CIRCUIT_STARTERS[0]) => {
    setComponents(starter.components);
    setWires(starter.wires);
    setTitle(starter.name);
    setLanguageMode(starter.codeLanguage);
    pushHistory(starter.components, starter.wires);
    addSerialLog(`[STARTER] Loaded "${starter.name}" with full pre-wired setup`);
  };

  // Group all currently selected components (Ctrl+G)
  const handleGroupSelected = () => {
    if (selectedInstanceIds.length < 2) return;
    const newGroupId = `group-${Date.now()}`;
    const updated = components.map((c) =>
      selectedInstanceIds.includes(c.instanceId) ? { ...c, groupId: newGroupId } : c
    );
    setComponents(updated);
    pushHistory(updated, wires);
    addSerialLog(`[GROUP] Grouped ${selectedInstanceIds.length} components together`);
  };

  // Ungroup selected components (Ctrl+Shift+G)
  const handleUngroupSelected = () => {
    const selectedComps = components.filter((c) => selectedInstanceIds.includes(c.instanceId));
    const targetGroupIds = new Set(selectedComps.map((c) => c.groupId).filter(Boolean));
    if (targetGroupIds.size === 0) return;

    const updated = components.map((c) =>
      c.groupId && targetGroupIds.has(c.groupId) ? { ...c, groupId: undefined } : c
    );
    setComponents(updated);
    pushHistory(updated, wires);
    addSerialLog(`[UNGROUP] Ungrouped components`);
  };

  // Ungroup a specific group by ID
  const handleUngroupGroup = (groupId: string) => {
    const updated = components.map((c) =>
      c.groupId === groupId ? { ...c, groupId: undefined } : c
    );
    setComponents(updated);
    pushHistory(updated, wires);
    addSerialLog(`[UNGROUP] Ungrouped components`);
  };

  // Select all components (Ctrl+A)
  const handleSelectAll = () => {
    setSelectedInstanceIds(components.map((c) => c.instanceId));
    setSelectedWireId(null);
    addSerialLog(`[SELECT] Selected all ${components.length} components on canvas`);
  };

  // Component Click handler supporting Shift/Ctrl multi-selection and groups
  const handleComponentSelect = (instanceId: string, e: React.MouseEvent) => {
    const target = components.find((c) => c.instanceId === instanceId);
    if (!target) return;

    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (selectedInstanceIds.includes(instanceId)) {
        setSelectedInstanceIds((prev) => prev.filter((id) => id !== instanceId));
      } else {
        if (target.groupId) {
          const groupSiblings = components
            .filter((c) => c.groupId === target.groupId)
            .map((c) => c.instanceId);
          setSelectedInstanceIds((prev) => Array.from(new Set([...prev, ...groupSiblings])));
        } else {
          setSelectedInstanceIds((prev) => [...prev, instanceId]);
        }
      }
    } else {
      if (target.groupId) {
        const groupMembers = components
          .filter((c) => c.groupId === target.groupId)
          .map((c) => c.instanceId);
        setSelectedInstanceIds(groupMembers);
      } else {
        setSelectedInstanceIds([instanceId]);
      }
    }
    setSelectedWireId(null);
  };

  // Rotate component(s) or entire group 90°
  const handleRotateSelected = () => {
    if (selectedInstanceIds.length === 0) return;
    const targets = components.filter((c) => selectedInstanceIds.includes(c.instanceId));
    if (targets.length === 1) {
      handleRotateComponentById(targets[0].instanceId);
      return;
    }

    // Multiple components / Group rotation revolving around center
    const minX = Math.min(...targets.map((c) => c.x));
    const maxX = Math.max(
      ...targets.map((c) => c.x + (COMPONENT_DIMENSIONS[c.componentId]?.w || 80))
    );
    const minY = Math.min(...targets.map((c) => c.y));
    const maxY = Math.max(
      ...targets.map((c) => c.y + (COMPONENT_DIMENSIONS[c.componentId]?.h || 80))
    );
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const updated = components.map((c) => {
      if (!selectedInstanceIds.includes(c.instanceId)) return c;
      const dims = COMPONENT_DIMENSIONS[c.componentId] || { w: 80, h: 80 };
      const compCenterX = c.x + dims.w / 2;
      const compCenterY = c.y + dims.h / 2;
      const relX = compCenterX - centerX;
      const relY = compCenterY - centerY;
      // Rotate 90 degrees clockwise: (x', y') = (-y, x)
      const newCompCenterX = centerX - relY;
      const newCompCenterY = centerY + relX;
      return {
        ...c,
        x: Math.max(10, Math.round(newCompCenterX - dims.w / 2)),
        y: Math.max(10, Math.round(newCompCenterY - dims.h / 2)),
        rotation: (c.rotation + 90) % 360
      };
    });
    setComponents(updated);
    pushHistory(updated, wires);
    addSerialLog(`[ROTATE] Rotated group of ${targets.length} components 90°`);
  };

  // Rotate component by specific ID
  const handleRotateComponentById = (instanceId: string) => {
    const updated = components.map((c) => {
      if (c.instanceId === instanceId) {
        const nextRot = (c.rotation + 90) % 360;
        return { ...c, rotation: nextRot };
      }
      return c;
    });
    setComponents(updated);
    pushHistory(updated, wires);
    addSerialLog('[ROTATE] Rotated component 90°');
  };

  // Duplicate component or group
  const handleDuplicateSelected = () => {
    if (selectedInstanceIds.length === 0) return;
    const targets = components.filter((c) => selectedInstanceIds.includes(c.instanceId));
    const isGroup = targets.length > 1;
    const newGroupId = isGroup ? `group-${Date.now()}` : undefined;
    const idMap: Record<string, string> = {};
    const duplicatedComps: PlacedComponent[] = [];

    targets.forEach((target) => {
      const newId = `inst-${target.componentId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      idMap[target.instanceId] = newId;
      duplicatedComps.push({
        ...target,
        instanceId: newId,
        name: `${target.name} (Copy)`,
        groupId: newGroupId || target.groupId,
        x: target.x + 30,
        y: target.y + 30
      });
    });

    // Duplicate internal wires connecting between duplicated components
    const duplicatedWires: PlacedWire[] = [];
    wires.forEach((w) => {
      if (w.fromComponentId && w.toComponentId && idMap[w.fromComponentId] && idMap[w.toComponentId]) {
        duplicatedWires.push({
          ...w,
          id: `wire-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          fromComponentId: idMap[w.fromComponentId],
          toComponentId: idMap[w.toComponentId]
        });
      }
    });

    const updatedComps = [...components, ...duplicatedComps];
    const updatedWires = [...wires, ...duplicatedWires];
    setComponents(updatedComps);
    setWires(updatedWires);
    setSelectedInstanceIds(duplicatedComps.map((c) => c.instanceId));
    pushHistory(updatedComps, updatedWires);
    addSerialLog(`[DUPLICATE] Created copy of ${duplicatedComps.length} component(s)`);
  };

  // Copy selected component(s) to clipboard
  const handleCopySelected = () => {
    if (selectedInstanceIds.length === 0) return;
    const selectedComps = components.filter((c) => selectedInstanceIds.includes(c.instanceId));
    const selectedIdsSet = new Set(selectedInstanceIds);
    const internalWires = wires.filter(
      (w) =>
        w.fromComponentId &&
        w.toComponentId &&
        selectedIdsSet.has(w.fromComponentId) &&
        selectedIdsSet.has(w.toComponentId)
    );
    setClipboard({
      components: JSON.parse(JSON.stringify(selectedComps)),
      wires: JSON.parse(JSON.stringify(internalWires))
    });
    addSerialLog(`[COPY] Copied ${selectedComps.length} component(s) to clipboard (Ctrl+C)`);
  };

  // Paste components from clipboard
  const handlePaste = () => {
    if (!clipboard || clipboard.components.length === 0) return;
    const idMap: Record<string, string> = {};
    const isGroup = clipboard.components.length > 1;
    const newGroupId = isGroup ? `group-${Date.now()}` : undefined;

    const pastedComps: PlacedComponent[] = clipboard.components.map((c, i) => {
      const newId = `inst-${c.componentId}-${Date.now()}-${i}`;
      idMap[c.instanceId] = newId;
      return {
        ...c,
        instanceId: newId,
        groupId: newGroupId || c.groupId,
        x: c.x + 30,
        y: c.y + 30
      };
    });

    const pastedWires: PlacedWire[] = clipboard.wires.map((w, i) => ({
      ...w,
      id: `wire-${Date.now()}-${i}`,
      fromComponentId: (w.fromComponentId ? idMap[w.fromComponentId] : undefined) || w.fromComponentId,
      toComponentId: (w.toComponentId ? idMap[w.toComponentId] : undefined) || w.toComponentId
    }));

    const updatedComps = [...components, ...pastedComps];
    const updatedWires = [...wires, ...pastedWires];
    setComponents(updatedComps);
    setWires(updatedWires);
    setSelectedInstanceIds(pastedComps.map((c) => c.instanceId));
    pushHistory(updatedComps, updatedWires);
    addSerialLog(`[PASTE] Pasted ${pastedComps.length} component(s) from clipboard (Ctrl+V)`);
  };

  // Align selected components (Left, Center, Right, Top, Middle, Bottom)
  const handleAlignSelected = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedInstanceIds.length < 2) return;
    const selectedComps = components.filter((c) => selectedInstanceIds.includes(c.instanceId));
    if (selectedComps.length < 2) return;

    let targetCoord = 0;
    if (alignment === 'left') {
      targetCoord = Math.min(...selectedComps.map((c) => c.x));
    } else if (alignment === 'right') {
      targetCoord = Math.max(...selectedComps.map((c) => c.x + (COMPONENT_DIMENSIONS[c.componentId]?.w || 80)));
    } else if (alignment === 'center') {
      const minX = Math.min(...selectedComps.map((c) => c.x));
      const maxX = Math.max(...selectedComps.map((c) => c.x + (COMPONENT_DIMENSIONS[c.componentId]?.w || 80)));
      targetCoord = (minX + maxX) / 2;
    } else if (alignment === 'top') {
      targetCoord = Math.min(...selectedComps.map((c) => c.y));
    } else if (alignment === 'bottom') {
      targetCoord = Math.max(...selectedComps.map((c) => c.y + (COMPONENT_DIMENSIONS[c.componentId]?.h || 80)));
    } else if (alignment === 'middle') {
      const minY = Math.min(...selectedComps.map((c) => c.y));
      const maxY = Math.max(...selectedComps.map((c) => c.y + (COMPONENT_DIMENSIONS[c.componentId]?.h || 80)));
      targetCoord = (minY + maxY) / 2;
    }

    const updated = components.map((c) => {
      if (!selectedInstanceIds.includes(c.instanceId)) return c;
      const dims = COMPONENT_DIMENSIONS[c.componentId] || { w: 80, h: 80 };
      if (alignment === 'left') return { ...c, x: targetCoord };
      if (alignment === 'right') return { ...c, x: targetCoord - dims.w };
      if (alignment === 'center') return { ...c, x: Math.round(targetCoord - dims.w / 2) };
      if (alignment === 'top') return { ...c, y: targetCoord };
      if (alignment === 'bottom') return { ...c, y: targetCoord - dims.h };
      if (alignment === 'middle') return { ...c, y: Math.round(targetCoord - dims.h / 2) };
      return c;
    });

    setComponents(updated);
    pushHistory(updated, wires);
    addSerialLog(`[ALIGN] Aligned ${selectedComps.length} components (${alignment})`);
  };

  // Duplicate component by specific ID
  const handleDuplicateComponentById = (instanceId: string) => {
    const target = components.find((c) => c.instanceId === instanceId);
    if (!target) return;

    const dup: PlacedComponent = {
      ...target,
      instanceId: `inst-${target.componentId}-${Date.now()}`,
      name: `${target.name} (Copy)`,
      x: target.x + 30,
      y: target.y + 30
    };
    const updated = [...components, dup];
    setComponents(updated);
    setSelectedInstanceId(dup.instanceId);
    pushHistory(updated, wires);
    addSerialLog(`[DUPLICATE] Created copy of ${target.name}`);
  };

  // Delete selected item(s) or group
  const handleDeleteSelected = () => {
    if (selectedInstanceIds.length > 0) {
      const idsToDelete = new Set(selectedInstanceIds);
      const updatedComps = components.filter((c) => !idsToDelete.has(c.instanceId));
      const updatedWires = wires.filter(
        (w) =>
          (!w.fromComponentId || !idsToDelete.has(w.fromComponentId)) &&
          (!w.toComponentId || !idsToDelete.has(w.toComponentId))
      );
      setComponents(updatedComps);
      setWires(updatedWires);
      setSelectedInstanceIds([]);
      pushHistory(updatedComps, updatedWires);
      addSerialLog(`[DELETE] Removed ${idsToDelete.size} components and attached connections`);
    } else if (selectedWireId) {
      const updatedWires = wires.filter((w) => w.id !== selectedWireId);
      setWires(updatedWires);
      setSelectedWireId(null);
      pushHistory(components, updatedWires);
      addSerialLog('[DELETE] Removed wire connection');
    }
  };

  // Delete component by specific ID
  const handleDeleteComponentById = (instanceId: string) => {
    const updatedComps = components.filter((c) => c.instanceId !== instanceId);
    const updatedWires = wires.filter(
      (w) => w.fromComponentId !== instanceId && w.toComponentId !== instanceId
    );
    setComponents(updatedComps);
    setWires(updatedWires);
    setSelectedInstanceIds((prev) => prev.filter((id) => id !== instanceId));
    pushHistory(updatedComps, updatedWires);
    addSerialLog('[DELETE] Removed component and attached connections');
  };

  // Update component properties (name, position, customValue, color, etc.)
  const handleUpdateComponent = (instanceId: string, updates: Partial<PlacedComponent>) => {
    const updated = components.map((c) =>
      c.instanceId === instanceId ? { ...c, ...updates } : c
    );
    setComponents(updated);
    pushHistory(updated, wires);
  };

  // Update simulated state for component (knobAngle, distanceCm, buttonPressed, etc.)
  const handleUpdateComponentState = (
    instanceId: string,
    stateUpdates: Partial<NonNullable<PlacedComponent['state']>>
  ) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.instanceId === instanceId
          ? { ...c, state: { ...c.state, ...stateUpdates } }
          : c
      )
    );
  };

  // Locate and center component on the workplane
  const handleLocateComponent = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setSelectedWireId(null);
    const target = components.find((c) => c.instanceId === instanceId);
    if (target && workplaneRef.current) {
      const container = workplaneRef.current;
      const targetScrollLeft = target.x - container.clientWidth / 2 + 100;
      const targetScrollTop = target.y - container.clientHeight / 2 + 100;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
      addSerialLog(`[LOCATE] Focused on ${target.name} (X:${target.x}, Y:${target.y})`);
    }
  };

  // Keyboard Shortcuts (Delete, Rotate 'R', Wire Tool 'W', Arrows, Undo, Redo, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        handleDuplicateSelected();
        return;
      }

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleCopySelected();
        return;
      }

      // Paste (Ctrl+V / Cmd+V)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        handlePaste();
        return;
      }

      // Toggle Wire Tool ('W')
      if (e.key === 'w' || e.key === 'W') {
        setIsWireToolActive((prev) => !prev);
        return;
      }

      // Group (Ctrl+G)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G') && !e.shiftKey) {
        e.preventDefault();
        handleGroupSelected();
        return;
      }

      // Ungroup (Ctrl+Shift+G)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G') && e.shiftKey) {
        e.preventDefault();
        handleUngroupSelected();
        return;
      }

      // Select All (Ctrl+A)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleSelectAll();
        return;
      }

      // Arrow keys to nudge selected component(s)
      if (
        selectedInstanceIds.length > 0 &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')
      ) {
        e.preventDefault();
        const step = e.shiftKey ? (snapGrid > 0 ? snapGrid * 2 : 10) : snapGrid > 0 ? snapGrid : 2;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;

        const updated = components.map((c) =>
          selectedInstanceIds.includes(c.instanceId)
            ? { ...c, x: Math.max(10, c.x + dx), y: Math.max(10, c.y + dy) }
            : c
        );
        setComponents(updated);
        pushHistory(updated, wires);
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRotateSelected();
      } else if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
        setPlacedSidebarOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setPendingWireStart(null);
        setPlacingCatalogItem(null);
        setIsWireToolActive(false);
        setSelectedInstanceIds([]);
        setSelectedWireId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate live SVG path for wires (curved or orthogonal hookup)
  const calculateWirePath = (wire: PlacedWire) => {
    let startX = wire.startX ?? 0;
    let startY = wire.startY ?? 0;
    let endX = wire.endX ?? 0;
    let endY = wire.endY ?? 0;

    if (wire.fromComponentId && wire.fromPin) {
      const fromComp = components.find((c) => c.instanceId === wire.fromComponentId);
      if (fromComp) {
        const isMoving =
          activeDragDelta &&
          (activeDragDelta.id === fromComp.instanceId ||
            (activeDragDelta.movingIds && activeDragDelta.movingIds.includes(fromComp.instanceId)));
        const offset = isMoving
          ? { dx: activeDragDelta.dx, dy: activeDragDelta.dy }
          : { dx: 0, dy: 0 };
        const tempComp = { ...fromComp, x: fromComp.x + offset.dx, y: fromComp.y + offset.dy };
        const coords = getRotatedPinCoords(tempComp, wire.fromPin);
        startX = coords.x;
        startY = coords.y;
      }
    }

    if (wire.toComponentId && wire.toPin) {
      const toComp = components.find((c) => c.instanceId === wire.toComponentId);
      if (toComp) {
        const isMoving =
          activeDragDelta &&
          (activeDragDelta.id === toComp.instanceId ||
            (activeDragDelta.movingIds && activeDragDelta.movingIds.includes(toComp.instanceId)));
        const offset = isMoving
          ? { dx: activeDragDelta.dx, dy: activeDragDelta.dy }
          : { dx: 0, dy: 0 };
        const tempComp = { ...toComp, x: toComp.x + offset.dx, y: toComp.y + offset.dy };
        const coords = getRotatedPinCoords(tempComp, wire.toPin);
        endX = coords.x;
        endY = coords.y;
      }
    }

    // 1. Hookup 90-degree orthogonal path
    if (wire.wireType === 'hookup') {
      const midX = Math.round((startX + endX) / 2);
      return {
        d: `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`,
        startX,
        startY,
        endX,
        endY,
        color: TINKERCAD_WIRE_COLORS[wire.color]?.hex || '#10B981',
        wireType: wire.wireType
      };
    }

    // 2. Standard curved droop path
    const midX = (startX + endX) / 2;
    const distY = Math.abs(endX - startX) * 0.18 + 24;
    const midY = Math.min(startY, endY) - distY;

    return {
      d: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
      color: TINKERCAD_WIRE_COLORS[wire.color]?.hex || '#10B981',
      wireType: wire.wireType || 'normal'
    };
  };

  // Live pending wire rubberband
  const getPendingWirePath = () => {
    if (!pendingWireStart) return null;
    let startX = pendingWireStart.x;
    let startY = pendingWireStart.y;

    if (pendingWireStart.instanceId && pendingWireStart.pin) {
      const fromComp = components.find((c) => c.instanceId === pendingWireStart.instanceId);
      if (fromComp) {
        const isMoving =
          activeDragDelta &&
          (activeDragDelta.id === fromComp.instanceId ||
            (activeDragDelta.movingIds && activeDragDelta.movingIds.includes(fromComp.instanceId)));
        const offset = isMoving
          ? { dx: activeDragDelta.dx, dy: activeDragDelta.dy }
          : { dx: 0, dy: 0 };
        const tempComp = { ...fromComp, x: fromComp.x + offset.dx, y: fromComp.y + offset.dy };
        const coords = getRotatedPinCoords(tempComp, pendingWireStart.pin);
        startX = coords.x;
        startY = coords.y;
      }
    }

    const endX = cursorPos.x;
    const endY = cursorPos.y;

    if (wireType === 'hookup') {
      const midX = Math.round((startX + endX) / 2);
      return {
        d: `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`,
        startX,
        startY,
        endX,
        endY,
        color: TINKERCAD_WIRE_COLORS[wireColor]?.hex || '#10B981'
      };
    }

    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 20;

    return {
      d: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
      color: TINKERCAD_WIRE_COLORS[wireColor]?.hex || '#10B981'
    };
  };

  const pendingPath = getPendingWirePath();
  const selectedWire = wires.find((w) => w.id === selectedWireId);
  const selectedWirePath = selectedWire ? calculateWirePath(selectedWire) : null;

  // Generated MicroPython / C++ Code
  const getMicroPythonCode = () => {
    return `# Autodesk Tinkercad MicroPython Firmware
# Circuit: ${title}
from machine import Pin, ADC, PWM
import time

led_pin = Pin(9, Pin.OUT)
pot_adc = ADC(Pin(26))  # A0 Analog

print("--- Virtual AVR / ARM Engine Online ---")
print("MCU: ATmega328P | Clock: 16MHz | Voltage: 5.0V")

while True:
    raw_val = pot_adc.read_u16()
    speed_factor = max(0.05, (raw_val / 65535.0) * 1.0)
    
    led_pin.value(1)
    time.sleep(${ledDelay / 1000})

    led_pin.value(0)
    time.sleep(${ledDelay / 1000})
`;
  };

  const getArduinoCode = () => {
    return `// Autodesk Tinkercad Arduino C++ Sketch (.ino)
// Circuit: ${title}

const int LED_PIN = 9;
const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  Serial.println(F("[BOOT] Arduino Uno Core initialized"));
}

void loop() {
  int potValue = analogRead(POT_PIN);
  float voltage = potValue * (5.0 / 1023.0);
  
  digitalWrite(LED_PIN, HIGH);
  Serial.println(F("D9 -> HIGH (5.00V)"));
  delay(${ledDelay});

  digitalWrite(LED_PIN, LOW);
  Serial.println(F("D9 -> LOW (0.00V)"));
  delay(${ledDelay});
}
`;
  };

  const currentFirmwareCode = languageMode === 'python' ? getMicroPythonCode() : getArduinoCode();

  const handleCopyFirmware = async () => {
    try {
      await navigator.clipboard.writeText(currentFirmwareCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const filteredCatalog = COMPONENTS_CATALOG.filter((comp) => {
    const matchCat =
      selectedCategory === 'All' ||
      (selectedCategory !== 'Starters' && comp.category === selectedCategory);
    const matchSearch =
      componentSearch === '' || comp.name.toLowerCase().includes(componentSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#0E131E] text-slate-100 dark' : 'bg-[#E5E9F0] text-slate-800'
      }`}
    >
      {/* 1. Authentic Tinkercad Top Toolbar */}
      <header className="h-14 bg-[#1B2733] border-b border-[#2C3E50] px-4 flex items-center justify-between gap-3 shrink-0 shadow-md z-40 text-white">
        {/* Left: Brand Logo, Back, Circuit Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSaveCircuit?.(components, wires);
              onBack();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            title="Save and Return to Tinkercad Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-5 w-px bg-white/20" />

          {/* Editable Circuit Title */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  onSaveTitle?.(title);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                    onSaveTitle?.(title);
                  }
                }}
                autoFocus
                className="text-xs sm:text-sm font-bold text-white bg-slate-800 border border-[#0084FF] rounded px-2 py-0.5 focus:outline-none"
              />
            ) : (
              <span
                onClick={() => setIsEditingTitle(true)}
                className="text-xs sm:text-sm font-bold text-white hover:text-[#0084FF] cursor-pointer transition-colors max-w-[180px] sm:max-w-xs truncate"
                title="Click to rename circuit"
              >
                {title}
              </span>
            )}
          </div>
        </div>

        {/* Center: CAD Tools (Rotate, Delete, Duplicate, Group, Ungroup, Undo, Redo, Wire Tool, Wire Color, Wire Style) */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs">
          {/* Rotate (R) */}
          <button
            onClick={handleRotateSelected}
            disabled={selectedInstanceIds.length === 0}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              selectedInstanceIds.length > 0
                ? 'hover:bg-white/10 text-white'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Rotate 90° (Hotkey: R)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={handleDeleteSelected}
            disabled={selectedInstanceIds.length === 0 && !selectedWireId}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              selectedInstanceIds.length > 0 || selectedWireId
                ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Delete Selected (Hotkey: Delete)"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Copy (Ctrl+C) */}
          <button
            onClick={handleCopySelected}
            disabled={selectedInstanceIds.length === 0}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              selectedInstanceIds.length > 0
                ? 'hover:bg-white/10 text-white'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Copy Component(s) (Ctrl+C)"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Paste (Ctrl+V) */}
          <button
            onClick={handlePaste}
            disabled={!clipboard || clipboard.components.length === 0}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              clipboard && clipboard.components.length > 0
                ? 'hover:bg-white/10 text-white'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Paste Component(s) (Ctrl+V)"
          >
            <Clipboard className="w-4 h-4" />
          </button>

          {/* Duplicate (Ctrl+D) */}
          <button
            onClick={handleDuplicateSelected}
            disabled={selectedInstanceIds.length === 0}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              selectedInstanceIds.length > 0
                ? 'hover:bg-white/10 text-white'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Duplicate Component (Ctrl+D)"
          >
            <CopyPlus className="w-4 h-4" />
          </button>

          {/* Align Selected (when 2+ components selected) */}
          {selectedInstanceIds.length >= 2 && (
            <div className="flex items-center gap-0.5 bg-black/40 px-1 py-0.5 rounded border border-white/20">
              <button
                onClick={() => handleAlignSelected('left')}
                className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white cursor-pointer"
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleAlignSelected('center')}
                className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white cursor-pointer"
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleAlignSelected('right')}
                className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white cursor-pointer"
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Group (Ctrl+G) */}
          <button
            onClick={handleGroupSelected}
            disabled={selectedInstanceIds.length < 2}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              selectedInstanceIds.length >= 2
                ? 'bg-[#0084FF] text-white shadow-sm hover:bg-[#0070D6]'
                : 'text-slate-500 cursor-not-allowed opacity-40'
            }`}
            title="Group (Ctrl+G) - Combine selected components into a single unit"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Group</span>
            {selectedInstanceIds.length >= 2 && (
              <span className="px-1 py-0.2 rounded-full bg-black/40 text-[9px] font-mono">
                {selectedInstanceIds.length}
              </span>
            )}
          </button>

          {/* Ungroup (Ctrl+Shift+G) */}
          {(() => {
            const hasGroupedSelected = components.some(
              (c) => selectedInstanceIds.includes(c.instanceId) && c.groupId
            );
            return (
              <button
                onClick={handleUngroupSelected}
                disabled={!hasGroupedSelected}
                className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  hasGroupedSelected
                    ? 'bg-purple-600/80 hover:bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 cursor-not-allowed opacity-40'
                }`}
                title="Ungroup (Ctrl+Shift+G) - Separate group into individual components"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Ungroup</span>
              </button>
            );
          })()}

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              historyIndex > 0 ? 'hover:bg-white/10 text-white' : 'text-slate-500 opacity-50'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              historyIndex < history.length - 1 ? 'hover:bg-white/10 text-white' : 'text-slate-500 opacity-50'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Dedicated Wire Tool Toggle (Hotkey: W) */}
          <button
            onClick={() => {
              setIsWireToolActive(!isWireToolActive);
              if (!isWireToolActive) {
                addSerialLog('[TOOL] Wire Tool Activated: Click start point, then destination point');
              } else {
                setPendingWireStart(null);
              }
            }}
            className={`px-2.5 py-1 rounded font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
              isWireToolActive
                ? 'bg-[#0084FF] text-white border-[#0084FF] shadow-[0_0_12px_rgba(0,132,255,0.6)] animate-pulse'
                : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20 hover:text-white'
            }`}
            title="Wire Tool (Hotkey: W) - Click any 2 points on canvas to connect physical wire"
          >
            <Cable className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Wire Tool</span>
          </button>

          {/* Wire Type Dropdown (Normal, Hookup, Alligator) */}
          <div className="hidden lg:flex items-center gap-1 bg-black/20 px-2 py-1 rounded-md border border-white/10 text-[10px]">
            <span className="text-slate-300">Type:</span>
            <select
              value={wireType}
              onChange={(e) => {
                const next = e.target.value as WireStyleType;
                setWireType(next);
                if (selectedWireId) {
                  setWires((prev) =>
                    prev.map((w) => (w.id === selectedWireId ? { ...w, wireType: next } : w))
                  );
                }
              }}
              className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
            >
              <option value="normal" className="bg-slate-900 text-white">Normal</option>
              <option value="hookup" className="bg-slate-900 text-white">Hookup (90°)</option>
              <option value="alligator" className="bg-slate-900 text-white">Alligator</option>
            </select>
          </div>

          {/* Wire Color Palette (12 Tinkercad Swatches) */}
          <div className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-md border border-white/10">
            {(Object.keys(TINKERCAD_WIRE_COLORS) as WireColorType[]).slice(0, 8).map((col) => (
              <button
                key={col}
                onClick={() => {
                  setWireColor(col);
                  if (selectedWireId) {
                    setWires((prev) =>
                      prev.map((w) => (w.id === selectedWireId ? { ...w, color: col } : w))
                    );
                  }
                }}
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                  wireColor === col ? 'ring-2 ring-white scale-125 shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: TINKERCAD_WIRE_COLORS[col].hex }}
                title={`${TINKERCAD_WIRE_COLORS[col].name} wire`}
              />
            ))}
          </div>

          {/* Snap to Grid Selector */}
          <div className="hidden xl:flex items-center gap-1 bg-black/20 px-2 py-1 rounded-md border border-white/10 text-[10px]">
            <span className="text-slate-300">Snap:</span>
            <select
              value={snapGrid}
              onChange={(e) => setSnapGrid(Number(e.target.value))}
              className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
            >
              <option value={0} className="bg-slate-900 text-white">Off</option>
              <option value={5} className="bg-slate-900 text-white">5 px</option>
              <option value={10} className="bg-slate-900 text-white">10 px</option>
              <option value={20} className="bg-slate-900 text-white">20 px</option>
            </select>
          </div>
        </div>

        {/* Right: Video Tutorials, Code Drawer, Start Simulation, Components Tray */}
        <div className="flex items-center gap-2">
          {/* Tutorial Videos Button */}
          <button
            onClick={() => setActiveTutorialModal(TUTORIAL_VIDEOS[0])}
            className="px-2.5 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Watch Tinkercad Video Tutorials & Guides"
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tutorials</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Placed Components Side-Panel Sidebar Toggle (Hotkey: C) */}
          <button
            onClick={() => setPlacedSidebarOpen(!placedSidebarOpen)}
            className={`px-3 py-1.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              placedSidebarOpen
                ? 'bg-[#0084FF] text-white border-[#0084FF] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Toggle Canvas Components Side-Panel Sidebar (Hotkey: C)"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Components</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-cyan-300 text-[10px] font-mono font-bold">
              {components.length}
            </span>
          </button>

          {/* Code Drawer Toggle */}
          <button
            onClick={() => setCodeDrawerOpen(!codeDrawerOpen)}
            className={`px-3 py-1.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              codeDrawerOpen
                ? 'bg-[#0084FF] text-white border-[#0084FF]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Code</span>
          </button>

          {/* Big Start / Stop Simulation Button */}
          <button
            onClick={() => {
              const next = !isSimulating;
              setIsSimulating(next);
              if (next) {
                addSerialLog(`▶ Simulation Started (${languageMode.toUpperCase()})`);
              } else {
                addSerialLog('⏹ Simulation Halted');
              }
            }}
            className={`px-4 py-1.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isSimulating
                ? 'bg-[#EB364B] hover:bg-[#D32F2F] text-white animate-pulse shadow-[0_0_15px_rgba(235,54,75,0.6)]'
                : 'bg-[#00A651] hover:bg-[#008F45] text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Simulation</span>
              </>
            )}
          </button>

          {/* Component Tray Toggle */}
          <button
            onClick={() => setComponentsDrawerOpen(!componentsDrawerOpen)}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              componentsDrawerOpen
                ? 'bg-[#0084FF] text-white border-[#0084FF]'
                : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20'
            }`}
            title="Components Library"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Workplane Viewport with dnd-kit & Breadboard Collision Detection */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex-1 flex overflow-hidden relative">
          {/* Placed Components Side-Panel Sidebar */}
          {placedSidebarOpen && (
            <PlacedComponentsSidebar
              components={components}
              wires={wires}
              selectedInstanceId={selectedInstanceId}
              selectedInstanceIds={selectedInstanceIds}
              onSelectComponent={(id) => {
                setSelectedInstanceIds([id]);
                setSelectedWireId(null);
              }}
              onUpdateComponent={handleUpdateComponent}
              onUpdateComponentState={handleUpdateComponentState}
              onRotateComponent={handleRotateComponentById}
              onDuplicateComponent={handleDuplicateComponentById}
              onDeleteComponent={handleDeleteComponentById}
              onGroupSelected={handleGroupSelected}
              onUngroupSelected={handleUngroupSelected}
              onSelectWire={(wireId) => {
                setSelectedWireId(wireId);
                setSelectedInstanceIds([]);
              }}
              onLocateComponent={handleLocateComponent}
              onClose={() => setPlacedSidebarOpen(false)}
            />
          )}

          {/* Floating mini tab to re-open sidebar when closed */}
          {!placedSidebarOpen && (
            <button
              onClick={() => setPlacedSidebarOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-[#182230]/95 hover:bg-[#0084FF] text-white border-y border-r border-[#2C3E50] rounded-r-lg px-1.5 py-3 shadow-xl backdrop-blur-xs transition-all cursor-pointer flex flex-col items-center gap-1 group"
              title="Open Canvas Components Sidebar (Hotkey: C)"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
              <span className="text-[10px] font-bold font-mono text-slate-300 group-hover:text-white">
                {components.length}
              </span>
            </button>
          )}

          {/* Interactive Workplane Canvas Container */}
          <div
            ref={workplaneRef}
            onMouseMove={handleWorkplaneMouseMove}
            onMouseDown={handleWorkplaneMouseDown}
            onMouseUp={handleWorkplaneMouseUp}
            onClick={handleCanvasClick}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const compId = e.dataTransfer.getData('text/plain');
              const catalogItem = COMPONENTS_CATALOG.find((c) => c.id === compId);
              if (!catalogItem || !workplaneRef.current) return;

              const rect = workplaneRef.current.getBoundingClientRect();
              const scrollLeft = workplaneRef.current.scrollLeft;
              const scrollTop = workplaneRef.current.scrollTop;
              const dropX = (e.clientX - rect.left + scrollLeft) / zoomScale;
              const dropY = (e.clientY - rect.top + scrollTop) / zoomScale;

              const dims = COMPONENT_DIMENSIONS[catalogItem.id] || { w: 80, h: 80 };
              let finalX = dropX - dims.w / 2;
              let finalY = dropY - dims.h / 2;

              const breadboard = components.find((c) => c.componentId === 'comp-breadboard');
              if (breadboard) {
                const snap = calculateBreadboardSnap(finalX, finalY, catalogItem.id, breadboard);
                if (snap) {
                  finalX = snap.snappedX;
                  finalY = snap.snappedY;
                }
              } else if (snapGrid > 0) {
                finalX = Math.round(finalX / snapGrid) * snapGrid;
                finalY = Math.round(finalY / snapGrid) * snapGrid;
              }

              handleAddComponent(catalogItem, Math.max(10, Math.round(finalX)), Math.max(10, Math.round(finalY)));
              addSerialLog(`[ADDED] Placed ${catalogItem.name} onto workplane at (${Math.round(finalX)}, ${Math.round(finalY)})`);
            }}
            className={`flex-1 flex flex-col relative overflow-auto select-none bg-tinkercad-grid ${
              isWireToolActive || pendingWireStart || placingCatalogItem
                ? 'cursor-crosshair'
                : 'cursor-default'
            }`}
            style={{
              backgroundImage:
                theme === 'dark'
                  ? 'radial-gradient(#334155 1.2px, transparent 1.2px)'
                  : 'radial-gradient(#94A3B8 1.2px, transparent 1.2px)',
              backgroundSize: `${20 * zoomScale}px ${20 * zoomScale}px`,
              backgroundColor: theme === 'dark' ? '#0B0F19' : '#E2E8F0'
            }}
          >
            {/* Top Floating Helper / Status Badges */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
              {isSimulating ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-emerald-400 border border-emerald-500/50 shadow-lg text-xs font-bold pointer-events-auto">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>SIMULATION ACTIVE ({languageMode.toUpperCase()})</span>
                  <span className="font-mono text-[10px] text-slate-400">5.0V DC</span>
                </div>
              ) : isWireToolActive ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0084FF] text-white shadow-lg text-xs font-bold pointer-events-auto">
                  <Cable className="w-3.5 h-3.5" />
                  <span>
                    Wire Tool Active: {pendingWireStart ? 'Click destination point' : 'Click start point on canvas/pins'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWireToolActive(false);
                      setPendingWireStart(null);
                    }}
                    className="ml-2 underline text-blue-100 hover:text-white cursor-pointer"
                  >
                    Cancel (Esc)
                  </button>
                </div>
              ) : placingCatalogItem ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0084FF] text-white shadow-lg text-xs font-bold pointer-events-auto animate-pulse">
                  <span>Placing: {placingCatalogItem.name} — Click anywhere on workplane</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlacingCatalogItem(null);
                    }}
                    className="ml-2 underline text-blue-100 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-sm text-xs font-medium pointer-events-auto flex items-center gap-2">
                  <span>dnd-kit Snapping • Wire Tool (W)</span>
                  {snapGrid > 0 && (
                    <span className="text-[#0084FF] font-semibold font-mono">Snap: {snapGrid}px</span>
                  )}
                </div>
              )}

              {/* Breadboard Magnetic Collision Highlight Badge */}
              {activeBreadboardSnap && activeBreadboardSnap.isColliding && (
                <div className="px-3 py-1.5 rounded-full bg-emerald-600 text-white shadow-xl text-xs font-bold pointer-events-auto animate-bounce flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Snapped to Breadboard (Col {activeBreadboardSnap.column})</span>
                </div>
              )}
            </div>

            {/* Wire in progress Banner */}
            {pendingWireStart && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#0084FF] text-white px-4 py-2 rounded-full shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <span>Connecting Wire from {pendingWireStart.pin || `(${pendingWireStart.x}, ${pendingWireStart.y})`}</span>
                <span className="text-blue-100">• Click second point or pin to complete</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingWireStart(null);
                  }}
                  className="ml-2 hover:text-red-200 underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Floating Zoom & Viewport Controls in bottom-left */}
            <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-lg">
              <button
                onClick={() => setZoomScale((z) => Math.min(2, z + 0.1))}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.1))}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer text-[10px] font-bold"
                title="Reset Zoom (100%)"
              >
                100%
              </button>
            </div>

            {/* Scalable Canvas Surface for Components and SVG Wires */}
            <div
              className="relative w-[2800px] h-[1800px] origin-top-left transition-transform"
              style={{ transform: `scale(${zoomScale})` }}
            >
              {/* SVG Layer for Connections / Wires */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {/* Permanent Placed Wires */}
                {wires.map((wire) => {
                  const p = calculateWirePath(wire);
                  if (!p) return null;
                  const isSelected = selectedWireId === wire.id;

                  return (
                    <g
                      key={wire.id}
                      className="cursor-pointer pointer-events-auto group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWireId(wire.id);
                        setSelectedInstanceId(null);
                      }}
                    >
                      {/* Invisible thicker hit-testing stroke */}
                      <path d={p.d} stroke="transparent" strokeWidth="20" fill="none" />
                      {/* Outer Wire Shadow */}
                      <path
                        d={p.d}
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth={isSelected ? 7 : 5}
                        fill="none"
                        strokeLinecap="round"
                        transform="translate(0, 2)"
                      />
                      {/* Visible Wire */}
                      <path
                        d={p.d}
                        stroke={p.color}
                        strokeWidth={isSelected ? 6 : 4}
                        fill="none"
                        strokeLinecap="round"
                        className="transition-all group-hover:stroke-width-[5px]"
                      />
                      {/* Live Electron Flow Simulation */}
                      {isSimulating && (
                        <path
                          d={p.d}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 3 : 2}
                          strokeDasharray="4 8"
                          fill="none"
                          strokeLinecap="round"
                          className="animate-dash"
                          opacity="0.85"
                        />
                      )}
                      {/* End Terminals Rings */}
                      <circle cx={p.startX} cy={p.startY} r={isSelected ? 5.5 : 4} fill={p.color} stroke="#fff" strokeWidth="1" />
                      <circle cx={p.endX} cy={p.endY} r={isSelected ? 5.5 : 4} fill={p.color} stroke="#fff" strokeWidth="1" />
                    </g>
                  );
                })}

                {/* Rubber-band Wire in progress following cursor */}
                {pendingPath && (
                  <g>
                    <path
                      d={pendingPath.d}
                      stroke={pendingPath.color}
                      strokeWidth="4"
                      strokeDasharray="6 4"
                      fill="none"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <circle
                      cx={pendingPath.startX}
                      cy={pendingPath.startY}
                      r="14"
                      fill="none"
                      stroke={pendingPath.color}
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.6"
                    />
                    <circle
                      cx={pendingPath.startX}
                      cy={pendingPath.startY}
                      r="6.5"
                      fill={pendingPath.color}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={pendingPath.endX}
                      cy={pendingPath.endY}
                      r="5"
                      fill={pendingPath.color}
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>

              {/* Rubberband Marquee Selection Rectangle */}
              {marqueeBox && (
                <div
                  style={{
                    left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
                    top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
                    width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
                    height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`
                  }}
                  className="absolute z-40 border-2 border-[#0084FF] bg-[#0084FF]/15 pointer-events-none rounded-xs border-dashed animate-in fade-in"
                />
              )}

              {/* Placed Interactive Components on Workplane (Wrapped with dnd-kit) */}
              {components.map((comp) => {
                const isSelected = selectedInstanceIds.includes(comp.instanceId);
                const isMovingWithGroup =
                  activeDragDelta &&
                  activeDragDelta.movingIds &&
                  activeDragDelta.movingIds.includes(comp.instanceId) &&
                  activeDragDelta.id !== comp.instanceId;
                const groupDragOffset = isMovingWithGroup
                  ? { dx: activeDragDelta.dx, dy: activeDragDelta.dy }
                  : null;

                return (
                  <DraggableComponent
                    key={comp.instanceId}
                    component={comp}
                    isSelected={isSelected}
                    isGrouped={!!comp.groupId}
                    groupDragOffset={groupDragOffset}
                    isSimulating={isSimulating}
                    ledState={ledState}
                    zoomScale={zoomScale}
                    isWireToolActive={isWireToolActive}
                    pendingWireStart={pendingWireStart}
                    onSelect={(e) => handleComponentSelect(comp.instanceId, e)}
                    onRotate={handleRotateSelected}
                    onDelete={handleDeleteSelected}
                    onUngroup={handleUngroupSelected}
                    onPinClick={handlePinClick}
                    onUpdateState={(nextState) => {
                      setComponents((prev) =>
                        prev.map((c) =>
                          c.instanceId === comp.instanceId
                            ? { ...c, state: { ...c.state, ...nextState } }
                            : c
                        )
                      );
                    }}
                  />
                );
              })}

              {/* Floating Tinkercad Wire Properties Inspector when wire is selected */}
              {selectedWire && selectedWirePath && (
                <div
                  style={{
                    left: `${Math.min(2400, Math.max(30, (selectedWirePath.startX + selectedWirePath.endX) / 2 - 120))}px`,
                    top: `${Math.min(1500, Math.max(30, (selectedWirePath.startY + selectedWirePath.endY) / 2 - 95))}px`
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-50 bg-[#1E293B]/95 border-2 border-[#0084FF] rounded-xl p-3 shadow-2xl backdrop-blur-md text-white w-64 select-none animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white"
                        style={{ backgroundColor: TINKERCAD_WIRE_COLORS[selectedWire.color]?.hex || '#10B981' }}
                      />
                      <span className="text-xs font-bold tracking-wide">Wire Properties</span>
                    </div>
                    <button
                      onClick={() => setSelectedWireId(null)}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Endpoints connection info */}
                  <div className="text-[10px] text-slate-300 font-mono mb-2 bg-slate-900/80 px-2 py-1 rounded border border-slate-700/60 truncate">
                    {selectedWire.fromPin
                      ? `${selectedWire.fromPin}`
                      : `(${Math.round(selectedWirePath.startX)}, ${Math.round(selectedWirePath.startY)})`}{' '}
                    ➔{' '}
                    {selectedWire.toPin
                      ? `${selectedWire.toPin}`
                      : `(${Math.round(selectedWirePath.endX)}, ${Math.round(selectedWirePath.endY)})`}
                  </div>

                  {/* 12 Wire Colors Palette */}
                  <div className="mb-2.5">
                    <div className="text-[10px] text-slate-300 font-bold mb-1">Color:</div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {(Object.keys(TINKERCAD_WIRE_COLORS) as WireColorType[]).map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setWireColor(col);
                            const updated = wires.map((w) =>
                              w.id === selectedWire.id ? { ...w, color: col } : w
                            );
                            setWires(updated);
                            pushHistory(components, updated);
                          }}
                          style={{ backgroundColor: TINKERCAD_WIRE_COLORS[col].hex }}
                          className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                            selectedWire.color === col
                              ? 'scale-110 ring-2 ring-white border-white'
                              : 'border-slate-700 hover:scale-105'
                          }`}
                          title={TINKERCAD_WIRE_COLORS[col].name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Wire Style: Normal, Hookup 90, Alligator */}
                  <div className="mb-3">
                    <div className="text-[10px] text-slate-300 font-bold mb-1">Style:</div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                      {(['normal', 'hookup', 'alligator'] as WireStyleType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setWireType(type);
                            const updated = wires.map((w) =>
                              w.id === selectedWire.id ? { ...w, wireType: type } : w
                            );
                            setWires(updated);
                            pushHistory(components, updated);
                          }}
                          className={`py-1 px-1 rounded text-center capitalize transition-colors cursor-pointer border ${
                            (selectedWire.wireType || 'normal') === type
                              ? 'bg-[#0084FF] border-[#0084FF] text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {type === 'hookup' ? '90° Hookup' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delete Wire button */}
                  <button
                    onClick={() => handleDeleteSelected()}
                    className="w-full py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Wire (Del)</span>
                  </button>
                </div>
              )}

              {/* Ghost Component Preview when in click-to-place mode */}
              {placingCatalogItem && (
                <div
                  style={{
                    left: `${cursorPos.x - (COMPONENT_DIMENSIONS[placingCatalogItem.id]?.w || 80) / 2}px`,
                    top: `${cursorPos.y - (COMPONENT_DIMENSIONS[placingCatalogItem.id]?.h || 80) / 2}px`
                  }}
                  className="absolute pointer-events-none z-50 opacity-70 ring-2 ring-[#0084FF] ring-dashed rounded-xl shadow-2xl scale-[1.02]"
                >
                  <div className="bg-[#0084FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-t-md flex items-center justify-between">
                    <span>Place: {placingCatalogItem.name}</span>
                    <span className="text-[9px] opacity-80">(Click canvas to drop)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Collapsible Code Panel with Arduino C++ and MicroPython */}
          {codeDrawerOpen && (
            <aside className="w-96 lg:w-[480px] bg-[#1E293B] text-slate-100 border-l border-slate-700 flex flex-col z-40 shrink-0 shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="p-3 bg-[#0F172A] border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Firmware Code
                  </span>

                  <select
                    value={languageMode}
                    onChange={(e) => setLanguageMode(e.target.value as any)}
                    className="bg-slate-800 text-xs text-slate-200 font-semibold px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-[#0084FF]"
                  >
                    <option value="cpp">Arduino C++ (.ino)</option>
                    <option value="python">MicroPython (.py)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFirmware}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setCodeDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 p-3 overflow-auto font-mono text-xs leading-relaxed bg-[#0B0F17] text-slate-200">
                <pre className="whitespace-pre">{currentFirmwareCode}</pre>
              </div>

              {/* Serial Monitor at Bottom */}
              <div className="border-t border-slate-700 bg-[#0F172A] p-2.5">
                <div
                  onClick={() => setSerialOpen(!serialOpen)}
                  className="flex items-center justify-between cursor-pointer select-none pb-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-[#0084FF]" />
                    <span>Serial Monitor</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>9600 baud</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSerialLogs(['[Serial Cleared]']);
                      }}
                      className="hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {serialOpen && (
                  <div className="mt-2 h-28 bg-[#070A0F] rounded-lg p-2 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-0.5 border border-slate-800">
                    {serialLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* 4. Right Components Tray (Components: Basic, Arduino, Starters, All) */}
          {componentsDrawerOpen && (
            <aside className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-40 shrink-0 shadow-sm animate-in slide-in-from-right duration-200">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Components Library
                  </span>
                  <button
                    onClick={() => setComponentsDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 p-1.5 rounded border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-[#0084FF] mb-2 cursor-pointer"
                >
                  <option value="Basic">Components: Basic</option>
                  <option value="Arduino">Components: Arduino</option>
                  <option value="Starters">Starters: Circuits (Pre-wired)</option>
                  <option value="Tutorials">Video Tutorials & Masterclasses</option>
                  <option value="All">Components: All</option>
                </select>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={componentSearch}
                    onChange={(e) => setComponentSearch(e.target.value)}
                    placeholder="Search components & starters..."
                    className="w-full pl-8 pr-2 py-1 rounded bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#0084FF]"
                  />
                </div>
              </div>

              {/* Component, Starter or Tutorial Items */}
              <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
                {selectedCategory === 'Tutorials' ? (
                  <>
                    <div className="text-[10px] text-slate-400 px-1 font-semibold uppercase tracking-wider">
                      Tinkercad Video Masterclasses:
                    </div>
                    {TUTORIAL_VIDEOS.filter((t) =>
                      componentSearch === '' ||
                      t.title.toLowerCase().includes(componentSearch.toLowerCase()) ||
                      t.description.toLowerCase().includes(componentSearch.toLowerCase())
                    ).map((tut) => (
                      <div
                        key={tut.id}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#0084FF] transition-all bg-white dark:bg-slate-800/80 group shadow-2xs space-y-2"
                      >
                        <div className="relative rounded-md overflow-hidden bg-slate-900 aspect-video">
                          <img
                            src={tut.thumbnailUrl}
                            alt={tut.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <button
                              onClick={() => setActiveTutorialModal(tut)}
                              className="w-8 h-8 rounded-full bg-[#0084FF]/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                              title="Play Video Tutorial"
                            >
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] font-bold">
                            {tut.duration}
                          </span>
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#0084FF]/90 text-white text-[9px] font-bold">
                            {tut.level}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug line-clamp-2">
                            {tut.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {tut.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => setActiveTutorialModal(tut)}
                            className="flex-1 py-1.5 rounded-md bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
                          >
                            <Video className="w-3 h-3" />
                            <span>Watch Video</span>
                          </button>
                          {tut.circuitStarterId && (
                            <button
                              onClick={() => {
                                const starter = CIRCUIT_STARTERS.find((s) => s.id === tut.circuitStarterId);
                                if (starter) handleLoadStarter(starter);
                              }}
                              className="py-1.5 px-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                              title="Load Starter Circuit into Canvas"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Tinker</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : selectedCategory === 'Starters' ? (
                  <>
                    <div className="text-[10px] text-slate-400 px-1 font-semibold">
                      CLICK TO LOAD COMPLETE CIRCUIT STARTERS:
                    </div>
                    {CIRCUIT_STARTERS.map((starter) => (
                      <div
                        key={starter.id}
                        onClick={() => handleLoadStarter(starter)}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#0084FF] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer bg-white dark:bg-slate-800/80 group shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg shrink-0">
                            {starter.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-[#0084FF]">
                              {starter.name}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {starter.components.length} parts • Pre-wired
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {starter.description}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-[10px] text-slate-400 px-1 font-semibold">
                      DRAG OR CLICK TO PLACE ON WORKPLANE:
                    </div>

                    {filteredCatalog.map((comp) => {
                      const isSelectedForPlacement = placingCatalogItem?.id === comp.id;

                      return (
                        <div
                          key={comp.id}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', comp.id);
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onClick={() => {
                            if (isSelectedForPlacement) {
                              setPlacingCatalogItem(null);
                            } else {
                              setPlacingCatalogItem(comp);
                              addSerialLog(`Ready to place ${comp.name}. Click workplane to position.`);
                            }
                          }}
                          className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-grab active:cursor-grabbing group shadow-2xs ${
                            isSelectedForPlacement
                              ? 'border-[#0084FF] bg-blue-50 dark:bg-blue-950/40 ring-2 ring-[#0084FF]'
                              : 'border-slate-200 dark:border-slate-800 hover:border-[#0084FF] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 bg-white dark:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                              {comp.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-[#0084FF]">
                                {comp.name}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {comp.category} • Drag or click
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddComponent(comp);
                                addSerialLog(`[ADDED] Placed ${comp.name} on canvas`);
                              }}
                              className="px-2 py-1 rounded bg-[#0084FF] hover:bg-[#0070D6] text-white text-[10px] font-bold shadow-xs transition-colors cursor-pointer"
                              title="Instantly add component to canvas center"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </aside>
          )}
        </div>
      </DndContext>

      {/* Tutorial Video Player Modal (if active) */}
      {activeTutorialModal && (
        <TutorialVideoPlayerModal
          tutorial={activeTutorialModal}
          onClose={() => setActiveTutorialModal(null)}
          onTinkerCircuit={(starterId) => {
            const starter = CIRCUIT_STARTERS.find((s) => s.id === starterId);
            if (starter) {
              handleLoadStarter(starter);
            }
          }}
        />
      )}
    </div>
  );
};
