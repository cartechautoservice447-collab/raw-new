import React, { useState } from 'react';
import {
  FileText,
  Star,
  Folder,
  Plus,
  Search,
  Settings,
  PanelLeftClose,
  ArrowLeft,
  Check,
  Trash2,
  LogOut,
} from 'lucide-react';
import { Collection, FilterState } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  collections: Collection[];
  counts: { all: number; favorites: number; byCollection: Record<string, number> };
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onCreateNote: () => void;
  onAddCollection: (name: string, category?: string) => void;
  onDeleteCollection: (id: string) => void;
  onCollapse: () => void;
  onOpenSettings: () => void;
  onBackToCourses: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collections,
  counts,
  filter,
  onFilterChange,
  query,
  onQueryChange,
  onCreateNote,
  onAddCollection,
  onDeleteCollection,
  onCollapse,
  onOpenSettings,
  onBackToCourses,
}) => {
  const { user, signOut } = useAuth();
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColName, setNewColName] = useState('');

  const handleSaveCollection = () => {
    if (newColName.trim()) {
      onAddCollection(newColName.trim());
      setNewColName('');
      setIsAddingCol(false);
    }
  };

  const displayName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student';

  return (
    <aside className="glass-panel animate-panel-in flex h-full w-full flex-col gap-5 rounded-2xl p-4">
      {/* Brand Header */}
      <div className="flex items-start justify-between gap-2 px-1 pt-1">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground/70">Glass</p>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Notes</h1>
        </div>
        <button
          type="button"
          aria-label="Collapse sidebar"
          onClick={onCollapse}
          className="rounded-lg border border-white/5 bg-white/[0.04] p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Back to courses */}
      <button
        type="button"
        onClick={onBackToCourses}
        className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-white/15 hover:bg-white/[0.07] hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>All Courses</span>
      </button>

      {/* New Note Button */}
      <button
        type="button"
        onClick={onCreateNote}
        className="animate-pulse-glow flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" />
        <span>New Note</span>
      </button>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search notes"
          className="w-full rounded-lg border border-white/5 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-white/15 focus:outline-none"
        />
      </div>

      {/* Primary Navigation */}
      <nav className="space-y-1">
        <div
          className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
            filter.kind === 'all'
              ? 'border-white/10 bg-white/[0.08] text-foreground'
              : 'border-transparent text-muted-foreground hover:border-white/5 hover:bg-white/[0.04] hover:text-foreground'
          }`}
        >
          <button
            type="button"
            onClick={() => onFilterChange({ kind: 'all' })}
            className="flex flex-1 items-center gap-2.5 text-left"
          >
            <FileText className="h-4 w-4 opacity-80" />
            <span className="truncate">All Notes</span>
          </button>
          <span className="text-[0.7rem] tabular-nums text-muted-foreground/70">{counts.all}</span>
        </div>

        <div
          className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
            filter.kind === 'favorites'
              ? 'border-white/10 bg-white/[0.08] text-foreground'
              : 'border-transparent text-muted-foreground hover:border-white/5 hover:bg-white/[0.04] hover:text-foreground'
          }`}
        >
          <button
            type="button"
            onClick={() => onFilterChange({ kind: 'favorites' })}
            className="flex flex-1 items-center gap-2.5 text-left"
          >
            <Star className="h-4 w-4 opacity-80" />
            <span className="truncate">Favorites</span>
          </button>
          <span className="text-[0.7rem] tabular-nums text-muted-foreground/70">
            {counts.favorites}
          </span>
        </div>
      </nav>

      {/* Collections Section */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground/70">
            Collections
          </span>
          <button
            type="button"
            aria-label="New collection"
            onClick={() => setIsAddingCol(true)}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="scroll-sleek min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {collections.map((col) => {
            const active = filter.kind === 'collection' && filter.id === col.id;
            return (
              <div
                key={col.id}
                className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                  active
                    ? 'border-white/10 bg-white/[0.08] text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-white/5 hover:bg-white/[0.04] hover:text-foreground'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onFilterChange({ kind: 'collection', id: col.id })}
                  className="flex flex-1 items-center gap-2.5 text-left"
                >
                  <Folder className="h-4 w-4 opacity-80" />
                  <span className="truncate">{col.name}</span>
                </button>
                <span className="text-[0.7rem] tabular-nums text-muted-foreground/70">
                  {counts.byCollection[col.id] ?? 0}
                </span>
                <button
                  type="button"
                  aria-label={`Delete ${col.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCollection(col.id);
                  }}
                  className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}

          {isAddingCol && (
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <input
                autoFocus
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCollection();
                  if (e.key === 'Escape') {
                    setNewColName('');
                    setIsAddingCol(false);
                  }
                }}
                placeholder="Collection name"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveCollection}
                aria-label="Save collection"
                className="text-primary hover:opacity-80"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Button */}
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>

      {/* User Profile Footer */}
      {user && (
        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-xs font-medium text-foreground">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground font-medium">{displayName}</p>
            {user.email && user.email !== displayName && (
              <p className="truncate text-[0.68rem] text-muted-foreground/70">{user.email}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Log out"
            title="Log out"
            onClick={() => void signOut()}
            className="rounded-lg border border-white/5 bg-white/[0.04] p-2 text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
