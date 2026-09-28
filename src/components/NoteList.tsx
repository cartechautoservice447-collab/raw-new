import React from 'react';
import { Star, PanelLeftClose } from 'lucide-react';
import { Note, Collection } from '../types';
import { formatRelativeTime, stripMarkdownExcerpt } from '../hooks/useNotes';

interface NoteListProps {
  title: string;
  notes: Note[];
  collections: Collection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCollapse: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  title,
  notes,
  collections,
  selectedId,
  onSelect,
  onToggleFavorite,
  onCollapse,
}) => {
  return (
    <section className="glass-panel animate-panel-in flex h-full w-full flex-col rounded-2xl">
      {/* Header */}
      <header className="flex items-center justify-between gap-2 border-b border-white/5 px-5 py-3.5">
        <h2 className="text-sm font-medium tracking-[0.06em] text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-[0.7rem] tabular-nums text-muted-foreground/70">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </span>
          <button
            type="button"
            aria-label="Collapse note list"
            onClick={onCollapse}
            className="rounded-lg border border-white/5 bg-white/[0.04] p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Note Cards List */}
      <div className="scroll-sleek min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
        {notes.length === 0 ? (
          <p className="px-3 py-10 text-center text-sm text-muted-foreground">Nothing here yet.</p>
        ) : (
          notes.map((note, index) => {
            const isActive = note.id === selectedId;
            const collection = collections.find((c) => c.id === note.collectionId);

            return (
              <button
                key={note.id}
                type="button"
                onClick={() => onSelect(note.id)}
                style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
                className={`group liquid-surface animate-card-in w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-accent/40 bg-white/[0.08] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]'
                    : 'border-white/5 bg-white/[0.03] hover:-translate-y-0.5 hover:scale-[1.015] hover:border-white/15 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-sm font-medium tracking-tight text-foreground">
                    {note.title || 'Untitled note'}
                  </h3>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(note.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite(note.id);
                      }
                    }}
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        note.favorite ? 'fill-current text-code-variable' : ''
                      }`}
                    />
                  </span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {stripMarkdownExcerpt(note.body) || 'Empty note'}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  <span>{formatRelativeTime(note.updatedAt)}</span>
                  {collection && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-current" />
                      <span className="truncate">{collection.name}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
};
