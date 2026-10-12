import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Zap, Github, Cpu, Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <footer className="border-t border-slate-800/80 bg-[#080B11] text-slate-400 text-sm mt-20 relative overflow-hidden">
      {/* Decorative top circuit trace line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg text-white">
                sun<span className="text-amber-400">Academy</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern physical computing academy. Learn to code, wire clean circuits, and build real hardware projects without barrier.
            </p>
            <div className="text-xs font-mono text-emerald-400/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Free & Open Source Curriculum</span>
            </div>
          </div>

          {/* Tracks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Learning Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/courses')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Arduino & Electronics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/courses')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Python & Fundamentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/courses')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Web Development (React)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/courses')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  C/C++ for Microcontrollers
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Hardware Projects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Featured Projects
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/projects/blinking-led')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
                >
                  Blinking LED & PWM
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/projects/traffic-light-controller')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
                >
                  Traffic Light Controller
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/projects/ultrasonic-distance-sensor')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
                >
                  Ultrasonic Distance Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/projects/smart-plant-watering-system')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400"
                >
                  Smart Plant Watering
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workbench')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-slate-400 font-semibold"
                >
                  ⚡ Virtual Pinout Workbench
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Deployment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform & Play Store
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Engineered for instantaneous deployment on Vercel and ready to wrap with Capacitor for Google Play.
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => navigate('/about')}
                className="text-left text-slate-300 hover:text-white transition-colors"
              >
                About Our Architecture →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} sunAcademy. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built for developers, tinkerers, and hardware explorers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
