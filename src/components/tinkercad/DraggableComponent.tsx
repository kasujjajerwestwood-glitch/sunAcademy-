import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { RotateCw, Trash2, Layers, Unlink } from 'lucide-react';
import { PlacedComponent } from '../../types/builder';
import { ComponentVisual } from './ComponentVisual';
import { getComponentPins } from '../../lib/componentPins';

interface DraggableComponentProps {
  component: PlacedComponent;
  isSelected: boolean;
  isSimulating: boolean;
  ledState: boolean;
  zoomScale: number;
  isWireToolActive: boolean;
  pendingWireStart: { instanceId?: string; pin?: string; x?: number; y?: number } | null;
  groupDragOffset?: { dx: number; dy: number } | null;
  isGrouped?: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onRotate?: () => void;
  onDelete?: () => void;
  onUngroup?: () => void;
  onPinClick: (instanceId: string, pinName: string, relX: number, relY: number, e: React.MouseEvent) => void;
  onUpdateState: (newState: Partial<NonNullable<PlacedComponent['state']>>) => void;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isSelected,
  isSimulating,
  ledState,
  zoomScale,
  isWireToolActive,
  pendingWireStart,
  groupDragOffset,
  isGrouped,
  onSelect,
  onRotate,
  onDelete,
  onUngroup,
  onPinClick,
  onUpdateState
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.instanceId,
    data: { component }
  });

  const pins = getComponentPins(component.componentId);

  // Compute position including active dnd-kit transform OR group drag offset
  const offsetDx = transform ? transform.x / zoomScale : (groupDragOffset ? groupDragOffset.dx : 0);
  const offsetDy = transform ? transform.y / zoomScale : (groupDragOffset ? groupDragOffset.dy : 0);
  const currentX = component.x + offsetDx;
  const currentY = component.y + offsetDy;

  return (
    <div
      ref={setNodeRef}
      style={{
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: `rotate(${component.rotation}deg)`
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(e);
      }}
      className={`absolute z-20 select-none transition-shadow rounded-xl ${
        isDragging || groupDragOffset
          ? 'cursor-grabbing opacity-90 scale-105 z-50 ring-2 ring-[#0084FF] shadow-2xl'
          : 'cursor-grab active:cursor-grabbing'
      } ${
        isSelected
          ? 'ring-2 ring-[#0084FF] shadow-2xl scale-[1.01]'
          : isGrouped || component.groupId
          ? 'ring-1 ring-cyan-500/40'
          : 'hover:shadow-md'
      }`}
      {...listeners}
      {...attributes}
    >
      {/* Floating CAD dimension & quick action toolbar when selected */}
      {isSelected && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: `rotate(-${component.rotation}deg)`,
            transformOrigin: 'bottom left'
          }}
          className="absolute -top-8 left-0 z-50 px-2 py-0.5 rounded-md bg-slate-900/95 text-white text-[10px] font-mono shadow-xl border border-[#0084FF] whitespace-nowrap flex items-center gap-1.5 animate-in fade-in"
        >
          <span className="text-[#0084FF] font-bold">X:</span> {Math.round(currentX)}px
          <span className="text-[#0084FF] font-bold">Y:</span> {Math.round(currentY)}px
          <span className="text-amber-400 font-bold">{component.rotation}°</span>

          {component.groupId && (
            <>
              <div className="w-px h-3 bg-slate-700 mx-0.5" />
              <span className="px-1 py-0.2 rounded bg-purple-500/30 text-purple-300 font-bold text-[9px] flex items-center gap-0.5">
                <Layers className="w-2.5 h-2.5" />
                <span>Group</span>
              </span>
            </>
          )}

          <div className="w-px h-3 bg-slate-700 mx-0.5" />

          {onRotate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRotate();
              }}
              className="p-1 rounded hover:bg-[#0084FF]/30 text-white bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 font-sans text-[10px] font-bold"
              title="Rotate 90° (Hotkey: R)"
            >
              <RotateCw className="w-3 h-3 text-[#0084FF]" />
              <span>Rotate 90°</span>
            </button>
          )}

          {component.groupId && onUngroup && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUngroup();
              }}
              className="p-1 rounded hover:bg-purple-500/30 text-purple-300 bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 font-sans text-[10px] font-bold"
              title="Ungroup (Ctrl+Shift+G)"
            >
              <Unlink className="w-3 h-3" />
              <span>Ungroup</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded hover:bg-red-500/30 text-red-400 bg-slate-800 transition-colors cursor-pointer"
              title="Delete Component (Del)"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Physical Component Renderer */}
      <ComponentVisual
        component={component}
        isSimulating={isSimulating}
        ledState={ledState}
        onUpdateState={onUpdateState}
      />

      {/* Interactive Pin Terminals */}
      {pins.map((pin) => {
        const isWireSource =
          pendingWireStart?.instanceId === component.instanceId &&
          pendingWireStart?.pin === pin.name;

        return (
          <button
            key={pin.name}
            type="button"
            onPointerDown={(e) => e.stopPropagation()} // Prevent dnd-kit drag start when clicking pin to wire
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(component.instanceId, pin.name, pin.relX, pin.relY, e);
            }}
            style={{
              left: `${pin.relX - 7}px`,
              top: `${pin.relY - 7}px`
            }}
            className={`absolute w-3.5 h-3.5 rounded-full border-2 transition-transform cursor-crosshair z-30 flex items-center justify-center group ${
              isWireSource
                ? 'bg-[#0084FF] border-white scale-140 animate-ping ring-2 ring-white'
                : 'bg-slate-900 border-amber-300 hover:scale-130 hover:border-white shadow-xs'
            }`}
            title={`Pin: ${pin.name} (${pin.type}) - Click to wire`}
          >
            <span className="w-1 h-1 rounded-full bg-white opacity-80" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md">
              {pin.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
