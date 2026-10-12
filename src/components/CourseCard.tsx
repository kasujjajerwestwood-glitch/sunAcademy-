import React from 'react';
import { Course } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { useProgress } from '../context/ProgressContext';
import { BookOpen, Clock, Layers, Bookmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { navigate } = useNavigation();
  const { isCourseBookmarked, toggleCourseBookmark, getCourseCompletionPercentage, progress } = useProgress();

  const isBookmarked = isCourseBookmarked(course.slug);
  const lessonIds = course.lessons.map((l) => l.id);
  const completionPercent = getCourseCompletionPercentage(lessonIds);
  const completedCount = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;

  const getLevelVariant = (level: string) => {
    switch (level) {
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

  const getTrackName = (trackId: string) => {
    switch (trackId) {
      case 'arduino':
        return 'Arduino';
      case 'python':
        return 'Python';
      case 'web-dev':
        return 'Web Dev';
      case 'embedded':
        return 'C/C++ Embedded';
      default:
        return trackId;
    }
  };

  return (
    <div
      onClick={() => navigate(`/courses/${course.slug}`)}
      className="group relative p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#0084FF] dark:hover:border-[#0084FF] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={getLevelVariant(course.level) as any} size="sm">
              {course.level}
            </Badge>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {getTrackName(course.trackId)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCourseBookmark(course.slug);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-500 border-amber-300 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white border-slate-200 dark:border-slate-700'
            }`}
            title={isBookmarked ? 'Remove favorite' : 'Add to favorites'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0084FF] transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Meta Footer & Progress Tracking */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {course.lessonCount} Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {course.duration}
          </span>
        </div>

        {/* Real Dynamic Progress Bar from LocalStorage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500 dark:text-slate-400">
              {completedCount > 0 ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {completedCount}/{course.lessonCount} Completed
                </span>
              ) : (
                'Not started'
              )}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {completionPercent}%
            </span>
          </div>

          <ProgressBar
            progress={completionPercent}
            size="sm"
            variant={completionPercent === 100 ? 'emerald' : 'cyan'}
            showLabel={false}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-[#0084FF] flex items-center gap-1 group-hover:underline">
            {completionPercent > 0 ? 'Continue Curriculum' : 'Start Course'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
          {course.partsList && (
            <span className="text-[11px] text-slate-400 font-mono">
              {course.partsList.length} Hardware Parts
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
