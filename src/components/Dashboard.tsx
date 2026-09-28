import React, { useState } from 'react';
import { Settings, LogOut, Plus, Trash2, BookOpen, ArrowRight } from 'lucide-react';
import { Collection, Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime } from '../hooks/useNotes';

interface DashboardProps {
  collections: Collection[];
  notes: Note[];
  onOpenCourse: (courseId: string) => void;
  onAddCourse: (name: string, category?: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  collections,
  notes,
  onOpenCourse,
  onAddCourse,
  onDeleteCourse,
  onOpenSettings,
}) => {
  const { user, signOut } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<Collection | null>(null);

  const displayName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student';

  const rootCourses = collections.filter((c) => !c.parentId);

  const handleCreateCourse = () => {
    if (courseTitle.trim()) {
      onAddCourse(courseTitle.trim(), courseCategory.trim() || undefined);
      setCourseTitle('');
      setCourseCategory('');
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      onDeleteCourse(courseToDelete.id);
      setCourseToDelete(null);
    }
  };

  return (
    <main className="app-backdrop relative min-h-screen w-full overflow-x-hidden">
      <div className="grain-overlay pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-[1200px] p-4 sm:p-8">
        {/* Welcome Header */}
        <header className="glass-panel animate-panel-in flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome Back, {displayName}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a course folder to access your workspace
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Settings"
              onClick={onOpenSettings}
              className="rounded-lg border border-white/5 bg-white/[0.04] p-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Log out"
              onClick={() => void signOut()}
              className="rounded-lg border border-white/5 bg-white/[0.04] p-2.5 text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Section Header */}
        <div className="mt-6 flex items-center justify-between px-1">
          <h2 className="text-[0.7rem] uppercase tracking-[0.26em] text-muted-foreground/70">
            Course Folders
          </h2>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Course</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rootCourses.map((course, index) => {
            const courseNotes = notes.filter((n) => n.collectionId === course.id);
            const latestUpdate = courseNotes.reduce(
              (max, n) => Math.max(max, n.updatedAt),
              0
            );

            return (
              <div
                key={course.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenCourse(course.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenCourse(course.id);
                  }
                }}
                style={{ animationDelay: `${index * 45}ms` }}
                className="glass-panel animate-panel-in group relative cursor-pointer overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.015] hover:border-white/20"
              >
                {/* Delete course button on hover */}
                <button
                  type="button"
                  aria-label={`Delete ${course.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCourseToDelete(course);
                  }}
                  className="absolute right-3 top-3 z-10 rounded-lg border border-white/5 bg-white/[0.06] p-1.5 text-muted-foreground opacity-0 backdrop-blur-md transition-all duration-200 hover:border-destructive/30 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-primary shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] tabular-nums text-muted-foreground">
                    {courseNotes.length} {courseNotes.length === 1 ? 'note' : 'notes'}
                  </span>
                </div>

                <h3 className="mt-4 truncate text-base font-medium tracking-tight text-foreground">
                  {course.name}
                </h3>
                <p className="mt-1.5 inline-block rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground/80">
                  {course.category ?? 'General'}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[0.7rem] text-muted-foreground/70">
                    {latestUpdate ? `Last edited ${formatRelativeTime(latestUpdate)}` : 'No notes yet'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-foreground group-hover:opacity-100">
                    <span>Open Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {rootCourses.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No courses yet — add your first one.
          </p>
        )}
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="glass-panel animate-panel-in w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-base font-medium tracking-tight text-foreground">New Course</h3>
            <div className="mt-4 space-y-3">
              <input
                autoFocus
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCourse()}
                placeholder="Course title (e.g. CS50P — Python)"
                className="w-full rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-white/15 focus:outline-none"
              />
              <input
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCourse()}
                placeholder="Category (e.g. Programming)"
                className="w-full rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-white/15 focus:outline-none"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCourse}
                className="rounded-lg border border-white/10 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="glass-panel animate-panel-in w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-base font-medium tracking-tight text-foreground">
              Delete this course folder?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently removes “{courseToDelete.name}”, every collection inside it, and all of its notes. This can't be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg border border-destructive/30 bg-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition-transform hover:bg-destructive hover:text-destructive-foreground hover:scale-[1.02]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
