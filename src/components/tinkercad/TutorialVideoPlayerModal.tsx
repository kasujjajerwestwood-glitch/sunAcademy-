import React, { useState, useEffect, useRef } from 'react';
import { VideoTutorial } from '../../types/builder';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Wrench,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Video,
  MonitorPlay,
  Cpu,
  Layers,
  CheckCircle2,
  Code2,
  Gauge,
  Activity,
  Zap,
  Radio,
  SkipForward,
  SkipBack
} from 'lucide-react';

interface TutorialVideoPlayerModalProps {
  tutorial: VideoTutorial;
  onClose: () => void;
  onTinkerCircuit?: (circuitSlug?: string) => void;
}

export const TutorialVideoPlayerModal: React.FC<TutorialVideoPlayerModalProps> = ({
  tutorial,
  onClose,
  onTinkerCircuit
}) => {
  // Default to real video tutorial
  const [playerMode, setPlayerMode] = useState<'video' | 'simulation'>('video');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(324); // 5:24 in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'parts' | 'code'>('chapters');
  const [audioTonePlayed, setAudioTonePlayed] = useState<number>(-1);

  // Chapters with timestamps and rich visual cues
  const chapters = [
    {
      title: '1. Introduction to Sun Academy Workplane',
      start: 0,
      duration: 65,
      note: 'Navigate 3D workplane grid, zoom with mousewheel, and drag components from the library.',
      badge: 'Workplane Basics',
      voltage: '0.00 V',
      ledOn: false,
      motorRpm: 0
    },
    {
      title: '2. Adding Breadboard & Microcontroller',
      start: 65,
      duration: 80,
      note: 'Place Arduino Uno R3 and Small Breadboard. Snap components into socket columns (a-e, f-j).',
      badge: 'Component Placement',
      voltage: '5.00 V',
      ledOn: false,
      motorRpm: 0
    },
    {
      title: '3. Connecting Terminals with Wire Tool',
      start: 145,
      duration: 90,
      note: 'Activate the Wire tool (W) and choose colors. Connect Digital Pin D9 to resistor and LED anode.',
      badge: 'Circuit Wiring',
      voltage: '5.00 V',
      ledOn: true,
      motorRpm: 120
    },
    {
      title: '4. Understanding Current-Limiting Resistors',
      start: 235,
      duration: 55,
      note: 'Calculate Ohm\'s Law (V = I × R). A 220Ω resistor limits 5V current to safe ~18mA for standard LEDs.',
      badge: 'Ohm\'s Law Physics',
      voltage: '2.14 V',
      ledOn: true,
      motorRpm: 240
    },
    {
      title: '5. Running Simulation & Serial Monitor',
      start: 290,
      duration: 34,
      note: 'Press Start Simulation! Inspect live digital signals, serial logs, and virtual electricity flow.',
      badge: 'Live Simulation',
      voltage: '5.00 V',
      ledOn: true,
      motorRpm: 360
    }
  ];

  // Web Audio Tone generator for authentic multimedia audio cues
  const playChimeTone = (freq: number = 520, durationMs: number = 180) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // AudioContext policy fallback
    }
  };

  // Auto-play timer for interactive CAD simulation video
  useEffect(() => {
    if (playerMode !== 'simulation' || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) return 0;
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, duration, playerMode]);

  const currentChapterIndex = chapters.findIndex(
    (c) => currentTime >= c.start && currentTime < c.start + c.duration
  );
  const currentChapter = chapters[currentChapterIndex >= 0 ? currentChapterIndex : 0];

  // Sound chime when entering a new chapter
  useEffect(() => {
    if (isPlaying && currentChapterIndex !== audioTonePlayed && currentChapterIndex >= 0) {
      setAudioTonePlayed(currentChapterIndex);
      playChimeTone(440 + currentChapterIndex * 80, 200);
    }
  }, [currentChapterIndex, isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Extract clean YouTube video ID if available
  const youtubeVideoId = tutorial.videoUrl?.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1] || 'g2_0H8yV4m8';
  const directYoutubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-5xl bg-[#182230] border border-[#2C3E50] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-white">
        {/* Top Header */}
        <div className="h-14 px-4 sm:px-5 bg-[#111A24] border-b border-[#2C3E50] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6 p-0.5 bg-white/10 rounded-xs shrink-0">
              <div className="bg-[#0084FF] rounded-xs" />
              <div className="bg-[#EB364B] rounded-xs" />
              <div className="bg-[#F5A623] rounded-xs" />
              <div className="bg-[#00A651] rounded-xs" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>Sun Academy Arduino Masterclass</span>
                <span className="text-[#0084FF] font-mono">• {tutorial.duration}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                  {tutorial.level}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-white truncate max-w-lg">
                {tutorial.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Player Mode Switcher */}
            <div className="flex items-center bg-[#0B1017] p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => {
                  setPlayerMode('simulation');
                  setIsPlaying(true);
                }}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  playerMode === 'simulation'
                    ? 'bg-[#0084FF] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Watch guaranteed-to-play interactive CAD video simulation"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CAD Video (Plays 100%)</span>
                <span className="sm:hidden">CAD</span>
              </button>
              <button
                onClick={() => setPlayerMode('video')}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  playerMode === 'video'
                    ? 'bg-[#0084FF] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Watch YouTube stream embed"
              >
                <Video className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </button>
            </div>

            {/* Direct Open in YouTube Link */}
            <a
              href={directYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer"
              title="Open full video on YouTube in a new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>YouTube ↗</span>
            </a>

            {tutorial.circuitStarterId && (
              <button
                onClick={() => {
                  onClose();
                  onTinkerCircuit?.(tutorial.circuitStarterId);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                title="Open and edit this circuit on your canvas"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulate & Build Circuit</span>
                <span className="sm:hidden">Simulate</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Video Player Left, Side Panel Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden min-h-[460px]">
          {/* Left 2 Cols: Video Stream or Interactive Simulation */}
          <div className="lg:col-span-2 flex flex-col bg-black relative overflow-hidden group">
            {playerMode === 'video' ? (
              /* YouTube Stream with Security Fallback Banner */
              <div className="w-full h-full min-h-[360px] sm:min-h-[440px] flex flex-col items-center justify-center bg-black relative">
                <iframe
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

                {/* Bottom Fallback Overlay in case browser blocks iframe */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-300 z-10 pointer-events-auto">
                  <span className="truncate pr-2">
                    💡 If your browser blocks embedded playback:
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setPlayerMode('simulation');
                        setIsPlaying(true);
                      }}
                      className="px-2.5 py-1 bg-[#0084FF] text-white rounded font-bold hover:bg-[#0070D6] cursor-pointer"
                    >
                      ▶ Play CAD Video
                    </button>
                    <a
                      href={directYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      Watch on YouTube ↗
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Interactive Simulated CAD Video Engine (Guaranteed to Play 100%) */
              <div className="flex-1 flex flex-col bg-gradient-to-b from-[#090D14] via-[#101726] to-[#0A0E17] relative">
                {/* Visual Canvas Simulator */}
                <div className="flex-1 relative flex items-center justify-center min-h-[340px] p-6 overflow-hidden">
                  {/* Background Workplane Grid Simulation */}
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#38BDF8 1.5px, transparent 1.5px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Animated Circuit Simulation Display */}
                  <div className="relative z-10 w-full max-w-xl flex flex-col items-center animate-in fade-in space-y-4">
                    {/* Simulated Circuit Board Graphic in CAD Space */}
                    <div className="w-full bg-[#0E1626]/90 border-2 border-[#0084FF]/40 rounded-2xl p-4 shadow-[0_0_50px_rgba(0,132,255,0.25)] flex flex-col gap-3 relative overflow-hidden backdrop-blur-xs">
                      {/* Top HUD Stats */}
                      <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-emerald-400 font-bold">CIRCUIT ENGINE: RUNNING</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <span>V_BUS: <strong className="text-amber-400">{currentChapter.voltage}</strong></span>
                          <span>FREQ: <strong className="text-cyan-400">16 MHz</strong></span>
                        </div>
                      </div>

                      {/* Main CAD Interactive Animation Area */}
                      <div className="h-44 bg-[#090E17] rounded-xl border border-slate-800 p-3 relative flex items-center justify-around overflow-hidden">
                        {/* 1. Virtual Arduino Uno */}
                        <div className="w-32 h-28 bg-[#0084FF] rounded-lg p-2 border-2 border-blue-500 shadow-md flex flex-col justify-between text-white relative">
                          <div className="flex justify-between items-center text-[7px] font-mono font-bold">
                            <span>ARDUINO</span>
                            <span className="text-amber-300">UNO R3</span>
                          </div>
                          <div className="w-10 h-4 bg-slate-900 border border-slate-700 rounded-xs mx-auto flex items-center justify-center">
                            <span className="text-[6px] font-mono text-cyan-300">ATmega328P</span>
                          </div>
                          <div className="flex justify-between items-center text-[7px] font-mono">
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>ON</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  currentChapter.ledOn ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-700'
                                }`}
                              />
                              <span>L (D9)</span>
                            </div>
                          </div>
                        </div>

                        {/* Animated Wire with Flying Current Electrons */}
                        <div className="flex-1 h-1 bg-gradient-to-r from-[#0084FF] via-emerald-400 to-amber-400 mx-2 relative rounded-full">
                          {isPlaying && (
                            <div className="absolute inset-0 flex justify-around items-center">
                              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                              <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping delay-150" />
                              <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping delay-300" />
                            </div>
                          )}
                        </div>

                        {/* 2. Virtual Breadboard with Resistor & LED */}
                        <div className="w-40 h-28 bg-slate-100 rounded-lg p-2 border-2 border-slate-300 shadow-md flex flex-col justify-between text-slate-800 relative">
                          <div className="text-[7px] font-mono font-bold text-center text-slate-500">
                            BREADBOARD TIE-POINTS
                          </div>
                          {/* Resistor & LED visual in socket */}
                          <div className="flex items-center justify-around my-auto">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-3 bg-[#E0D5B5] border border-amber-900 rounded-xs flex items-center justify-around px-0.5">
                                <div className="w-0.5 h-full bg-red-600" />
                                <div className="w-0.5 h-full bg-red-600" />
                                <div className="w-0.5 h-full bg-amber-600" />
                              </div>
                              <span className="text-[6px] font-mono font-bold text-amber-900 mt-0.5">220Ω</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full border-2 border-slate-400 transition-all flex items-center justify-center ${
                                  currentChapter.ledOn
                                    ? 'bg-red-500 shadow-[0_0_18px_rgba(239,68,68,1)]'
                                    : 'bg-red-950 opacity-60'
                                }`}
                              >
                                {currentChapter.ledOn && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                              </div>
                              <span className="text-[6px] font-mono font-bold text-slate-600 mt-0.5">5mm LED</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-[6px] font-mono text-red-600 font-bold">
                            <span>+ 5V RAIL</span>
                            <span className="text-blue-600">- GND RAIL</span>
                          </div>
                        </div>
                      </div>

                      {/* Lesson Narration & Step Badge */}
                      <div className="flex flex-col gap-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0084FF]/20 text-[#38BDF8] border border-[#0084FF]/40 text-xs font-bold font-mono">
                            {currentChapter.title}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {currentChapter.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed pt-1">
                          {currentChapter.note}
                        </p>
                      </div>
                    </div>

                    {/* Step Visualizer Dots */}
                    <div className="flex items-center gap-2">
                      {chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentTime(ch.start);
                            setIsPlaying(true);
                          }}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            currentTime >= ch.start && currentTime < ch.start + ch.duration
                              ? 'w-10 bg-[#0084FF] shadow-[0_0_8px_rgba(0,132,255,0.8)]'
                              : currentTime > ch.start
                              ? 'w-4 bg-emerald-500'
                              : 'w-4 bg-slate-700 hover:bg-slate-600'
                          }`}
                          title={`Chapter ${idx + 1}: ${ch.title}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Big Play/Pause Center Overlay Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/10 hover:bg-black/25 transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-20"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#0084FF]/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform">
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                    </div>
                  </button>
                </div>

                {/* Simulation Mode Controls Bar */}
                <div className="p-3 bg-[#101722]/95 border-t border-[#2C3E50] space-y-2">
                  <div className="relative w-full h-2.5 bg-slate-700/60 rounded-full cursor-pointer group/bar overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0084FF] to-cyan-400 rounded-full relative transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-lg bg-[#0084FF] hover:bg-[#0070D6] text-white transition-colors cursor-pointer flex items-center gap-1 font-bold px-3"
                        title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Play</span>
                          </>
                        )}
                      </button>

                      {/* Chapter Skip Buttons */}
                      <button
                        onClick={() => {
                          const prevIdx = Math.max(0, currentChapterIndex - 1);
                          setCurrentTime(chapters[prevIdx].start);
                        }}
                        className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Previous Chapter"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const nextIdx = Math.min(chapters.length - 1, currentChapterIndex + 1);
                          setCurrentTime(chapters[nextIdx].start);
                        }}
                        className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Next Chapter"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCurrentTime(0)}
                        className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Rewind to start"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <span className="font-mono text-[11px] text-slate-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Audio mute toggle */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>

                      {/* Speed selector */}
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400 hidden sm:inline">Speed:</span>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                          className="bg-slate-800 text-[11px] text-slate-200 font-semibold px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-[#0084FF] cursor-pointer"
                        >
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1.0x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2.0x</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Video Chapter Guide, Parts List & Code Snippets */}
          <div className="bg-[#182230] border-t lg:border-t-0 lg:border-l border-[#2C3E50] flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#2C3E50] bg-[#111A24]">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'chapters'
                    ? 'border-[#0084FF] text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Chapters</span>
              </button>

              <button
                onClick={() => setActiveTab('parts')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'parts'
                    ? 'border-[#0084FF] text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Parts ({tutorial.partsList.length})</span>
              </button>

              {tutorial.starterCode && (
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'code'
                      ? 'border-[#0084FF] text-white bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeTab === 'chapters' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Class Curriculum & Timestamps
                  </div>
                  {chapters.map((chap, i) => {
                    const isCurrent =
                      currentTime >= chap.start && currentTime < chap.start + chap.duration;

                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setCurrentTime(chap.start);
                          setIsPlaying(true);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isCurrent
                            ? 'bg-[#0084FF]/20 border-[#0084FF] text-white ring-1 ring-[#0084FF]'
                            : 'bg-[#141E28] border-slate-700/80 hover:border-slate-600 hover:bg-[#1C2836] text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                                isCurrent ? 'bg-[#0084FF] text-white' : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {i + 1}
                            </span>
                            <h4 className="text-xs font-bold truncate">{chap.title}</h4>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 pl-6">
                            {chap.note}
                          </p>
                        </div>

                        <span className="font-mono text-[10px] text-slate-400 shrink-0">
                          {formatTime(chap.start)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'parts' && (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Required Hardware Components
                  </div>
                  <div className="space-y-2">
                    {tutorial.partsList.map((part, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-[#141E28] border border-slate-700/80 flex items-center justify-between text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{part}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Qty: 1</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'code' && tutorial.starterCode && (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Arduino C++ (.ino) Code
                  </div>
                  <pre className="p-3 rounded-lg bg-[#0F1722] border border-slate-700 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    {tutorial.starterCode.cpp}
                  </pre>

                  {tutorial.starterCode.python && (
                    <>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">
                        MicroPython (.py) Code
                      </div>
                      <pre className="p-3 rounded-lg bg-[#0F1722] border border-slate-700 text-[11px] font-mono text-amber-300 overflow-x-auto leading-relaxed">
                        {tutorial.starterCode.python}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Tinker Button */}
            {tutorial.circuitStarterId && (
              <div className="p-3 bg-[#111A24] border-t border-[#2C3E50]">
                <button
                  onClick={() => {
                    onClose();
                    onTinkerCircuit?.(tutorial.circuitStarterId);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0070D6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Load & Simulate this Circuit in Sun Academy Studio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
