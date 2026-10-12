import React from 'react';
import { Track } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { Cpu, Terminal, Globe, Binary, ArrowUpRight, BookOpen, Wrench } from 'lucide-react';
import { Badge } from './Badge';

interface TrackCardProps {
  track: Track;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { navigate } = useNavigation();

  const getIcon = () => {
    switch (track.id) {
      case 'arduino':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'python':
        return <Terminal className="w-6 h-6 text-amber-400" />;
      case 'web-dev':
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'embedded':
        return <Binary className="w-6 h-6 text-indigo-400" />;
      default:
        return <Cpu className="w-6 h-6 text-emerald-400" />;
    }
  };

  const getBorderHover = () => {
    switch (track.color) {
      case 'emerald':
        return 'hover:border-emerald-500/50 hover:shadow-emerald-500/10';
      case 'amber':
        return 'hover:border-amber-500/50 hover:shadow-amber-500/10';
      case 'cyan':
        return 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
      case 'indigo':
        return 'hover:border-indigo-500/50 hover:shadow-indigo-500/10';
      default:
        return 'hover:border-slate-700';
    }
  };

  return (
    <div
      onClick={() => navigate(`/courses?track=${track.id}`)}
      className={`group relative p-6 rounded-2xl bg-[#0F1420]/80 border border-slate-800/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${getBorderHover()}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>
          <Badge variant={track.color} size="sm">
            {track.badge}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
          <span>{track.title}</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5" />
        </h3>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {track.description}
        </p>

        {/* Skills pill tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {track.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
            >
              {skill}
            </span>
          ))}
          {track.skills.length > 3 && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
              +{track.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          {track.coursesCount} Courses
        </span>
        <span className="flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-slate-400" />
          {track.projectsCount} Projects
        </span>
      </div>
    </div>
  );
};
