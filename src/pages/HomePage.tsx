import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { COURSES } from '../lib/courses';
import { PROJECTS } from '../lib/projects';
import { TRACKS } from '../lib/tracks';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { SectionHeading } from '../components/SectionHeading';
import { TrackCard } from '../components/TrackCard';
import { CourseCard } from '../components/CourseCard';
import { ProjectCard } from '../components/ProjectCard';
import { CircuitSimulator } from '../components/CircuitSimulator';
import {
  Zap,
  ArrowRight,
  BookOpen,
  Cpu,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  Wrench,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useNavigation();

  const featuredCourses = COURSES.slice(0, 4);
  const featuredProjects = PROJECTS.slice(0, 3);

  return (
    <div className="space-y-20 lg:space-y-28 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

        <Container>
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 p-1.5 px-4 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-medium">sunAcademy v1.0 is Live</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono">100% Free Open Curriculum</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Learn to code.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Build real hardware.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Master web development, Python, electronics, and Arduino microcontrollers. From your first lines of code to physical sensors and robots.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={<BookOpen className="w-5 h-5" />}
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Cpu className="w-5 h-5 text-cyan-400" />}
                onClick={() => navigate('/projects')}
              >
                See Projects
              </Button>
              <Button
                variant="ghost"
                size="lg"
                icon={<Wrench className="w-5 h-5 text-amber-400" />}
                onClick={() => navigate('/workbench')}
              >
                Open Workbench
              </Button>
            </div>
          </div>

          {/* Interactive Hero Circuit Preview Card */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/20 shadow-2xl">
              <CircuitSimulator type="led" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono px-4">
              <span>Try dragging the frequency & PWM sliders above</span>
              <button
                onClick={() => navigate('/workbench')}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Full Virtual Workbench →
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Row */}
      <section className="border-y border-slate-800/80 bg-slate-950/40 py-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                4
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                Structured Tracks
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                8+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                Full-Length Courses
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">
                45+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                Interactive Lessons
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                6+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                Arduino Hardware Builds
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Learning Tracks Section */}
      <section>
        <Container>
          <SectionHeading
            tag="Curriculum"
            tagVariant="emerald"
            title="Four Specialized Learning Tracks"
            description="From digital logic and cloud frontends to breadboard circuits and microcontroller firmware."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRACKS.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Courses Section */}
      <section>
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="cyan" size="sm" className="mb-2">
                Popular Curriculum
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Featured Courses
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Hands-on courses with step-by-step lessons, copyable code, and hardware lists.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/courses')}
            >
              View All Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </section>

      {/* Arduino Hardware Projects Section */}
      <section className="relative">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="amber" size="sm" className="mb-2">
                Physical Computing
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hands-On Hardware Projects
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Complete wiring schematics, parts lists, and verified Arduino C++ sketches.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/projects')}
            >
              View All Projects
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </section>

      {/* Workbench Promo Banner */}
      <section>
        <Container>
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-800 bg-[#0E1420] shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl space-y-4 relative z-10">
              <Badge variant="cyan" size="sm">
                Interactive Simulator
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Test code before touching a breadboard.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Our Virtual Workbench lets you adjust simulated pin voltages, trigger ultrasonic sensors, and test code logic without needing physical components on day one.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Wrench className="w-4 h-4" />}
                  onClick={() => navigate('/workbench')}
                >
                  Launch Virtual Workbench
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/about')}
                >
                  Learn About Our Approach
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="text-center">
        <Container size="narrow">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Start building real projects today.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
              Everything in sunAcademy is free, structured, and designed for real practical builders. Jump into your first lesson right now.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                onClick={() => navigate('/courses')}
              >
                Begin Your Journey
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
