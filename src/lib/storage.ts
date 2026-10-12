import { UserProgress } from '../types';

const STORAGE_KEY = 'sunacademy_user_progress_v1';

const defaultProgress: UserProgress = {
  completedLessons: ['ard-1'],
  completedProjects: [],
  bookmarkedCourses: ['arduino-starter-kit'],
  bookmarkedProjects: ['blinking-led']
};

export const loadProgress = (): UserProgress => {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return JSON.parse(raw);
  } catch {
    return defaultProgress;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress', err);
  }
};
