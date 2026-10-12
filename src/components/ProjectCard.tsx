import React from 'react';
import { Project } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { useProgress } from '../context/ProgressContext';
import {
  Lightbulb,
  Radio,
  Thermometer,
  Radar,
  Sprout,
  Bot,
  Clock,
  Cpu,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Badge } from './Badge';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { navigate } = useNavigation();
  const { isProjectCompleted, toggleProjectCompleted } = useProgress();

  const isCompleted = isProjectCompleted(project.id);

  const getIcon = () => {
    switch (project.icon) {
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-rose-400" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-emerald-400" />;
      case 'Radar':
        return <Radar className="w-5 h-5 text-cyan-400" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-lime-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-violet-400" />;
      default:
        return <Cpu className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getDifficultyVariant = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'emerald';
      case 'Intermediate':
        return 'cyan';
      case 'Advanced':
        return 'amber';
      default:
        return 'slate';
    }
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project.slug}`)}
      className="group relative p-6 rounded-2xl bg-[#0F1420]/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getDifficultyVariant(project.difficulty) as any} size="sm">
              {project.difficulty}
            </Badge>
            {isCompleted && (
              <span className="text-emerald-400" title="Project marked completed">
                <CheckCircle2 className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {project.estimatedTime}
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          {project.parts.length} Components
        </span>
        <span className="text-cyan-400 font-sans font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Build <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
