import React, { useState } from 'react';
import { Lesson } from '../types';
import { useProgress } from '../context/ProgressContext';
import { useNavigation } from '../context/NavigationContext';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  Lightbulb,
  Cpu,
  Code2,
  Sparkles
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { Button } from './Button';

interface LessonListProps {
  lessons: Lesson[];
  courseTitle: string;
  onPracticeLesson?: (snippet: string, language: string, title: string) => void;
}

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  courseTitle,
  onPracticeLesson
}) => {
  const { isLessonCompleted, toggleLessonCompleted } = useProgress();
  const { navigate } = useNavigation();
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(
    lessons.length > 0 ? lessons[0].id : null
  );

  const toggleExpand = (id: string) => {
    setExpandedLessonId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => {
        const isDone = isLessonCompleted(lesson.id);
        const isExpanded = expandedLessonId === lesson.id;

        return (
          <div
            key={lesson.id}
            className={`rounded-2xl border transition-all ${
              isExpanded
                ? 'bg-white dark:bg-[#0E131E] border-slate-300 dark:border-slate-700/80 shadow-md'
                : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Lesson Item Header */}
            <div
              onClick={() => toggleExpand(lesson.id)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3.5">
                {/* Completed Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLessonCompleted(lesson.id);
                  }}
                  className="shrink-0 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                  title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Lesson {index + 1}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Completed
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-semibold mt-0.5 transition-colors ${
                      isExpanded
                        ? 'text-[#0084FF] dark:text-blue-400 font-bold'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {lesson.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* Expanded Lesson Drawer */}
            {isExpanded && (
              <div className="px-4 pb-6 sm:px-6 pt-1 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lesson.description}
                </p>

                {/* Key Takeaways */}
                {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Key Concepts to Remember:
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-4 list-disc marker:text-emerald-500">
                      {lesson.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="leading-normal">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Snippet for this Lesson */}
                {lesson.codeSnippet && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span className="font-semibold">Hands-on Code Practice</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#0084FF] dark:text-cyan-400 uppercase font-bold text-[11px]">
                          {lesson.codeLanguage || 'cpp'}
                        </span>
                        {onPracticeLesson && (
                          <button
                            onClick={() =>
                              onPracticeLesson(
                                lesson.codeSnippet!,
                                lesson.codeLanguage || 'javascript',
                                lesson.title
                              )
                            }
                            className="bg-[#0084FF]/10 hover:bg-[#0084FF]/20 text-[#0084FF] dark:text-blue-300 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Load in Code Lab</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <CodeBlock
                      code={lesson.codeSnippet}
                      language={lesson.codeLanguage || 'cpp'}
                      title={`${lesson.title} - Snippet`}
                    />
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => toggleLessonCompleted(lesson.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-transparent shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDone ? 'Completed (Click to Undo)' : 'Mark Lesson as Complete'}</span>
                    </button>

                    {lesson.codeSnippet && onPracticeLesson && (
                      <button
                        onClick={() =>
                          onPracticeLesson(
                            lesson.codeSnippet!,
                            lesson.codeLanguage || 'javascript',
                            lesson.title
                          )
                        }
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#0084FF] dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Run in Code Sandbox</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#0084FF] dark:text-cyan-400" />
                    <span>Open in Workbench</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
