import { PlacedComponent, PlacedWire } from './builder';

export type TrackId = 'web-dev' | 'python' | 'arduino' | 'embedded';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Track {
  id: TrackId;
  title: string;
  description: string;
  icon: string;
  badge: string;
  color: 'emerald' | 'cyan' | 'amber' | 'indigo';
  coursesCount: number;
  projectsCount: number;
  skills: string[];
}

export interface Part {
  name: string;
  quantity: number;
  role: string;
  pinHint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  codeSnippet?: string;
  codeLanguage?: string;
  keyTakeaways?: string[];
  interactiveDemoType?: 'web' | 'python' | 'arduino';
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  trackId: TrackId;
  level: DifficultyLevel;
  lessonCount: number;
  duration: string;
  whatYouWillLearn: string[];
  prerequisites: string[];
  partsList?: Part[];
  lessons: Lesson[];
  featuredCode?: {
    language: string;
    title: string;
    code: string;
  };
}

export interface WiringStep {
  step: number;
  title: string;
  description: string;
  pins: string;
}

export interface TroubleshootingTip {
  issue: string;
  solution: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  trackId: TrackId;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  icon: string;
  parts: Part[];
  wiringSteps: WiringStep[];
  codeSnippet: string;
  codeLanguage: string;
  troubleshootingTips: TroubleshootingTip[];
  simulationType?: 'led' | 'traffic-light' | 'ultrasonic' | 'temperature' | 'plant-watering' | 'obstacle-robot';
}

export interface CircuitDesign {
  id: string;
  slug: string;
  title: string;
  category: 'Circuits' | 'Starters' | 'Codeblocks';
  lastEdited: string;
  isPublic: boolean;
  difficulty: DifficultyLevel;
  componentsCount: number;
  simulationType: 'led' | 'traffic-light' | 'ultrasonic' | 'temperature' | 'plant-watering' | 'obstacle-robot';
  code: string;
  codeLanguage: string;
  parts: Part[];
  description: string;
  wiringSteps: WiringStep[];
  troubleshootingTips: TroubleshootingTip[];
  placedComponents?: PlacedComponent[];
  placedWires?: PlacedWire[];
}

export interface CircuitComponentItem {
  id: string;
  name: string;
  category: 'Basic' | 'Arduino' | 'Sensors' | 'Actuators' | 'Power' | 'Instruments' | 'Starters' | string;
  icon: string;
  color: string;
  pins: string[];
  description: string;
}

export interface CourseProgressInfo {
  courseSlug: string;
  completedLessonIds: string[];
  totalLessons: number;
  percentage: number;
  lastUpdated: string;
}

export interface UserProgress {
  completedLessons: string[]; // array of completed lesson IDs
  completedProjects: string[]; // array of completed project IDs
  bookmarkedCourses: string[]; // array of bookmarked course slugs
  bookmarkedProjects: string[]; // array of bookmarked project slugs
  coursesProgressMap?: Record<string, CourseProgressInfo>;
  lastUpdated?: string;
}
