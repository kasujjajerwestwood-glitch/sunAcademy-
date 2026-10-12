import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { loadProgress, saveProgress } from '../lib/storage';

interface ProgressContextType {
  progress: UserProgress;
  isLessonCompleted: (lessonId: string) => boolean;
  toggleLessonCompleted: (lessonId: string) => void;
  isProjectCompleted: (projectId: string) => boolean;
  toggleProjectCompleted: (projectId: string) => void;
  isCourseBookmarked: (courseSlug: string) => boolean;
  toggleCourseBookmark: (courseSlug: string) => void;
  getCourseCompletionPercentage: (lessonIds: string[]) => number;
}

const ProgressContext = createContext<ProgressContextType>({
  progress: { completedLessons: [], completedProjects: [], bookmarkedCourses: [], bookmarkedProjects: [] },
  isLessonCompleted: () => false,
  toggleLessonCompleted: () => {},
  isProjectCompleted: () => false,
  toggleProjectCompleted: () => {},
  isCourseBookmarked: () => false,
  toggleCourseBookmark: () => {},
  getCourseCompletionPercentage: () => 0
});

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const toggleLessonCompleted = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      const updated = exists
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return { ...prev, completedLessons: updated };
    });
  };

  const isProjectCompleted = (projectId: string) => {
    return progress.completedProjects.includes(projectId);
  };

  const toggleProjectCompleted = (projectId: string) => {
    setProgress((prev) => {
      const exists = prev.completedProjects.includes(projectId);
      const updated = exists
        ? prev.completedProjects.filter((id) => id !== projectId)
        : [...prev.completedProjects, projectId];
      return { ...prev, completedProjects: updated };
    });
  };

  const isCourseBookmarked = (courseSlug: string) => {
    return progress.bookmarkedCourses.includes(courseSlug);
  };

  const toggleCourseBookmark = (courseSlug: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedCourses.includes(courseSlug);
      const updated = exists
        ? prev.bookmarkedCourses.filter((slug) => slug !== courseSlug)
        : [...prev.bookmarkedCourses, courseSlug];
      return { ...prev, bookmarkedCourses: updated };
    });
  };

  const getCourseCompletionPercentage = (lessonIds: string[]) => {
    if (!lessonIds || lessonIds.length === 0) return 0;
    const completed = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
    return Math.round((completed / lessonIds.length) * 100);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLessonCompleted,
        toggleLessonCompleted,
        isProjectCompleted,
        toggleProjectCompleted,
        isCourseBookmarked,
        toggleCourseBookmark,
        getCourseCompletionPercentage
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
