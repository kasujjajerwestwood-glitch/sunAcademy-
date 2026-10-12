import React from 'react';
import { PlacedComponent } from '../../types/builder';
import { Activity, Gauge, Zap } from 'lucide-react';

interface ComponentVisualProps {
  component: PlacedComponent;
  isSimulating: boolean;
  ledState: boolean;
  onUpdateState?: (newState: Partial<NonNullable<PlacedComponent['state']>>) => void;
}

// Resistor 4-Band Color Code Calculator for high physical fidelity
const getResistorBands = (valStr: string = '220Ω') => {
  const clean = valStr.toLowerCase().replace(/\s/g, '');
  if (clean.includes('10k')) return { b1: '#854D0E', b2: '#0F172A', b3: '#EA580C', b4: '#EAB308', name: '10kΩ' }; // Brown Black Orange Gold
  if (clean.includes('1k')) return { b1: '#854D0E', b2: '#0F172A', b3: '#DC2626', b4: '#EAB308', name: '1kΩ' }; // Brown Black Red Gold
  if (clean.includes('330')) return { b1: '#EA580C', b2: '#EA580C', b3: '#854D0E', b4: '#EAB308', name: '330Ω' }; // Orange Orange Brown Gold
  if (clean.includes('4.7k') || clean.includes('4700')) return { b1: '#CA8A04', b2: '#7E22CE', b3: '#DC2626', b4: '#EAB308', name: '4.7kΩ' }; // Yellow Violet Red Gold
  if (clean.includes('100k')) return { b1: '#854D0E', b2: '#0F172A', b3: '#CA8A04', b4: '#EAB308', name: '100kΩ' }; // Brown Black Yellow Gold
  if (clean.includes('1m')) return { b1: '#854D0E', b2: '#0F172A', b3: '#16A34A', b4: '#EAB308', name: '1MΩ' }; // Brown Black Green Gold
  if (clean.includes('100')) return { b1: '#854D0E', b2: '#0F172A', b3: '#854D0E', b4: '#EAB308', name: '100Ω' }; // Brown Black Brown Gold
  // Default 220Ω
  return { b1: '#DC2626', b2: '#DC2626', b3: '#854D0E', b4: '#EAB308', name: '220Ω' }; // Red Red Brown Gold
};

