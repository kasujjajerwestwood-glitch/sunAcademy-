import React, { useState } from 'react';
import { Course } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { useProgress } from '../context/ProgressContext';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { LessonList } from '../components/LessonList';
import { InteractiveCodeEditor } from '../components/InteractiveCodeEditor';
import {
  ArrowLeft,
  Clock,
  Layers,
  Bookmark,
  CheckCircle2,
  Cpu,
  Package,
  Wrench,
  BookOpen,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface CourseDetailPageProps {
  course: Course;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course }) => {
  const { navigate } = useNavigation();
  const {
    progress,
    isCourseBookmarked,
    toggleCourseBookmark,
    getCourseCompletionPercentage,
    toggleLessonCompleted
  } = useProgress();

  const isBookmarked = isCourseBookmarked(course.slug);
  const lessonIds = course.lessons.map((l) => l.id);
  const completionPercent = getCourseCompletionPercentage(lessonIds);
  const completedLessonsCount = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;

  // Active code snippet in the interactive runner
  const defaultSnippet = course.featuredCode?.code || course.lessons[0]?.codeSnippet || '';
  const defaultLanguage: 'javascript' | 'python' = course.trackId === 'python' ? 'python' : 'javascript';

  const [activeCode, setActiveCode] = useState<string>(defaultSnippet);
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'python'>(defaultLanguage);
  const [editorTitle, setEditorTitle] = useState<string>(`${course.title} - Code Playground`);

  const handlePracticeLesson = (snippet: string, language: string, title: string) => {
    setActiveCode(snippet);
    if (language.toLowerCase() === 'python') {
      setActiveLanguage('python');
    } else {
      setActiveLanguage('javascript');
    }
    setEditorTitle(`${title} - Live Sandbox`);

    const el = document.getElementById('code-lab-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="py-6 sm:py-10 space-y-10 bg-[#F0F2F5] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 min-h-screen transition-colors">
      <Container>
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#0084FF] transition-colors cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Course Track:</span>
            <span className="font-bold uppercase text-[#0084FF] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              {course.trackId}
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-2xl p-6 sm:p-10 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" size="sm">
                {course.level}
              </Badge>
              <Badge variant="cyan" size="sm">
                {course.trackId.toUpperCase()}
              </Badge>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 ml-2">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {course.lessonCount} Lessons
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.longDescription}
            </p>

            {/* Course Progress Tracking Section */}
            <div className="pt-2 max-w-lg space-y-3.5 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Your Course Progress</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#0084FF]">
                  {completedLessonsCount} / {course.lessonCount} Lessons ({completionPercent}%)
                </span>
              </div>

              <ProgressBar
                progress={completionPercent}
                size="md"
                variant="emerald"
                showLabel={false}
              />

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  icon={<BookOpen className="w-4 h-4" />}
                  onClick={() => {
                    const el = document.getElementById('lesson-curriculum');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {completionPercent > 0 ? 'Continue Lessons' : 'Start Curriculum'}
                </Button>

                <button
                  onClick={() => toggleCourseBookmark(course.slug)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                    isBookmarked
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-300'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved to Favorites' : 'Favorite'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Interactive Monaco Code Editor Section */}
      <Container>
        <div id="code-lab-section" className="space-y-3 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0084FF]" />
                <span>Interactive Code Lab & Runner</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Practice coding concepts for {course.title}. Write JavaScript or Python snippets and click "Run Code" to inspect the output.
              </p>
            </div>
          </div>

          <InteractiveCodeEditor
            initialLanguage={activeLanguage}
            initialCode={activeCode}
            title={editorTitle}
            description="VS Code Monaco Editor engine with live client-side execution."
            height="340px"
          />
        </div>
      </Container>

      {/* Main Content Layout: Curriculum + Parts List */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Lessons Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* What you'll learn */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                What You'll Learn in This Course
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum & Lessons */}
            <div id="lesson-curriculum" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step-by-Step Curriculum
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click each module to view instructions, practice code, and mark as completed.
                  </p>
                </div>
                <Badge variant="cyan" size="sm">
                  {course.lessonCount} Modules
                </Badge>
              </div>

              <LessonList
                lessons={course.lessons}
                courseTitle={course.title}
                onPracticeLesson={handlePracticeLesson}
              />
            </div>
          </div>

          {/* Sidebar Column: Hardware Parts List & Prerequisites */}
          <div className="lg:col-span-4 space-y-6">
            {/* Hardware Parts List (if any) */}
            {course.partsList && course.partsList.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                    <Package className="w-4 h-4 text-[#0084FF]" />
                    <span>Hardware Kit Parts</span>
                  </div>
                  <Badge variant="cyan" size="sm">
                    {course.partsList.length} items
                  </Badge>
                </div>

                <ul className="space-y-3 text-xs">
                  {course.partsList.map((part, index) => (
                    <li
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-900 dark:text-white font-semibold">
                        <span>{part.name}</span>
                        <span className="font-mono text-[#0084FF]">x{part.quantity}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{part.role}</div>
                      {part.pinHint && (
                        <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 pt-0.5">
                          {part.pinHint}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={<Wrench className="w-3.5 h-3.5 text-amber-500" />}
                  onClick={() => navigate('/')}
                >
                  Tinker in Circuit Workbench
                </Button>
              </div>
            )}

            {/* Prerequisites */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Prerequisites
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {course.prerequisites.map((pre, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0084FF]" />
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
