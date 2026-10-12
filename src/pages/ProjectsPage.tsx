import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../lib/projects';
import { ProjectCard } from '../components/ProjectCard';
import { SearchFilter } from '../components/SearchFilter';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Cpu, SearchX, RotateCcw, Wrench } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const ProjectsPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((proj) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.parts.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === 'all' || proj.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, selectedDifficulty]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
  };

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <Badge variant="cyan" size="sm" className="mb-2">
              Hardware Laboratory
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Arduino & Electronics Projects
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Real-world physical computing experiments. Each project includes an interactive virtual simulator, parts list, step-by-step wiring guide, and troubleshooting handbook.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            icon={<Wrench className="w-4 h-4 text-amber-400" />}
            onClick={() => navigate('/workbench')}
          >
            Launch Virtual Workbench
          </Button>
        </div>

        {/* Filter Bar */}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLevel={selectedDifficulty}
          onLevelChange={setSelectedDifficulty}
          placeholder="Search projects by sensor, LED, robot, or component..."
        />

        {/* Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-6">
          <span>
            Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
            {PROJECTS.length} hardware projects
          </span>
          {(searchQuery || selectedDifficulty !== 'all') && (
            <button
              onClick={handleReset}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400">
              Try searching for a different keyword or resetting your difficulty filter.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};
