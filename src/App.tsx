import React, { useState, useEffect } from 'react';
import { PanelLeftClose, FileText, Minimize2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useNotes } from './hooks/useNotes';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { EngineCustomizationModal } from './components/EngineCustomizationModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const notesHook = useNotes();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [noteListOpen, setNoteListOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'workspace'>('dashboard');

  // Media query check for mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenCourse = (courseId: string) => {
    notesHook.setActiveCourseId(courseId);
    notesHook.setFilter({ kind: 'all' });
    notesHook.setSelectedId(null);
    notesHook.setQuery('');
    setView('workspace');
  };

  const handleBackToCourses = () => {
    notesHook.setActiveCourseId(null);
    notesHook.setFilter({ kind: 'all' });
    notesHook.setSelectedId(null);
    setView('dashboard');
  };

  const handleEnterFocus = () => {
    setFocusMode(true);
    setSidebarOpen(false);
    setNoteListOpen(false);
  };

  const handleExitFocus = () => {
    setFocusMode(false);
    if (!isMobile) {
      setSidebarOpen(true);
      setNoteListOpen(true);
    }
  };

  if (loading) {
    return <div className="app-backdrop min-h-screen w-full" />;
  }

  if (!user) {
    return <AuthModal />;
  }

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard
          collections={notesHook.courses}
          notes={notesHook.notes}
          onOpenCourse={handleOpenCourse}
          onAddCourse={(name, category) => notesHook.addCollection(name, category, null)}
          onDeleteCourse={notesHook.deleteCourse}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <EngineCustomizationModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      </>
    );
  }

  const { filter } = notesHook;
  const listTitle =
    filter.kind === 'all'
      ? notesHook.activeCourse?.name ?? 'All Notes'
      : filter.kind === 'favorites'
      ? 'Favorites'
      : notesHook.collections.find((c) => c.id === filter.id)?.name ?? 'Collection';

  return (
    <main className="app-backdrop relative min-h-screen w-full overflow-hidden">
      <div className="grain-overlay pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex h-screen max-w-[1700px] gap-4 p-4">
        {/* Mobile Slide-over backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Column 1: Sidebar */}
        {isMobile ? (
          <div
            className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[300px] p-4 transition-transform duration-300 ease-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar
              collections={notesHook.courseChildren}
              counts={notesHook.counts}
              filter={notesHook.filter}
              onFilterChange={(f) => {
                notesHook.setFilter(f);
                if (isMobile) setSidebarOpen(false);
              }}
              query={notesHook.query}
              onQueryChange={notesHook.setQuery}
              onCreateNote={() => {
                notesHook.createNote();
                if (isMobile) setSidebarOpen(false);
              }}
              onAddCollection={(name, cat) =>
                notesHook.addCollection(name, cat, notesHook.activeCourseId)
              }
              onDeleteCollection={notesHook.deleteCollection}
              onCollapse={() => setSidebarOpen(false)}
              onOpenSettings={() => setSettingsOpen(true)}
              onBackToCourses={handleBackToCourses}
            />
          </div>
        ) : (
          <div
            className={`shrink-0 overflow-hidden transition-all duration-500 ease-out ${
              sidebarOpen ? 'w-[248px] opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <Sidebar
              collections={notesHook.courseChildren}
              counts={notesHook.counts}
              filter={notesHook.filter}
              onFilterChange={notesHook.setFilter}
              query={notesHook.query}
              onQueryChange={notesHook.setQuery}
              onCreateNote={notesHook.createNote}
              onAddCollection={(name, cat) =>
                notesHook.addCollection(name, cat, notesHook.activeCourseId)
              }
              onDeleteCollection={notesHook.deleteCollection}
              onCollapse={() => setSidebarOpen(false)}
              onOpenSettings={() => setSettingsOpen(true)}
              onBackToCourses={handleBackToCourses}
            />
          </div>
        )}

        {/* Column 2: Note List */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-500 ease-out ${
            noteListOpen
              ? `w-full lg:block lg:w-[330px] ${notesHook.selectedId ? 'hidden' : 'block'}`
              : 'hidden w-0 opacity-0'
          }`}
        >
          <NoteList
            title={listTitle}
            notes={notesHook.visibleNotes}
            collections={notesHook.collections}
            selectedId={notesHook.selectedId}
            onSelect={(id) => {
              notesHook.setSelectedId(id);
            }}
            onToggleFavorite={notesHook.toggleFavorite}
            onCollapse={() => setNoteListOpen(false)}
          />
        </div>

        {/* Column 3: Note Editor */}
        <div
          className={`min-w-0 flex-1 lg:block ${
            notesHook.selectedId || !noteListOpen ? 'block' : 'hidden'
          }`}
        >
          <NoteEditor
            note={notesHook.selected}
            collections={notesHook.collections}
            onChange={(patch) => {
              if (notesHook.selected) notesHook.updateNote(notesHook.selected.id, patch);
            }}
            onDelete={() => {
              if (notesHook.selected) notesHook.deleteNote(notesHook.selected.id);
            }}
            onToggleFavorite={() => {
              if (notesHook.selected) notesHook.toggleFavorite(notesHook.selected.id);
            }}
            onCreateNote={notesHook.createNote}
            onBack={() => notesHook.setSelectedId(null)}
            focusMode={focusMode}
            onToggleFocus={() => (focusMode ? handleExitFocus() : handleEnterFocus())}
          />
        </div>
      </div>

      {/* Floating Toggle Controls */}
      {!sidebarOpen && !focusMode && (
        <button
          type="button"
          aria-label="Show sidebar"
          onClick={() => setSidebarOpen(true)}
          className="glass-panel animate-panel-in fixed left-5 top-5 z-30 rounded-xl border border-white/10 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <PanelLeftClose className="h-4 w-4 rotate-180" />
        </button>
      )}

      {!noteListOpen && !focusMode && (
        <button
          type="button"
          aria-label="Show note list"
          onClick={() => setNoteListOpen(true)}
          className="glass-panel animate-panel-in fixed bottom-5 left-5 z-30 rounded-xl border border-white/10 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <FileText className="h-4 w-4" />
        </button>
      )}

      {/* Exit Focus Mode Floating Pill */}
      {focusMode && (
        <button
          type="button"
          onClick={handleExitFocus}
          className="glass-panel animate-panel-in fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          <span>Exit Focus Mode</span>
        </button>
      )}

      {/* Settings Modal */}
      <EngineCustomizationModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
};
export default App;
