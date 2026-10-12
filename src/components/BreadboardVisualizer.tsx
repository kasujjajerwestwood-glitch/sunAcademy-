import React, { useState } from 'react';
import { Part, WiringStep } from '../types';
import { CheckCircle2, Circle, Eye, Cpu, Zap } from 'lucide-react';
import { Badge } from './Badge';

interface BreadboardVisualizerProps {
  projectTitle: string;
  parts: Part[];
  wiringSteps: WiringStep[];
  className?: string;
}

export const BreadboardVisualizer: React.FC<BreadboardVisualizerProps> = ({
  projectTitle,
  parts,
  wiringSteps,
  className = ''
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  const toggleCheck = (stepNum: number) => {
    setCheckedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  return (
    <div className={`rounded-2xl border border-slate-800 bg-[#0A0E17] overflow-hidden ${className}`}>
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Circuit Schematic & Breadboard Map</h3>
            <p className="text-xs text-slate-400">
              Interactive pinout verification for {projectTitle}
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm" icon={<Zap className="w-3 h-3" />}>
          Verified Wiring
        </Badge>
      </div>

      {/* Interactive Breadboard Diagram Vector */}
      <div className="p-6 bg-[#070A0F] border-b border-slate-800 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 relative">
          {/* Breadboard Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              ARDUINO UNO R3 PIN HEADER
            </span>
            <span>400-POINT TIE BREADBOARD</span>
          </div>

          {/* SVG Diagram */}
          <div className="py-4">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-auto drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Arduino Board body */}
              <rect x="20" y="20" width="160" height="180" rx="12" fill="#0E2338" stroke="#00F0FF" strokeWidth="2" />
              <text x="35" y="45" fill="#00F0FF" fontSize="12" fontWeight="bold" fontFamily="monospace">
                ARDUINO UNO
              </text>
              <rect x="35" y="60" width="30" height="40" rx="4" fill="#334155" />
              <text x="42" y="85" fill="#94A3B8" fontSize="10" fontFamily="monospace">USB</text>

              {/* MCU Chip */}
              <rect x="75" y="115" width="65" height="25" rx="3" fill="#050B14" stroke="#64748B" strokeWidth="1" />
              <text x="82" y="131" fill="#64748B" fontSize="9" fontFamily="monospace">ATmega328P</text>

              {/* Pin Header labels */}
              <text x="145" y="55" fill="#10B981" fontSize="9" fontFamily="monospace">D9 (PWM)</text>
              <circle cx="170" cy="52" r="3.5" fill="#10B981" />
              
              <text x="145" y="80" fill="#EF4444" fontSize="9" fontFamily="monospace">5V PWR</text>
              <circle cx="170" cy="77" r="3.5" fill="#EF4444" />

              <text x="145" y="105" fill="#38BDF8" fontSize="9" fontFamily="monospace">GND</text>
              <circle cx="170" cy="102" r="3.5" fill="#38BDF8" />

              {/* Breadboard Body */}
              <rect x="230" y="20" width="350" height="180" rx="12" fill="#151D2A" stroke="#334155" strokeWidth="2" />
              
              {/* Red (+) Rail & Blue (-) Rail */}
              <rect x="245" y="30" width="320" height="12" rx="3" fill="#201217" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" />
              <text x="250" y="40" fill="#EF4444" fontSize="9" fontFamily="monospace">+ RED POWER BUS (5V)</text>

              <rect x="245" y="178" width="320" height="12" rx="3" fill="#0E1E2E" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
              <text x="250" y="188" fill="#38BDF8" fontSize="9" fontFamily="monospace">- BLUE GROUND BUS (GND)</text>

              {/* Terminal tie points matrix representation */}
              <g fill="#475569" opacity="0.4">
                {[55, 75, 95, 115, 135, 155].map((y, yi) => (
                  <React.Fragment key={yi}>
                    {[260, 290, 320, 350, 380, 410, 440, 470, 500, 530].map((x, xi) => (
                      <circle key={xi} cx={x} cy={y} r="2" />
                    ))}
                  </React.Fragment>
                ))}
              </g>

              {/* Center divider gutter */}
              <line x1="245" y1="105" x2="565" y2="105" stroke="#0B0F17" strokeWidth="4" />

              {/* Jumper Wires (Step animated highlights) */}
              {/* Ground wire */}
              <path
                d="M 170 102 C 200 102, 210 184, 245 184"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="245" cy="184" r="3.5" fill="#38BDF8" />

              {/* Signal wire (D9 to Breadboard) */}
              <path
                d="M 170 52 C 210 52, 230 75, 290 75"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="290" cy="75" r="3.5" fill="#10B981" />

              {/* Component on breadboard: 220Ω Resistor */}
              <rect x="290" y="73" width="50" height="8" rx="2" fill="#D97706" />
              <line x1="300" y1="73" x2="300" y2="81" stroke="#EF4444" strokeWidth="2" />
              <line x1="310" y1="73" x2="310" y2="81" stroke="#EF4444" strokeWidth="2" />
              <line x1="320" y1="73" x2="320" y2="81" stroke="#92400E" strokeWidth="2" />
              <circle cx="340" cy="77" r="3.5" fill="#D97706" />

              {/* LED Symbol */}
              <path
                d="M 340 77 C 355 77, 360 140, 380 140"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="380" cy="140" r="7" fill="#10B981" opacity="0.9" />
              <circle cx="380" cy="140" r="12" fill="#10B981" opacity="0.25" />

              {/* Cathode wire to GND bus */}
              <path
                d="M 380 145 C 380 165, 380 180, 410 184"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="410" cy="184" r="3" fill="#38BDF8" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Blue: GND
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Green: GPIO Logic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Red: 5V DC Supply
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Checklist */}
      <div className="p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Step-by-Step Wiring Checklist</span>
          <span className="text-cyan-400 font-mono">
            {checkedSteps.length} of {wiringSteps.length} Connected
          </span>
        </h4>

        <div className="space-y-3">
          {wiringSteps.map((step) => {
            const isDone = checkedSteps.includes(step.step);
            return (
              <div
                key={step.step}
                onClick={() => {
                  toggleCheck(step.step);
                  setActiveStep(step.step);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-slate-400 hover:text-white"
                  aria-label={`Toggle step ${step.step}`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-white">
                      Step {step.step}: {step.title}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                      {step.pins}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
