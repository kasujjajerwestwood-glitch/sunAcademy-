import React, { useState } from 'react';
import { Project } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { useProgress } from '../context/ProgressContext';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CodeBlock } from '../components/CodeBlock';
import { CircuitSimulator } from '../components/CircuitSimulator';
import { BreadboardVisualizer } from '../components/BreadboardVisualizer';
import { InteractiveCodeEditor } from '../components/InteractiveCodeEditor';
import {
  ArrowLeft,
  Clock,
  Cpu,
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Circle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface ProjectDetailPageProps {
  project: Project;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  const { navigate } = useNavigation();
  const { isProjectCompleted, toggleProjectCompleted } = useProgress();

  const isCompleted = isProjectCompleted(project.id);
  const [checkedParts, setCheckedParts] = useState<string[]>([]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const togglePartCheck = (partName: string) => {
    setCheckedParts((prev) =>
      prev.includes(partName) ? prev.filter((p) => p !== partName) : [...prev, partName]
    );
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="py-6 sm:py-10 space-y-10 bg-[#F0F2F5] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 min-h-screen transition-colors">
      <Container>
        {/* Back navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#0084FF] transition-colors cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Hardware Project Lab
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-2xl p-6 sm:p-10 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan" size="sm">
                {project.difficulty}
              </Badge>
              <Badge variant="emerald" size="sm">
                Arduino Uno R3
              </Badge>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 ml-2">
                <Clock className="w-3.5 h-3.5" />
                {project.estimatedTime} build time
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.fullDescription}
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant={isCompleted ? 'outline' : 'primary'}
                size="md"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => toggleProjectCompleted(project.id)}
              >
                {isCompleted ? 'Completed (Click to Undo)' : 'Mark Project Complete'}
              </Button>

              <Button
                variant="outline"
                size="md"
                icon={<Wrench className="w-4 h-4 text-[#0084FF]" />}
                onClick={() => navigate('/')}
              >
                Open in Sun Academy Workbench
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Interactive Monaco Code Editor Section */}
      <Container>
        <div id="code-sandbox-section" className="space-y-3 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0084FF]" />
                <span>Interactive Code Sandbox & Runner</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Test and modify your logic in JavaScript or Python before flashing firmware to the physical board.
              </p>
            </div>
          </div>

          <InteractiveCodeEditor
            initialLanguage={project.codeLanguage === 'python' ? 'python' : 'javascript'}
            initialCode={project.codeSnippet}
            title={`${project.title} - Code Sandbox`}
            description="VS Code Monaco Editor engine. Supports JavaScript and Python execution with live stdout."
            height="320px"
          />
        </div>
      </Container>

      {/* Live Interactive Circuit Simulation Section */}
      <Container>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Live Interactive Circuit Simulation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Experiment with virtual pins and electrical responses in real time.
              </p>
            </div>
          </div>

          <CircuitSimulator type={project.simulationType || 'led'} />
        </div>
      </Container>

      {/* Main Content Layout: Wiring Schematic + Parts Checklist */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Interactive Breadboard Map */}
            <BreadboardVisualizer
              projectTitle={project.title}
              parts={project.parts}
              wiringSteps={project.wiringSteps}
            />

            {/* Complete Arduino C++ Sketch */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Complete Microcontroller Sketch
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Flash directly using standard Arduino IDE or Web Editor.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('code-sandbox-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-[#0084FF] hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Run in Sandbox</span>
                  </button>
                  <Badge variant="cyan" size="sm">
                    {project.codeLanguage.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <CodeBlock
                code={project.codeSnippet}
                language={project.codeLanguage}
                title={`${project.slug}.ino - Ready to Upload`}
              />
            </div>

            {/* Troubleshooting Tips Accordion */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Troubleshooting & Common Hardware Gotchas
                </h3>
              </div>

              <div className="space-y-3">
                {project.troubleshootingTips.map((tip, index) => {
                  const isExpanded = expandedFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between text-left font-semibold text-sm text-slate-900 dark:text-white hover:text-[#0084FF] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                          {tip.issue}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                          {tip.solution}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Interactive Parts Checklist */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-4 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <Package className="w-4 h-4 text-[#0084FF]" />
                  <span>Hardware Parts Checklist</span>
                </div>
                <span className="font-mono text-xs text-[#0084FF] font-bold">
                  {checkedParts.length}/{project.parts.length} Gathered
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click each item to check it off your bench before assembly:
              </p>

              <div className="space-y-2.5">
                {project.parts.map((part, index) => {
                  const isChecked = checkedParts.includes(part.name);
                  return (
                    <div
                      key={index}
                      onClick={() => togglePartCheck(part.name)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-slate-400"
                        aria-label={`Gathered ${part.name}`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                          <span className={isChecked ? 'line-through text-slate-400' : ''}>
                            {part.name}
                          </span>
                          <span className="font-mono text-[#0084FF]">x{part.quantity}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {part.role}
                        </div>
                        {part.pinHint && (
                          <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {part.pinHint}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/')}
                  icon={<Cpu className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Open in Circuit Studio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