export const ComponentVisual: React.FC<ComponentVisualProps> = ({
  component,
  isSimulating,
  ledState,
  onUpdateState
}) => {
  const { componentId, state, customValue, color } = component;

  // 1. ARDUINO UNO R3 - High-Realism Physical CAD Vector Model
  if (componentId === 'comp-arduino-uno') {
    return (
      <div className="w-[285px] h-[190px] bg-[#00818A] dark:bg-[#007A87] rounded-xl p-3 text-white flex flex-col justify-between border-[3px] border-[#00606B] shadow-xl select-none relative overflow-hidden">
        {/* PCB Silkscreen Texture & Ground Pour Hatching */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:10px_10px]" />
        
        {/* Top Header Silkscreen Labels & Pin Strip */}
        <div className="flex items-center justify-between z-10 border-b border-white/20 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-black tracking-wider font-mono text-white drop-shadow-xs">SUN ACADEMY</span>
            <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1 py-0.5 rounded shadow-xs">UNO R3</span>
          </div>
          <div className="text-[8px] font-mono tracking-wider font-bold opacity-90 text-amber-200">
            DIGITAL (PWM ~)
          </div>
        </div>

        {/* Middle Hardware Components: USB Type-B, DC Barrel Jack, ATmega328P, Crystal Oscillator, LEDs */}
        <div className="flex items-center justify-between my-auto z-10 px-1 py-1">
          {/* Left Column: USB Type-B Port + 9V DC Jack + Reset Button */}
          <div className="flex flex-col gap-2">
            {/* Metallic Silver USB Type-B Port */}
            <div className="w-14 h-7 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-2 border-slate-500 rounded-sm flex items-center justify-between px-1.5 shadow-md relative">
              <div className="w-1 h-3 bg-slate-500/60 rounded-xs" />
              <span className="text-[7.5px] font-mono text-slate-800 font-extrabold tracking-tighter">USB</span>
              <div className="w-1 h-3 bg-slate-500/60 rounded-xs" />
              {isSimulating && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)] animate-ping" />
              )}
            </div>

            {/* Black DC Barrel Power Jack */}
            <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-sm border-2 border-slate-950 flex items-center justify-center shadow-lg relative">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-amber-600 shadow-inner" />
              </div>
              <span className="absolute -bottom-2 text-[6.5px] text-slate-300 font-mono font-bold">DC 9V</span>
            </div>
          </div>

          {/* Center Column: ATmega328P DIP-28 Dual In-line IC Package */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-12 bg-[#12161A] border-2 border-slate-700 rounded-sm flex flex-col items-center justify-center shadow-2xl relative px-1">
              {/* DIP Top & Bottom 14 Silver Lead Pins */}
              <div className="absolute -top-1 inset-x-2 flex justify-between pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="w-1 h-1.5 bg-gradient-to-b from-slate-300 to-slate-500 rounded-xs" />
                ))}
              </div>
              <div className="absolute -bottom-1 inset-x-2 flex justify-between pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="w-1 h-1.5 bg-gradient-to-t from-slate-300 to-slate-500 rounded-xs" />
                ))}
              </div>

              {/* IC Notch & White Silkscreen Typography */}
              <div className="absolute left-1 w-1.5 h-3 bg-slate-800 rounded-r-full" />
              <span className="text-[9px] font-mono text-slate-200 font-extrabold tracking-widest">ATmega328P</span>
              <span className="text-[6.5px] font-mono text-slate-400">MICROCHIP AVR</span>
            </div>

            {/* 16.000 MHz Silver Oval Crystal Oscillator */}
            <div className="w-9 h-3.5 mt-1.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full border border-slate-500 flex items-center justify-center shadow-xs">
              <span className="text-[6px] font-mono font-bold text-slate-700">16.000</span>
            </div>
          </div>

          {/* Right Column: LED Status Indicators + Reset Button */}
          <div className="flex flex-col gap-1.5 items-end text-[7.5px] font-mono">
            {/* Red Momentary Reset Pushbutton */}
            <div className="w-5 h-5 bg-slate-300 border border-slate-500 rounded-xs flex items-center justify-center shadow-sm">
              <div className="w-3 h-3 rounded-full bg-red-600 border border-red-700 shadow-inner" />
            </div>

            {/* Power ON LED */}
            <div className="flex items-center gap-1.5 bg-slate-900/40 px-1.5 py-0.5 rounded border border-white/10">
              <span className="font-bold text-emerald-300">ON</span>
              <span
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  isSimulating
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]'
                    : 'bg-emerald-950 border border-emerald-800'
                }`}
              />
            </div>

            {/* Pin 13 "L" Indicator LED */}
            <div className="flex items-center gap-1.5 bg-slate-900/40 px-1.5 py-0.5 rounded border border-white/10">
              <span className="font-bold text-amber-300">L (13)</span>
              <span
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  isSimulating && ledState
                    ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]'
                    : 'bg-amber-950 border border-amber-800'
                }`}
              />
            </div>

            {/* TX / RX Serial Flashers */}
            <div className="flex items-center gap-1 bg-slate-900/40 px-1 py-0.5 rounded border border-white/10">
              <span className="text-[6.5px] text-slate-300">TX/RX</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-950'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Bottom Silkscreen Header Labels */}
        <div className="flex items-center justify-between text-[8px] font-mono font-bold opacity-90 z-10 pt-1 border-t border-white/20 text-cyan-200">
          <span>POWER (5V / GND / VIN)</span>
          <span>ANALOG IN (A0 - A5)</span>
        </div>
      </div>
    );
  }

  // 2. BREADBOARD SMALL (30 Columns) - Real Solderless Prototyping Grid
  if (componentId === 'comp-breadboard') {
    return (
      <div className="w-[310px] h-[155px] bg-[#FAF8F5] dark:bg-[#E8E6E3] border-[3px] border-[#D1CCC4] rounded-lg p-2.5 shadow-xl text-slate-800 select-none relative flex flex-col justify-between">
        {/* Brand Name Silkscreen Header */}
        <div className="text-[9px] font-black tracking-widest text-slate-600 font-mono text-center border-b border-slate-300/80 pb-0.5">
          SUN ACADEMY SOLDERLESS BREADBOARD
        </div>

        {/* Top Power Distribution Rails (+ Red / - Blue) */}
        <div className="flex flex-col gap-1 my-1 px-1 bg-slate-100/70 dark:bg-slate-300/50 rounded p-1 border border-slate-200">
          <div className="flex items-center justify-between text-[8px] font-mono font-black text-red-600">
            <span>+</span>
            <div className="h-0.5 bg-red-500 flex-1 mx-2 rounded-full" />
            <span className="text-[7px] text-slate-400 font-bold">POWER (+)</span>
            <div className="h-0.5 bg-red-500 flex-1 mx-2 rounded-full" />
            <span>+</span>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono font-black text-blue-700">
            <span>-</span>
            <div className="h-0.5 bg-blue-600 flex-1 mx-2 rounded-full" />
            <span className="text-[7px] text-slate-400 font-bold">GROUND (-)</span>
            <div className="h-0.5 bg-blue-600 flex-1 mx-2 rounded-full" />
            <span>-</span>
          </div>
        </div>

        {/* Upper Terminal Tie-Point Rows (a-e, cols 1-30) */}
        <div className="h-7 bg-white dark:bg-slate-100 rounded border border-slate-300/80 flex items-center justify-between px-2 text-[7.5px] font-mono font-bold text-slate-600 shadow-inner">
          <span className="text-blue-600 font-extrabold">a-e</span>
          <span className="text-slate-400 tracking-wider">1 • • • 5 • • • 10 • • • 15 • • • 20 • • • 25 • • • 30</span>
          <span className="text-blue-600 font-extrabold">a-e</span>
        </div>

        {/* Center IC DIP Isolation Trough */}
        <div className="h-1.5 bg-[#C5BFB5] mx-1 rounded-full shadow-inner my-0.5" />

        {/* Lower Terminal Tie-Point Rows (f-j, cols 1-30) */}
        <div className="h-7 bg-white dark:bg-slate-100 rounded border border-slate-300/80 flex items-center justify-between px-2 text-[7.5px] font-mono font-bold text-slate-600 shadow-inner">
          <span className="text-blue-600 font-extrabold">f-j</span>
          <span className="text-slate-400 tracking-wider">1 • • • 5 • • • 10 • • • 15 • • • 20 • • • 25 • • • 30</span>
          <span className="text-blue-600 font-extrabold">f-j</span>
        </div>

        {/* Bottom Power Distribution Rails (+ Red / - Blue) */}
        <div className="flex flex-col gap-1 px-1 pt-1 bg-slate-100/70 dark:bg-slate-300/50 rounded p-1 border border-slate-200 mt-1">
          <div className="flex items-center justify-between text-[8px] font-mono font-black text-red-600">
            <span>+</span>
            <div className="h-0.5 bg-red-500 flex-1 mx-2 rounded-full" />
            <span>+</span>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono font-black text-blue-700">
            <span>-</span>
            <div className="h-0.5 bg-blue-600 flex-1 mx-2 rounded-full" />
            <span>-</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. BREADBOARD MINI (17 Columns)
  if (componentId === 'comp-breadboard-mini') {
    return (
      <div className="w-[190px] h-[110px] bg-[#FAF8F5] dark:bg-[#E8E6E3] border-[3px] border-[#D1CCC4] rounded-lg p-2 shadow-lg text-slate-800 select-none relative flex flex-col justify-between">
        <div className="text-[8px] font-black tracking-wider text-slate-600 font-mono text-center">
          SUN ACADEMY MINI 170 TIE-POINT
        </div>
        <div className="h-7 bg-white dark:bg-slate-100 rounded border border-slate-300 flex items-center justify-around text-[8px] font-mono text-slate-500 shadow-inner px-1 font-bold">
          <span>a-e [1-17]</span>
        </div>
        <div className="h-1 bg-[#C5BFB5] mx-1 rounded-full" />
        <div className="h-7 bg-white dark:bg-slate-100 rounded border border-slate-300 flex items-center justify-around text-[8px] font-mono text-slate-500 shadow-inner px-1 font-bold">
          <span>f-j [1-17]</span>
        </div>
      </div>
    );
  }

  // 4. 5mm LED - Realistic Epoxy Colored Bulb with Radial Glow
  if (componentId === 'comp-led') {
    const isLit = isSimulating && ledState;
    const bulbColor = color || 'red';
    const colorClasses: Record<string, { bg: string; glow: string; text: string; rim: string }> = {
      red: { bg: '#EF4444', glow: 'rgba(239, 68, 68, 0.95)', text: 'Red', rim: '#DC2626' },
      green: { bg: '#10B981', glow: 'rgba(16, 185, 129, 0.95)', text: 'Green', rim: '#059669' },
      blue: { bg: '#3B82F6', glow: 'rgba(59, 130, 246, 0.95)', text: 'Blue', rim: '#2563EB' },
      yellow: { bg: '#F59E0B', glow: 'rgba(245, 158, 11, 0.95)', text: 'Yellow', rim: '#D97706' },
      white: { bg: '#F8FAFC', glow: 'rgba(248, 250, 252, 0.95)', text: 'White', rim: '#CBD5E1' },
      orange: { bg: '#F97316', glow: 'rgba(249, 115, 22, 0.95)', text: 'Orange', rim: '#EA580C' }
    };
    const cInfo = colorClasses[bulbColor] || colorClasses.red;

    return (
      <div className="w-[80px] h-[92px] flex flex-col items-center justify-center select-none relative">
        {/* 5mm Translucent Dome Lens with Specular Highlight & Internal Anvil */}
        <div
          className="w-11 h-11 rounded-t-full rounded-b-md border-2 transition-all duration-150 flex items-center justify-center relative shadow-md"
          style={{
            backgroundColor: cInfo.bg,
            borderColor: cInfo.rim,
            boxShadow: isLit
              ? `0 0 35px 8px ${cInfo.glow}, inset 0 0 14px rgba(255,255,255,0.9)`
              : 'inset 0 4px 6px rgba(255,255,255,0.4)',
            opacity: isLit ? 1 : 0.8
          }}
        >
          {/* Specular curved reflection gloss highlight */}
          <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white/60 -rotate-12 pointer-events-none" />
          
          {/* Internal Anvil & Post metal reflection */}
          <div className="w-4 h-3 border-b-2 border-r-2 border-white/40 rounded-xs pointer-events-none" />

          {isLit && (
            <div className="w-4 h-4 rounded-full bg-white animate-pulse shadow-[0_0_12px_#fff]" />
          )}
        </div>

        {/* Metallic Lead Legs: Anode (+) & Cathode (-) with Flat Edge Notch */}
        <div className="flex justify-between w-6 h-6 mt-0.5">
          {/* Shorter Cathode (-) leg */}
          <div className="w-0.5 h-4 bg-gradient-to-b from-slate-300 to-slate-400 shadow-xs" />
          {/* Longer Anode (+) leg */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-300 to-slate-400 shadow-xs" />
        </div>
        <span className="text-[8px] font-mono font-bold text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-800 shadow-2xs">
          {cInfo.text} LED
        </span>
      </div>
    );
  }

  // 5. RGB LED (4 Pins) - Dynamic Spectrum Light Emission
  if (componentId === 'comp-led-rgb') {
    const isLit = isSimulating;
    return (
      <div className="w-[96px] h-[98px] flex flex-col items-center justify-center select-none relative">
        <div
          className="w-12 h-12 rounded-t-full rounded-b-md border-2 border-slate-300 flex items-center justify-center shadow-lg relative"
          style={{
            background: isLit
              ? 'radial-gradient(circle, #ffffff 15%, #A855F7 50%, #3B82F6 85%, #EF4444 100%)'
              : '#F1F5F9',
            boxShadow: isLit ? '0 0 35px 8px rgba(168,85,247,0.85), inset 0 0 10px #fff' : 'none'
          }}
        >
          <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white/70 -rotate-12" />
          <span className="text-[8px] font-mono font-black text-slate-700">RGB</span>
        </div>
        {/* 4 Silver Lead Pins: Red, Cathode (-), Green, Blue */}
        <div className="flex justify-between w-14 h-6 mt-1">
          <div className="w-0.5 h-5 bg-red-400" title="Red" />
          <div className="w-0.5 h-6 bg-slate-500" title="Cathode (-)" />
          <div className="w-0.5 h-5 bg-emerald-400" title="Green" />
          <div className="w-0.5 h-5 bg-blue-400" title="Blue" />
        </div>
      </div>
    );
  }

  // 6. RESISTOR - Authentic Ceramic Dumbbell Body with 4 Color Code Stripes
  if (componentId === 'comp-resistor') {
    const bands = getResistorBands(customValue || '220Ω');
    return (
      <div className="w-[110px] h-[55px] flex items-center justify-center select-none relative">
        {/* Silver Through-Hole Axial Wire Leads */}
        <div className="w-full h-1 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 absolute shadow-xs" />
        
        {/* Contoured Beige Ceramic Dumbbell Body */}
        <div className="w-16 h-7 bg-[#E5D7B7] border border-[#B39D72] rounded-md relative z-10 flex items-center justify-around px-1.5 shadow-md">
          {/* Bulbous ends highlight */}
          <div className="absolute left-0 inset-y-0 w-2.5 bg-[#DECFA9] rounded-l-md border-r border-[#B39D72]/40" />
          <div className="absolute right-0 inset-y-0 w-2.5 bg-[#DECFA9] rounded-r-md border-l border-[#B39D72]/40" />

          {/* 4 Color Stripes */}
          <div className="w-1.5 h-full rounded-xs shadow-xs z-20" style={{ backgroundColor: bands.b1 }} />
          <div className="w-1.5 h-full rounded-xs shadow-xs z-20" style={{ backgroundColor: bands.b2 }} />
          <div className="w-1.5 h-full rounded-xs shadow-xs z-20" style={{ backgroundColor: bands.b3 }} />
          <div className="w-1.5 h-full rounded-xs shadow-xs z-20" style={{ backgroundColor: bands.b4 }} />
        </div>

        {/* Clear Value Badge */}
        <span className="absolute -bottom-1.5 text-[8.5px] font-mono font-black text-amber-950 dark:text-amber-200 bg-white/95 dark:bg-slate-900/95 px-1.5 py-0.2 rounded border border-amber-300/60 shadow-xs">
          {customValue || bands.name}
        </span>
      </div>
    );
  }

  // 7. CERAMIC CAPACITOR
  if (componentId === 'comp-capacitor-ceramic') {
    return (
      <div className="w-[56px] h-[60px] flex flex-col items-center justify-center select-none relative">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-900 flex items-center justify-center text-[8.5px] font-mono text-white font-extrabold shadow-md">
          104
        </div>
        <div className="flex justify-between w-4 h-4 mt-0.5">
          <div className="w-0.5 h-full bg-slate-400" />
          <div className="w-0.5 h-full bg-slate-400" />
        </div>
        <span className="text-[7px] font-mono font-bold text-amber-900 dark:text-amber-300">100nF</span>
      </div>
    );
  }

  // 8. ELECTROLYTIC CAPACITOR (Polarized Can)
  if (componentId === 'comp-capacitor-electrolytic') {
    return (
      <div className="w-[65px] h-[80px] flex flex-col items-center justify-center select-none relative">
        <div className="w-10 h-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-2 border-slate-700 rounded-sm flex flex-col items-center justify-between p-1 text-white shadow-lg relative overflow-hidden">
          {/* White Negative Stripe */}
          <div className="absolute right-1 inset-y-0 w-2 bg-slate-300/80 flex items-center justify-center">
            <span className="text-[7px] text-slate-900 font-black">-</span>
          </div>
          <span className="text-[7.5px] font-mono font-black text-cyan-300">100µF</span>
          <span className="text-[6.5px] font-mono text-slate-400">16V</span>
        </div>
        <div className="flex justify-between w-5 h-4 mt-0.5">
          <div className="w-0.5 h-full bg-slate-400" />
          <div className="w-0.5 h-full bg-slate-400" />
        </div>
      </div>
    );
  }

  // 9. DIODE 1N4007
  if (componentId === 'comp-diode') {
    return (
      <div className="w-[80px] h-[48px] flex items-center justify-center select-none relative">
        <div className="w-full h-1 bg-slate-400 absolute" />
        <div className="w-11 h-6 bg-slate-900 border border-slate-700 rounded-xs relative z-10 flex items-center justify-end pr-1 shadow-md">
          <div className="w-2 h-full bg-slate-300 rounded-r-xs" title="Cathode (-)" />
        </div>
        <span className="absolute -bottom-1.5 text-[7px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-1 rounded">1N4007</span>
      </div>
    );
  }

  // 10. TRANSISTOR NPN 2N2222 (TO-92)
  if (componentId === 'comp-transistor-npn') {
    return (
      <div className="w-[68px] h-[70px] flex flex-col items-center justify-center select-none relative">
        <div className="w-10 h-8 bg-slate-900 border border-slate-700 rounded-t-full rounded-b-xs flex items-center justify-center text-white text-[7.5px] font-mono font-extrabold shadow-md">
          2N2222
        </div>
        <div className="flex justify-between w-7 h-5 mt-0.5">
          <div className="w-0.5 h-full bg-slate-400" title="Collector" />
          <div className="w-0.5 h-full bg-slate-400" title="Base" />
          <div className="w-0.5 h-full bg-slate-400" title="Emitter" />
        </div>
        <span className="text-[6.5px] font-mono font-bold text-slate-500">NPN BJT</span>
      </div>
    );
  }

  // 11. PUSHBUTTON - Momentary Tactile Switch
  if (componentId === 'comp-pushbutton') {
    const isPressed = !!state?.buttonPressed;
    return (
      <div className="w-[86px] h-[86px] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-lg p-2 border-2 border-slate-400 dark:border-slate-700 flex flex-col items-center justify-center shadow-lg select-none relative">
        {/* 4 Corner Terminal Legs */}
        <div className="absolute -top-1 left-2 w-1.5 h-1.5 bg-slate-400 rounded-xs" />
        <div className="absolute -top-1 right-2 w-1.5 h-1.5 bg-slate-400 rounded-xs" />
        <div className="absolute -bottom-1 left-2 w-1.5 h-1.5 bg-slate-400 rounded-xs" />
        <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-slate-400 rounded-xs" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onUpdateState?.({ buttonPressed: !isPressed });
          }}
          className={`w-11 h-11 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
            isPressed
              ? 'bg-blue-600 border-blue-400 scale-90 shadow-inner ring-2 ring-blue-400/50'
              : 'bg-blue-500 border-blue-300 hover:scale-105 shadow-md active:scale-95'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/40" />
        </button>
        <span className="text-[8px] font-mono font-black text-slate-700 dark:text-slate-300 mt-1">
          {isPressed ? 'ACTIVE' : 'BUTTON'}
        </span>
      </div>
    );
  }

  // 12. SLIDE SWITCH SPDT
  if (componentId === 'comp-slideswitch') {
    const isOn = !!state?.switchState;
    return (
      <div className="w-[82px] h-[60px] bg-slate-200 dark:bg-slate-700 border-2 border-slate-400 rounded-md p-1.5 flex flex-col items-center justify-between select-none shadow-md">
        <span className="text-[7.5px] font-mono font-bold text-slate-700 dark:text-slate-200">SPDT SWITCH</span>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onUpdateState?.({ switchState: !isOn });
          }}
          className="w-14 h-5.5 bg-slate-800 rounded-full p-0.5 cursor-pointer relative shadow-inner"
        >
          <div
            className={`w-4.5 h-4.5 rounded-full transition-all duration-150 shadow-md ${
              isOn ? 'translate-x-8 bg-emerald-400' : 'translate-x-0 bg-slate-300'
            }`}
          />
        </button>
      </div>
    );
  }

  // 13. DIP SWITCH 4-POS
  if (componentId === 'comp-dipswitch') {
    return (
      <div className="w-[100px] h-[76px] bg-[#B91C1C] border-2 border-[#7F1D1D] rounded-md p-1.5 text-white flex flex-col justify-between shadow-lg select-none">
        <div className="text-[7.5px] font-mono font-black text-center tracking-wider">DIP SWITCH (4)</div>
        <div className="flex justify-around my-1">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-3.5 h-7 bg-slate-950 rounded-xs p-0.5 flex flex-col justify-between">
              <div className="w-full h-3 bg-white rounded-xs shadow-xs" />
              <span className="text-[6.5px] text-center font-bold">{n}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 14. POTENTIOMETER - Rotary Dial Knob
  if (componentId === 'comp-potentiometer') {
    const angle = state?.knobAngle ?? 135;
    return (
      <div className="w-[96px] h-[118px] bg-gradient-to-b from-blue-700 to-blue-900 rounded-xl p-2.5 border-2 border-blue-950 shadow-xl flex flex-col items-center justify-between text-white select-none">
        <div className="flex items-center justify-between w-full text-[8px] font-mono font-black text-emerald-300">
          <span>10kΩ POT</span>
          <span>{Math.round((angle / 270) * 100)}%</span>
        </div>
        {/* Round Knob with Notch Pointer */}
        <div
          className="w-13 h-13 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-slate-600 relative flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform"
          style={{ transform: `rotate(${angle - 135}deg)` }}
        >
          <div className="w-1.5 h-4 bg-blue-700 rounded-full absolute top-1 shadow-xs" />
          <div className="w-4 h-4 rounded-full bg-slate-500/40" />
        </div>
        <input
          type="range"
          min="0"
          max="270"
          value={angle}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateState?.({ knobAngle: Number(e.target.value) })}
          className="w-full h-1.5 accent-emerald-400 cursor-pointer"
        />
      </div>
    );
  }

  // 15. PHOTORESISTOR (LDR) - Cadmium Sulfide Light Sensor
  if (componentId === 'comp-photoresistor') {
    return (
      <div className="w-[58px] h-[72px] flex flex-col items-center justify-center select-none relative">
        <div className="w-9 h-9 rounded-full bg-[#E5D7B7] border-2 border-[#A16207] flex items-center justify-center shadow-md relative overflow-hidden">
          {/* Red/Orange Serpentine Track */}
          <div className="w-6 h-4 border-2 border-red-600 border-dashed rounded-xs" />
        </div>
        <div className="flex justify-between w-4 h-5 mt-1">
          <div className="w-0.5 h-full bg-slate-400" />
          <div className="w-0.5 h-full bg-slate-400" />
        </div>
        <span className="text-[7.5px] font-mono font-black text-amber-900 dark:text-amber-200">LDR SENSOR</span>
      </div>
    );
  }

  // 16. ULTRASONIC SENSOR HC-SR04 - Dual Acoustic Transducers
  if (componentId === 'comp-ultrasonic') {
    const dist = state?.distanceCm ?? 24;
    return (
      <div className="w-[125px] h-[95px] bg-[#0284C7] rounded-xl p-2.5 text-white border-2 border-[#0369A1] shadow-xl flex flex-col justify-between select-none relative">
        <div className="flex items-center justify-between">
          <span className="text-[8.5px] font-mono font-black">HC-SR04</span>
          <span className="text-[9.5px] font-mono text-amber-300 font-extrabold bg-blue-900/80 px-1.5 py-0.2 rounded">
            {dist} cm
          </span>
        </div>
        {/* Two Metallic Cylindrical Acoustic Transducers (T & R) */}
        <div className="flex items-center justify-around my-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-slate-600 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-md">
            T
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-slate-600 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-md">
            R
          </div>
        </div>
        <input
          type="range"
          min="2"
          max="150"
          value={dist}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateState?.({ distanceCm: Number(e.target.value) })}
          className="w-full h-1.5 accent-amber-300 cursor-pointer"
        />
      </div>
    );
  }

  // 17. PIR MOTION SENSOR
  if (componentId === 'comp-pir') {
    return (
      <div className="w-[105px] h-[90px] bg-[#0284C7] rounded-xl p-2 text-white border-2 border-[#0369A1] shadow-lg flex flex-col items-center justify-between select-none relative">
        <span className="text-[8px] font-mono font-bold">PIR MOTION</span>
        <div className="w-11 h-11 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-inner relative">
          <div className="w-6 h-6 rounded-full bg-slate-200/60" />
        </div>
        <span className="text-[7px] font-mono text-cyan-200 font-bold">FRESNEL LENS</span>
      </div>
    );
  }

  // 18. TEMPERATURE SENSOR TMP36
  if (componentId === 'comp-temp') {
    const temp = state?.tempCelsius ?? 25;
    return (
      <div className="w-[74px] h-[72px] bg-slate-900 border-2 border-slate-700 rounded-lg p-2 text-white flex flex-col items-center justify-between shadow-md select-none">
        <span className="text-[7.5px] font-mono text-amber-400 font-bold">TMP36</span>
        <div className="w-8 h-5 bg-slate-800 rounded-t-full border border-slate-600 flex items-center justify-center text-[7px] font-mono font-bold text-amber-300">
          {temp}°C
        </div>
        <input
          type="range"
          min="-40"
          max="125"
          value={temp}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateState?.({ tempCelsius: Number(e.target.value) })}
          className="w-full h-1 accent-orange-400 cursor-pointer"
        />
      </div>
    );
  }

  // 19. TILT SENSOR
  if (componentId === 'comp-tilt') {
    return (
      <div className="w-[58px] h-[68px] flex flex-col items-center justify-center select-none relative">
        <div className="w-7 h-9 bg-amber-500 rounded-full border-2 border-amber-700 shadow-md flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>
        <div className="flex justify-between w-4 h-4 mt-0.5">
          <div className="w-0.5 h-full bg-slate-400" />
          <div className="w-0.5 h-full bg-slate-400" />
        </div>
      </div>
    );
  }

  // 20. MICRO SERVO SG90 - Realistic Horn Rotation
  if (componentId === 'comp-servo') {
    const angle = state?.servoAngle ?? 45;
    return (
      <div className="w-[115px] h-[105px] bg-[#0284C7]/95 rounded-xl p-2.5 text-white border-2 border-blue-900 shadow-xl flex flex-col justify-between select-none relative">
        <div className="flex items-center justify-between text-[8px] font-mono font-black">
          <span>SG90 SERVO</span>
          <span className="text-amber-300">{angle}°</span>
        </div>
        {/* Rotating Horn Gear */}
        <div className="flex items-center justify-center my-1 relative h-9">
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-400 relative flex items-center justify-center shadow-md">
            <div
              className="w-2 h-9 bg-white border border-slate-400 absolute origin-bottom rounded-t shadow-sm transition-transform duration-200"
              style={{ transform: `rotate(${angle - 90}deg)` }}
            />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 z-10" />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="180"
          value={angle}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateState?.({ servoAngle: Number(e.target.value) })}
          className="w-full h-1.5 accent-amber-300 cursor-pointer"
        />
      </div>
    );
  }

  // 21. DC HOBBY MOTOR
  if (componentId === 'comp-dc-motor') {
    return (
      <div className="w-[94px] h-[90px] bg-gradient-to-b from-slate-600 to-slate-800 border-2 border-slate-500 rounded-xl p-2 text-white flex flex-col items-center justify-between shadow-xl select-none">
        <span className="text-[8px] font-mono font-bold">DC MOTOR</span>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-slate-600 relative flex items-center justify-center shadow-inner">
          <div
            className={`w-3 h-3 rounded-full bg-slate-900 ${
              isSimulating ? 'animate-spin' : ''
            }`}
          />
        </div>
        <span className="text-[7px] font-mono text-emerald-300 font-bold">
          {isSimulating ? '240 RPM' : 'IDLE'}
        </span>
      </div>
    );
  }

  // 22. PIEZO BUZZER
  if (componentId === 'comp-piezo') {
    return (
      <div className="w-[85px] h-[85px] bg-[#0F172A] rounded-full border-2 border-slate-700 shadow-xl flex flex-col items-center justify-center text-white select-none relative">
        <div className="w-5 h-5 rounded-full bg-black border border-slate-600 flex items-center justify-center">
          <span className="text-[7px] text-amber-400 font-black">+</span>
        </div>
        <span className="text-[8px] font-mono font-black text-slate-300 mt-1">BUZZER</span>
        {isSimulating && (
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping pointer-events-none opacity-50" />
        )}
      </div>
    );
  }

  // 23. RELAY 5V SPDT
  if (componentId === 'comp-relay') {
    return (
      <div className="w-[82px] h-[70px] bg-blue-700 border-2 border-blue-950 rounded-lg p-2 text-white flex flex-col justify-between shadow-lg select-none">
        <span className="text-[8px] font-mono font-black text-center">5V RELAY</span>
        <div className="text-[7px] font-mono text-center text-blue-200 font-bold">10A 250VAC</div>
        <div className="flex justify-between text-[6.5px] font-mono opacity-80">
          <span>COIL</span>
          <span>SPDT</span>
        </div>
      </div>
    );
  }

  // 24. 9V BATTERY - Heavy Duty Classic Design
  if (componentId === 'comp-battery-9v') {
    return (
      <div className="w-[85px] h-[115px] bg-gradient-to-b from-slate-900 via-slate-800 to-amber-700 rounded-xl p-2.5 border-2 border-slate-950 shadow-2xl flex flex-col justify-between text-white select-none">
        {/* Snap Terminals on Top: Hexagonal (-) and Round (+) */}
        <div className="flex justify-around items-center">
          <div className="w-3.5 h-2.5 bg-gradient-to-b from-slate-200 to-slate-400 rounded-xs border border-slate-500" title="Negative (-)" />
          <div className="w-4.5 h-2.5 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full border border-slate-500" title="Positive (+)" />
        </div>
        <div className="text-center font-black text-sm tracking-wider text-amber-300 drop-shadow-sm">9V</div>
        <div className="text-[7.5px] text-center font-mono font-bold text-slate-300">SUN HEAVY DUTY</div>
      </div>
    );
  }

  // 25. COIN CELL 3V CR2032
  if (componentId === 'comp-battery-coincell') {
    return (
      <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-400 border-2 border-slate-500 p-1 flex flex-col items-center justify-center text-slate-800 shadow-xl select-none">
        <span className="text-[8px] font-mono font-black">CR2032</span>
        <span className="text-[11px] font-black text-amber-600">3V +</span>
      </div>
    );
  }

  // 26. 1.5V AA BATTERY PACK (x4)
  if (componentId === 'comp-battery-aa') {
    return (
      <div className="w-[94px] h-[100px] bg-slate-900 border-2 border-slate-700 rounded-xl p-2 text-white flex flex-col justify-between shadow-xl select-none">
        <span className="text-[8px] font-mono font-black text-amber-400">4x AA (6V DC)</span>
        <div className="grid grid-cols-4 gap-1 h-12 my-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gradient-to-b from-amber-500 to-amber-700 rounded-xs border border-amber-900" />
          ))}
        </div>
        <span className="text-[7px] font-mono text-slate-400 text-center font-bold">6.0V SERIES</span>
      </div>
    );
  }

  // 27. 16x2 LCD DISPLAY
  if (componentId === 'comp-lcd-16x2') {
    return (
      <div className="w-[200px] h-[85px] bg-[#065F46] border-2 border-[#064E3B] rounded-xl p-2 text-white shadow-xl select-none flex flex-col justify-between">
        <div className="flex justify-between text-[7.5px] font-mono font-bold opacity-90">
          <span>16x2 I2C LCD</span>
          <span>0x27</span>
        </div>
        <div className="bg-[#487332] rounded p-1.5 font-mono text-[9px] text-[#0A2906] font-black border border-emerald-950 shadow-inner flex flex-col justify-between h-11">
          <div>Sun Academy Studio</div>
          <div className="text-emerald-950">System Online OK</div>
        </div>
      </div>
    );
  }

  // 28. 7-SEGMENT DISPLAY
  if (componentId === 'comp-7segment') {
    return (
      <div className="w-[80px] h-[100px] bg-slate-950 border-2 border-slate-800 rounded-lg p-2 text-white flex flex-col items-center justify-between shadow-xl select-none">
        <span className="text-[7px] font-mono text-slate-400">7-SEG LED</span>
        <div className="text-4xl font-mono font-black text-red-500 tracking-widest my-auto shadow-[0_0_12px_rgba(239,68,68,0.7)]">
          8.
        </div>
      </div>
    );
  }

  // 29. DIGITAL MULTIMETER
  if (componentId === 'comp-multimeter') {
    return (
      <div className="w-[105px] h-[125px] bg-amber-500 rounded-2xl p-2.5 border-2 border-amber-700 text-slate-900 flex flex-col justify-between shadow-2xl select-none">
        <div className="flex justify-between items-center text-[8.5px] font-black">
          <span>MULTIMETER</span>
          <Gauge className="w-3.5 h-3.5" />
        </div>
        <div className="bg-slate-950 text-emerald-400 rounded p-1.5 font-mono text-center text-xs font-black border border-slate-800 shadow-inner">
          {isSimulating ? '5.00 V' : '0.00 V'}
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-900 mx-auto border-2 border-slate-600 flex items-center justify-center shadow-md">
          <div className="w-1 h-3 bg-amber-400 rounded-full" />
        </div>
        <div className="flex justify-around text-[7.5px] font-bold text-slate-900">
          <span>V~</span>
          <span>A=</span>
          <span>Ω</span>
        </div>
      </div>
    );
  }

  // 30. DIGITAL OSCILLOSCOPE
  if (componentId === 'comp-oscilloscope') {
    return (
      <div className="w-[175px] h-[135px] bg-slate-950 rounded-2xl p-2.5 border-2 border-slate-700 text-white flex flex-col justify-between shadow-2xl select-none">
        <div className="flex justify-between items-center text-[8px] font-mono text-cyan-400 font-bold">
          <span>OSCILLOSCOPE 2CH</span>
          <span>100MS/s</span>
        </div>
        <div className="h-16 bg-[#04111D] border border-cyan-900/60 rounded p-1 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 160 50">
            <path
              d={
                isSimulating
                  ? 'M 0 25 Q 20 5, 40 25 T 80 25 T 120 25 T 160 25'
                  : 'M 0 25 L 160 25'
              }
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              className={isSimulating ? 'animate-pulse' : ''}
            />
          </svg>
        </div>
        <div className="flex justify-between items-center text-[7px] font-mono text-slate-400">
          <span className="text-cyan-400">CH1: 2.0V</span>
          <span className="text-amber-400">CH2: 1.0V</span>
          <span>1ms</span>
        </div>
      </div>
    );
  }

  // 31. BBC MICRO:BIT v2
  if (componentId === 'comp-microbit') {
    return (
      <div className="w-[175px] h-[155px] bg-slate-900 rounded-2xl p-2.5 border-2 border-emerald-500 text-white flex flex-col justify-between shadow-xl select-none relative overflow-hidden">
        <div className="flex justify-between items-center text-[8px] font-mono font-bold">
          <span className="text-emerald-400">BBC micro:bit</span>
          <span className="text-slate-400">v2</span>
        </div>
        <div className="flex items-center justify-between px-2 my-auto">
          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-300">
            A
          </div>
          <div className="grid grid-cols-5 gap-1 p-1 bg-black/60 rounded border border-slate-800">
            {Array.from({ length: 25 }).map((_, i) => {
              const isHeart = [1, 3, 5, 6, 7, 8, 9, 11, 12, 13, 17].includes(i);
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-xs transition-colors ${
                    isSimulating && isHeart
                      ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]'
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-300">
            B
          </div>
        </div>
        <div className="flex justify-between items-center bg-amber-600/80 rounded-b px-2 py-1 text-[7px] font-mono font-bold text-slate-900 border-t border-amber-500">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3V</span>
          <span>GND</span>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
      <Activity className="w-4 h-4 text-[#0084FF]" />
      <span className="text-xs font-bold text-slate-800 dark:text-white">{component.name}</span>
    </div>
  );
};
