import React, { useState, useMemo, useEffect } from 'react';
import { COURSES } from '../lib/courses';
import { TRACKS } from '../lib/tracks';
import { CourseCard } from '../components/CourseCard';
import { SearchFilter } from '../components/SearchFilter';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { BookOpen, SearchX, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';

export const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Check URL query parameters on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const trackParam = urlParams.get('track');
      if (trackParam) {
        setSelectedTrack(trackParam);
      }
    }
  }, []);

  const trackOptions = [
    { label: 'All Tracks', value: 'all' },
    ...TRACKS.map((t) => ({ label: t.title, value: t.id }))
  ];

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.whatYouWillLearn.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTrack =
        selectedTrack === 'all' || course.trackId === selectedTrack;

      const matchesLevel =
        selectedLevel === 'all' || course.level === selectedLevel;

      return matchesSearch && matchesTrack && matchesLevel;
    });
  }, [searchQuery, selectedTrack, selectedLevel]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTrack('all');
    setSelectedLevel('all');
  };

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Page Header */}
        <div className="mb-10 max-w-3xl">
          <Badge variant="emerald" size="sm" className="mb-2">
            Curriculum Catalog
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore All Courses
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            From basic web development and Python scripts to physical circuit wiring and low-level C++ firmware.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTrack={selectedTrack}
          onTrackChange={setSelectedTrack}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          trackOptions={trackOptions}
          placeholder="Search by topic (e.g. Arduino, PWM, React, Sensors)..."
        />

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-6">
          <span>
            Showing <strong className="text-white">{filteredCourses.length}</strong> of{' '}
            {COURSES.length} courses
          </span>
          {(searchQuery || selectedTrack !== 'all' || selectedLevel !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No courses match your query</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or clearing selected track and level filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};
