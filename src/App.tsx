import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { TinkercadDashboardPage } from './pages/TinkercadDashboardPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { COURSES, getCourseBySlug } from './lib/courses';
import { PROJECTS, getProjectBySlug } from './lib/projects';

const MainRouter: React.FC = () => {
  const { currentPath } = useNavigation();

  // Normalize path
  const path = currentPath.split('?')[0].split('#')[0] || '/';

  // 1. Course Detail Route: /courses/:slug or /tutorials/:slug
  if (path.startsWith('/courses/') || path.startsWith('/tutorials/')) {
    const slug = path.replace('/courses/', '').replace('/tutorials/', '').trim();
    if (slug) {
      const course = getCourseBySlug(slug) || COURSES[0];
      return <CourseDetailPage course={course} />;
    }
  }

  // 2. Project Detail Route: /projects/:slug
  if (path.startsWith('/projects/')) {
    const slug = path.replace('/projects/', '').trim();
    if (slug) {
      const project = getProjectBySlug(slug) || PROJECTS[0];
      return <ProjectDetailPage project={project} />;
    }
  }

  // 3. Default: Full Tinkercad Dashboard
  return <TinkercadDashboardPage />;
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <ProgressProvider>
          <MainRouter />
        </ProgressProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}
