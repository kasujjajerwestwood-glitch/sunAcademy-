import React from 'react';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useNavigation } from '../context/NavigationContext';
import {
  Zap,
  Target,
  Sparkles,
  Smartphone,
  Globe,
  HardDrive,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Code2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="py-8 sm:py-16 space-y-16">
      <Container size="narrow">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="amber" size="sm">
            Our Mission & Architecture
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Bridging Software & Physical Computing
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            sunAcademy was created to remove the intimidation from microcontrollers and hardware electronics. We believe anyone who can write code can build real physical machines.
          </p>
        </div>

        {/* Mission Statement Card */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-[#0E131E] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Why sunAcademy?</h2>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Most online coding academies stop at the browser window. Meanwhile, traditional electronics tutorials are often cluttered with fragmented forum posts, dead image links, or bloated software.
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            We built sunAcademy with a clean, grid-based workbench discipline inspired by the simplicity of physical lab workbenches—elevated with modern dark-mode ergonomics, copyable production sketches, interactive simulators, and structured progression tracks.
          </p>
        </div>

        {/* What You Can Learn */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-white text-center">
            What You Can Learn Here
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Physical Electronics
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ohm’s law, current-limiting resistors, breadboarding, ADC analog voltage reads, and PWM duty cycles.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Microcontroller Programming
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Arduino C++, hardware interrupts, timing without delay(), direct register port manipulation, and memory safety.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Web Dashboards & IoT
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Building modern React dashboards to visualize sensor streams over WebSockets and MQTT brokers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-indigo-400 font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Robotics & Autonomous Logic
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                H-Bridge motor control, sonar time-of-flight obstacle avoidance, and finite state machine navigation.
              </p>
            </div>
          </div>
        </div>

        {/* Future Roadmap: Play Store, Custom Domain, Offline */}
        <div className="mt-16 p-8 rounded-3xl bg-[#0E131E] border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Platform Roadmap</h2>
              <p className="text-xs text-slate-400">
                Architected from day one for seamless mobile apps and enterprise deployment
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                1
              </span>
              <div>
                <strong className="text-white block mb-0.5">
                  Vercel Immediate Zero-Config Deployment
                </strong>
                <span className="text-slate-400">
                  Ready to deploy on Vercel with single-click git push. Static assets and SPA rewrite rules are pre-configured in <code className="text-emerald-300">vercel.json</code>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400 font-bold text-xs">
                2
              </span>
              <div>
                <strong className="text-white block mb-0.5">
                  PWA & Google Play Store Wrapper Ready
                </strong>
                <span className="text-slate-400">
                  Includes full <code className="text-cyan-300">manifest.json</code>, service worker cache (<code className="text-cyan-300">sw.js</code>), and adaptive viewport scaling. Easily wrapped with <strong>Capacitor</strong> (<code className="text-slate-300">npx cap add android</code>) or <strong>Bubblewrap</strong> for Google Play Store publication.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs">
                3
              </span>
              <div>
                <strong className="text-white block mb-0.5">
                  Custom Domain Connectivity
                </strong>
                <span className="text-slate-400">
                  Add your custom domain (e.g. <code className="text-amber-300">sunacademy.dev</code> or <code className="text-amber-300">academy.yourdomain.com</code>) directly in Vercel’s DNS settings with free automatic SSL certificates.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={() => navigate('/courses')}
          >
            Explore Courses Now
          </Button>
        </div>
      </Container>
    </div>
  );
};
