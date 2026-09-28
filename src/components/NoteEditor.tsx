import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  Trash2,
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  Code2,
  Maximize2,
  Minimize2,
  PenLine,
  Eye,
} from 'lucide-react';
import { Note, Collection } from '../types';
import { formatRelativeTime } from '../hooks/useNotes';
import { MarkdownRenderer } from './MarkdownRenderer';

interface NoteEditorProps {
  note: Note | null;
  collections: Collection[];
  onChange: (patch: Partial<Note>) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onCreateNote: () => void;
  onBack: () => void;
  focusMode: boolean;
  onToggleFocus: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  collections,
  onChange,
  onDelete,
  onToggleFavorite,
  onCreateNote,
  onBack,
  focusMode,
  onToggleFocus,
}) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [body, setBody] = useState(note?.body ?? '');
  const [title, setTitle] = useState(note?.title ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setBody(note?.body ?? '');
    setTitle(note?.title ?? '');
  }, [note?.id, note?.body, note?.title]);

  // Debounced auto-save
  useEffect(() => {
    if (!note || (body === note.body && title === note.title)) return;
    const timer = setTimeout(() => {
      onChange({ body, title });
    }, 350);
    return () => clearTimeout(timer);
  }, [body, title, note, onChange]);

  if (!note) {
    return (
      <section className="glass-panel animate-panel-in flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl">
        <p className="text-sm text-muted-foreground">No note selected</p>
        <button
          type="button"
          onClick={onCreateNote}
          className="rounded-lg border border-white/10 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Create a note
        </button>
      </section>
    );
  }

  const handleWrap = (before: string, after: string, placeholder: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = body.slice(start, end) || placeholder;
    const newBody = `${body.slice(0, start)}${before}${selectedText}${after}${body.slice(end)}`;
    setBody(newBody);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    });
  };

  const handleInsertCodeBlock = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end) || 'print("hello world")';
    const prefix = start > 0 && body[start - 1] !== '\n' ? '\n' : '';
    const snippet = `${prefix}\`\`\`python\n${selected}\n\`\`\`\n`;
    setBody(`${body.slice(0, start)}${snippet}${body.slice(end)}`);
    const newCursor = start + prefix.length + 10;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursor, newCursor + selected.length);
    });
  };

  return (
    <section className="glass-panel animate-panel-in flex h-full w-full flex-col rounded-2xl">
      {/* Top Header */}
      <header className="flex flex-wrap items-center gap-3 border-b border-white/5 px-6 py-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to notes"
            className="rounded-lg border border-white/5 bg-white/[0.04] p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled note"
          className="min-w-0 flex-1 bg-transparent text-lg font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />

        <div className="flex items-center gap-1.5">
          <select
            value={note.collectionId ?? ''}
            onChange={(e) => onChange({ collectionId: e.target.value || null })}
            className="rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-1.5 text-xs text-muted-foreground focus:border-white/15 focus:outline-none"
          >
            <option value="" className="bg-[#12131a] text-foreground">No collection</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id} className="bg-[#12131a] text-foreground">
                {col.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label="Favorite"
            onClick={onToggleFavorite}
            className="rounded-lg border border-white/5 bg-white/[0.04] p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Star
              className={`h-3.5 w-3.5 ${
                note.favorite ? 'fill-current text-code-variable' : ''
              }`}
            />
          </button>

          <button
            type="button"
            aria-label="Delete note"
            onClick={onDelete}
            className="rounded-lg border border-white/5 bg-white/[0.04] p-2 text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Formatting & Controls Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-6 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Bold"
            onClick={() => handleWrap('**', '**', 'bold text')}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Italic"
            onClick={() => handleWrap('_', '_', 'italic text')}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Code"
            onClick={() => handleWrap('`', '`', 'code')}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Link"
            onClick={() => handleWrap('[', '](https://)', 'label')}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Insert code block"
            onClick={handleInsertCodeBlock}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <Code2 className="h-3.5 w-3.5" />
          </button>

          <span className="ml-2 hidden text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground/60 sm:inline">
            saved {formatRelativeTime(note.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={focusMode ? 'Exit focus mode' : 'Focus mode'}
            onClick={onToggleFocus}
            className="rounded-lg border border-white/5 bg-white/[0.04] p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {focusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/[0.03] p-0.5">
            <button
              type="button"
              onClick={() => setMode('write')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs capitalize transition-colors ${
                mode === 'write'
                  ? 'bg-white/[0.08] text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PenLine className="h-3 w-3" />
              <span>write</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs capitalize transition-colors ${
                mode === 'preview'
                  ? 'bg-white/[0.08] text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div
        key={`${note.id}-${mode}`}
        className="animate-fade-swap scroll-sleek min-h-0 flex-1 editor-text overflow-y-auto bg-code-bg/70 p-6"
      >
        {mode === 'write' ? (
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write in Markdown. Fenced code blocks use GitHub Dark colors."
            className="h-full min-h-[420px] w-full resize-none bg-transparent editor-text font-mono text-code-fg placeholder:text-code-comment focus:outline-none"
            spellCheck={false}
          />
        ) : (
          <MarkdownRenderer content={body} />
        )}
      </div>
    </section>
  );
};
