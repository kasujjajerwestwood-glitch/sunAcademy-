import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';
import { Badge } from './Badge';

interface CircuitSimulatorProps {
  type?: 'led' | 'traffic-light' | 'ultrasonic' | 'temperature' | 'plant-watering' | 'obstacle-robot';
  className?: string;
}

export const CircuitSimulator: React.FC<CircuitSimulatorProps> = ({
  type = 'led',
  className = ''
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // LED state
  const [ledDelay, setLedDelay] = useState(500); // ms
  const [ledState, setLedState] = useState(false);
  const [ledBrightness, setLedBrightness] = useState(100); // 0 - 100%

  // Traffic Light state
  const [trafficStep, setTrafficStep] = useState<'green' | 'yellow' | 'red'>('green');
  const [pedestrianRequested, setPedestrianRequested] = useState(false);

  // Ultrasonic state
  const [obstacleDistance, setObstacleDistance] = useState(18); // cm
  const [isBuzzerBeeping, setIsBuzzerBeeping] = useState(false);

  // Plant Watering state
  const [soilMoisture, setSoilMoisture] = useState(25); // %
  const [isPumping, setIsPumping] = useState(false);

  // Temperature state
  const [simTemp, setSimTemp] = useState(24.5);
  const [simHumidity, setSimHumidity] = useState(52);

  // Serial Monitor logs
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[INIT] sunAcademy Hardware Workbench Loaded',
    '[OK] Virtual Microcontroller clock: 16.00 MHz'
  ]);

  const addLog = (msg: string) => {
    setSerialLogs((prev) => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // LED Blink Loop
  useEffect(() => {
    if (!isRunning || type !== 'led') return;
    const interval = setInterval(() => {
      setLedState((prev) => {
        const next = !prev;
        addLog(`PIN 9: ${next ? 'HIGH (5.0V)' : 'LOW (0.0V)'} - Duty: ${ledBrightness}%`);
        return next;
      });
    }, ledDelay);
    return () => clearInterval(interval);
  }, [isRunning, ledDelay, type, ledBrightness]);

  // Traffic Light Loop
  useEffect(() => {
    if (!isRunning || type !== 'traffic-light') return;

    let timeout: NodeJS.Timeout;
    if (trafficStep === 'green') {
      const waitTime = pedestrianRequested ? 1500 : 4000;
      timeout = setTimeout(() => {
        setTrafficStep('yellow');
        addLog('LIGHT STATE: YELLOW (Caution)');
      }, waitTime);
    } else if (trafficStep === 'yellow') {
      timeout = setTimeout(() => {
        setTrafficStep('red');
        setPedestrianRequested(false);
        addLog('LIGHT STATE: RED (Pedestrian Walk Signal ACTIVE)');
      }, 1500);
    } else if (trafficStep === 'red') {
      timeout = setTimeout(() => {
        setTrafficStep('green');
        addLog('LIGHT STATE: GREEN (Traffic Moving)');
      }, 3500);
    }
    return () => clearTimeout(timeout);
  }, [isRunning, trafficStep, pedestrianRequested, type]);

  // Ultrasonic Proximity beep simulation
  useEffect(() => {
    if (!isRunning || type !== 'ultrasonic') return;
    let beepInterval = 0;
    if (obstacleDistance < 10) {
      beepInterval = 120; // Fast urgent beep
    } else if (obstacleDistance < 20) {
      beepInterval = 300;
    } else if (obstacleDistance < 40) {
      beepInterval = 700;
    }

    if (beepInterval === 0) {
      setIsBuzzerBeeping(false);
      return;
    }

    const interval = setInterval(() => {
      setIsBuzzerBeeping((prev) => !prev);
    }, beepInterval);
    return () => clearInterval(interval);
  }, [isRunning, obstacleDistance, type]);

  // Plant Watering pump automation
  useEffect(() => {
    if (!isRunning || type !== 'plant-watering') return;
    if (soilMoisture < 30) {
      setIsPumping(true);
      addLog(`SOIL CRITICAL (${soilMoisture}%) -> RELAY 7 ENGAGED -> PUMP ON`);
      const timer = setTimeout(() => {
        setSoilMoisture((prev) => Math.min(65, prev + 25));
        setIsPumping(false);
        addLog('PUMP CYCLE COMPLETE -> RELAY 7 RELEASED');
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsPumping(false);
    }
  }, [isRunning, soilMoisture, type]);

  return (
    <div className={`rounded-2xl border border-slate-800 bg-[#0A0E17] overflow-hidden shadow-2xl ${className}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            {isRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isRunning ? 'bg-emerald-500' : 'bg-slate-500'
              }`}
            />
          </span>
          <span className="text-sm font-semibold text-white tracking-wide">
            Interactive Circuit Workbench
          </span>
          <Badge variant="cyan" size="sm">
            Live Simulation
          </Badge>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRunning
                ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
            title={isRunning ? 'Pause simulation' : 'Start simulation'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Run'}</span>
          </button>

          <button
            onClick={() => {
              setSerialLogs(['[RESET] Hardware simulator rebooted']);
              setSoilMoisture(25);
              setObstacleDistance(18);
              setTrafficStep('green');
            }}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Reset Simulator"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Workbench Graphic Area */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-xl bg-[#070A0F] border border-slate-800/80 min-h-[260px] relative overflow-hidden bg-circuit-grid">
          {/* Circuit visual traces watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#10b981" strokeWidth="1" strokeDasharray="6 6" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 6" />
            </svg>
          </div>

          {/* Type 1: LED Simulator */}
          {type === 'led' && (
            <div className="flex flex-col items-center gap-4 z-10">
              <div className="relative">
                {/* Glow ring */}
                <div
                  className={`absolute -inset-4 rounded-full transition-all duration-300 blur-xl ${
                    ledState && isRunning
                      ? 'bg-emerald-500 opacity-80 scale-125'
                      : 'bg-transparent opacity-0 scale-100'
                  }`}
                />
                {/* Physical LED Bulb */}
                <div
                  className={`w-16 h-16 rounded-full border-2 transition-all duration-200 flex items-center justify-center shadow-lg ${
                    ledState && isRunning
                      ? 'bg-gradient-to-tr from-emerald-600 via-emerald-400 to-emerald-200 border-white text-slate-950 scale-105 shadow-emerald-500/50'
                      : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}
                  style={{
                    opacity: ledState && isRunning ? Math.max(0.3, ledBrightness / 100) : 1
                  }}
                >
                  <Sparkles className="w-7 h-7" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm font-semibold text-white">
                  Digital Pin 9: {ledState && isRunning ? 'HIGH (ON)' : 'LOW (OFF)'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Voltage: {ledState && isRunning ? (5.0 * (ledBrightness / 100)).toFixed(2) : '0.00'}V | Resistor: 220Ω
                </div>
              </div>
            </div>
          )}

          {/* Type 2: Traffic Light Simulator */}
          {type === 'traffic-light' && (
            <div className="flex flex-col items-center gap-4 z-10">
              {/* Traffic light housing */}
              <div className="w-24 p-3 bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col items-center gap-2.5">
                {/* Red */}
                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    trafficStep === 'red' && isRunning
                      ? 'bg-red-500 border-white shadow-[0_0_25px_rgba(239,68,68,0.9)] scale-105'
                      : 'bg-red-950/60 border-red-900/40 opacity-40'
                  }`}
                />
                {/* Yellow */}
                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    trafficStep === 'yellow' && isRunning
                      ? 'bg-amber-400 border-white shadow-[0_0_25px_rgba(251,191,36,0.9)] scale-105'
                      : 'bg-amber-950/60 border-amber-900/40 opacity-40'
                  }`}
                />
                {/* Green */}
                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    trafficStep === 'green' && isRunning
                      ? 'bg-emerald-500 border-white shadow-[0_0_25px_rgba(16,185,129,0.9)] scale-105'
                      : 'bg-emerald-950/60 border-emerald-900/40 opacity-40'
                  }`}
                />
              </div>

              <button
                onClick={() => {
                  setPedestrianRequested(true);
                  addLog('PEDESTRIAN BUTTON PRESSED on Pin 2 (Interrupt Triggered)');
                }}
                disabled={pedestrianRequested || trafficStep === 'red'}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  pedestrianRequested
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
                }`}
              >
                {pedestrianRequested ? 'Pedestrian Request Queued...' : 'Press Crosswalk Button (Pin 2)'}
              </button>
            </div>
          )}

          {/* Type 3: Ultrasonic Proximity Simulator */}
          {type === 'ultrasonic' && (
            <div className="flex flex-col items-center gap-4 w-full z-10">
              <div className="flex items-center justify-between w-full max-w-sm px-4">
                {/* HC-SR04 Transducer Eyes */}
                <div className="flex items-center gap-2 p-2 bg-slate-900 border border-cyan-500/40 rounded-xl">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center text-[10px] text-cyan-300 font-mono">
                    T
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center text-[10px] text-cyan-300 font-mono">
                    R
                  </div>
                </div>

                {/* Animated Soundwave beam */}
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="w-full flex items-center justify-center space-x-1.5">
                    <span
                      className={`h-6 w-1 rounded-full transition-all ${
                        obstacleDistance < 30 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                    <span
                      className={`h-10 w-1 rounded-full transition-all ${
                        obstacleDistance < 20 ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                    <span
                      className={`h-14 w-1 rounded-full transition-all ${
                        obstacleDistance < 10 ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                  </div>
                </div>

                {/* Simulated Obstacle */}
                <div className="w-10 h-16 bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-300">
                  Wall
                </div>
              </div>

              {/* Status Readouts */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold text-base">
                  {obstacleDistance} cm
                </span>
                <span className="text-slate-400">
                  Echo Pulse: {(obstacleDistance * 58.3).toFixed(0)} µs
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    isBuzzerBeeping
                      ? 'bg-rose-500 text-white font-bold animate-ping'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Buzzer Pin 6
                </span>
              </div>
            </div>
          )}

          {/* Type 4: Smart Plant Watering */}
          {type === 'plant-watering' && (
            <div className="flex flex-col items-center gap-4 z-10 w-full max-w-sm">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-center">
                  <span className="text-4xl">🪴</span>
                  <span className="text-xs text-slate-400 mt-1">Houseplant</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      isPumping
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-bounce'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    💦
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1">
                    5V Pump (Relay 7)
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Soil Moisture Level</span>
                  <span className="font-mono text-cyan-400">{soilMoisture}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      soilMoisture < 30 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${soilMoisture}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Default / Fallback: Temperature display */}
          {type === 'temperature' && (
            <div className="flex flex-col items-center gap-4 z-10">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-emerald-400 text-sm shadow-xl w-64 text-center">
                <div className="border-b border-slate-800 pb-1 mb-2 text-xs text-slate-400 font-sans font-semibold">
                  16x2 I2C LCD Readout
                </div>
                <div>Temp: {simTemp.toFixed(1)}°C</div>
                <div>Humidity: {simHumidity}%</div>
              </div>
            </div>
          )}

          {type === 'obstacle-robot' && (
            <div className="flex flex-col items-center gap-3 z-10 text-center">
              <div className="w-20 h-24 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 flex flex-col items-center justify-between p-2 shadow-xl relative">
                <div className="w-12 h-3 bg-cyan-500 rounded-sm" title="Servo ultrasonic head" />
                <div className="text-xs font-bold text-white">2WD ROVER</div>
                <div className="flex justify-between w-full">
                  <div className="w-3 h-6 bg-slate-700 rounded-sm" />
                  <div className="w-3 h-6 bg-slate-700 rounded-sm" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono">Autonomous State: FORWARD_SCAN</p>
            </div>
          )}
        </div>

        {/* Controls and Serial Telemetry Area */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#070A0F] border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Adjust Physical Parameters
            </h4>

            {type === 'led' && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Blink Delay Interval</span>
                    <span className="font-mono text-emerald-400">{ledDelay} ms</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={ledDelay}
                    onChange={(e) => setLedDelay(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>PWM Brightness (analogWrite)</span>
                    <span className="font-mono text-cyan-400">{ledBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={ledBrightness}
                    onChange={(e) => setLedBrightness(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {type === 'ultrasonic' && (
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Obstacle Distance Target</span>
                  <span className="font-mono text-cyan-400">{obstacleDistance} cm</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  value={obstacleDistance}
                  onChange={(e) => setObstacleDistance(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Slide closer (&lt; 15cm) to trigger the emergency radar warning frequency.
                </p>
              </div>
            )}

            {type === 'plant-watering' && (
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Dry Soil Moisture Probe</span>
                  <span className="font-mono text-amber-400">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Drop below 30% to automatically activate the 5V water relay.
                </p>
              </div>
            )}

            {type === 'traffic-light' && (
              <div className="text-xs text-slate-400 leading-relaxed">
                <p>Standard cycle times: Green (4s) → Yellow (1.5s) → Red (3.5s).</p>
                <p className="mt-1 text-emerald-400">
                  Pedestrian push button triggers an asynchronous interrupt on Pin 2.
                </p>
              </div>
            )}

            {type === 'temperature' && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Simulated Ambient Temp</span>
                    <span className="font-mono text-emerald-400">{simTemp.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="40"
                    step="0.5"
                    value={simTemp}
                    onChange={(e) => setSimTemp(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {type === 'obstacle-robot' && (
              <p className="text-xs text-slate-400">
                Interactive differential kinematics simulation. Rover tests left vs right sonar distances before executing turns.
              </p>
            )}
          </div>

          {/* Serial Monitor Output Window */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex flex-col justify-between h-36">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex justify-between items-center">
              <span>Virtual Serial Terminal (9600 baud)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            </div>
            <div className="overflow-y-auto space-y-1 text-slate-300 scrollbar-none">
              {serialLogs.map((log, i) => (
                <div key={i} className="leading-tight text-slate-400">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
