import { useState, useEffect, useMemo, useCallback } from 'react';
import { Note, Collection, FilterState } from '../types';

const STORAGE_KEY = 'glass-notes:v1';

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const ONE_DAY_MS = 86400000;
const NOW = Date.now();

export const getDefaultStore = (): { collections: Collection[]; notes: Note[] } => {
  const colEngineering: Collection = {
    id: 'col-engineering',
    name: 'CS50P — Python',
    category: 'Programming',
  };
  const colIdeas: Collection = {
    id: 'col-ideas',
    name: 'Web Development',
    category: 'Frontend',
  };

  const collections: Collection[] = [
    colEngineering,
    colIdeas,
    {
      id: 'col-cs50x',
      name: 'CS50x — Computer Science',
      category: 'Fundamentals',
    },
    {
      id: 'col-eng-notes',
      name: 'Engineering Notes',
      category: 'General',
    },
    {
      id: 'col-cs50p-l0',
      name: 'Lecture 0',
      parentId: colEngineering.id,
    },
    {
      id: 'col-cs50p-l1',
      name: 'Lecture 1',
      parentId: colEngineering.id,
    },
    {
      id: 'col-web-ideas',
      name: 'Ideas',
      parentId: colIdeas.id,
    },
  ];

  const notes: Note[] = [
    {
      id: generateId(),
      title: 'Python — greeting script',
      favorite: true,
      collectionId: colEngineering.id,
      createdAt: NOW - ONE_DAY_MS * 1,
      updatedAt: NOW - ONE_DAY_MS * 1,
      body: `A tiny script kept around for syntax reference.

\`\`\`python
import sys


class Greeter:
    def __init__(self, name):
        self.name = name

    def hello(self, to="world"):
        # Output using an f-string
        return f"Hello, {to}! I am {self.name}."


def main():
    name = input("What's your name? ")
    print(Greeter(name).hello())
    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            print(arg)


main()
\`\`\`

Note the token colors: keywords are coral, functions lavender, strings ice blue.`,
    },
    {
      id: generateId(),
      title: 'Glass panel recipe',
      favorite: false,
      collectionId: colIdeas.id,
      createdAt: NOW - ONE_DAY_MS * 3,
      updatedAt: NOW - ONE_DAY_MS * 2,
      body: `Three ingredients make a panel feel like real glass:

1. **Blur** behind the surface, never on the content
2. A *hairline* border to catch light at the edge
3. Layered, diffuse shadow so it floats

\`\`\`ts
export const glass = (blur: number) => ({
  backdropFilter: \`blur(\${blur}px) saturate(140%)\`,
  border: "1px solid rgba(255,255,255,0.06)",
});
\`\`\``,
    },
    {
      id: generateId(),
      title: 'Reading list',
      favorite: false,
      collectionId: null,
      createdAt: NOW - ONE_DAY_MS * 6,
      updatedAt: NOW - ONE_DAY_MS * 5,
      body: `- Designing interfaces with depth
- The typography of software
- \`prefers-reduced-motion\` and restraint

> Good motion is felt, not noticed.`,
    },
  ];

  return { collections, notes };
};

export const formatRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < ONE_DAY_MS) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 7 * ONE_DAY_MS) return `${Math.floor(diff / ONE_DAY_MS)}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const stripMarkdownExcerpt = (body: string, maxLength = 120): string => {
  const clean = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}…` : clean;
};

const getRootCourses = (collections: Collection[]) =>
  collections.filter((c) => !c.parentId);

const getSubCollections = (collections: Collection[], parentId: string) =>
  collections.filter((c) => c.parentId === parentId);

const getDescendantCollectionIds = (collections: Collection[], parentId: string) =>
  new Set([parentId, ...getSubCollections(collections, parentId).map((c) => c.id)]);

export function useNotes() {
  const [store, setStore] = useState<{ collections: Collection[]; notes: Note[] }>({
    notes: [],
    collections: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ kind: 'all' });
  const [query, setQuery] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Load from storage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getDefaultStore();
        setStore(initial);
        setSelectedId(initial.notes[0]?.id ?? null);
      } else {
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.notes)) {
          const initial = getDefaultStore();
          setStore(initial);
          setSelectedId(initial.notes[0]?.id ?? null);
        } else {
          setStore({
            notes: parsed.notes,
            collections: parsed.collections ?? [],
          });
          setSelectedId(parsed.notes[0]?.id ?? null);
        }
      }
    } catch {
      const initial = getDefaultStore();
      setStore(initial);
      setSelectedId(initial.notes[0]?.id ?? null);
    }
    setHydrated(true);
  }, []);

  // Sync to storage
  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch (err) {
        console.error('Failed to sync notes', err);
      }
    }
  }, [store, hydrated]);

  const courses = useMemo(() => getRootCourses(store.collections), [store.collections]);

  const activeCourse = useMemo(
    () => store.collections.find((c) => c.id === activeCourseId) ?? null,
    [store.collections, activeCourseId]
  );

  const courseChildren = useMemo(
    () => (activeCourseId ? getSubCollections(store.collections, activeCourseId) : []),
    [store.collections, activeCourseId]
  );

  const activeScopeCollectionIds = useMemo(
    () => (activeCourseId ? getDescendantCollectionIds(store.collections, activeCourseId) : null),
    [store.collections, activeCourseId]
  );

  const scopedNotes = useMemo(
    () =>
      activeScopeCollectionIds
        ? store.notes.filter((n) => n.collectionId && activeScopeCollectionIds.has(n.collectionId))
        : store.notes,
    [store.notes, activeScopeCollectionIds]
  );

  const visibleNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopedNotes
      .filter((n) => {
        if (filter.kind === 'favorites' && !n.favorite) return false;
        if (filter.kind === 'collection' && n.collectionId !== filter.id) return false;
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [scopedNotes, filter, query]);

  const selected = useMemo(
    () => store.notes.find((n) => n.id === selectedId) ?? null,
    [store.notes, selectedId]
  );

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled note',
      body: '',
      favorite: false,
      collectionId: filter.kind === 'collection' ? filter.id : activeCourseId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setStore((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
    setSelectedId(newNote.id);
    setQuery('');
    return newNote.id;
  }, [filter, activeCourseId]);

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setStore((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n
      ),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, favorite: !n.favorite } : n
      ),
    }));
  }, []);

  const addCollection = useCallback((name: string, category?: string, parentId?: string | null) => {
    const newCol: Collection = {
      id: generateId(),
      name: name.trim() || 'Untitled',
      category: category?.trim() || undefined,
      parentId: parentId ?? null,
    };
    setStore((prev) => ({
      ...prev,
      collections: [...prev.collections, newCol],
    }));
    return newCol.id;
  }, []);

  const renameCollection = useCallback((id: string, name: string) => {
    setStore((prev) => ({
      ...prev,
      collections: prev.collections.map((c) =>
        c.id === id ? { ...c, name: name.trim() } : c
      ),
    }));
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== id),
      notes: prev.notes.map((n) =>
        n.collectionId === id ? { ...n, collectionId: null } : n
      ),
    }));
    setFilter((prev) => (prev.kind === 'collection' && prev.id === id ? { kind: 'all' } : prev));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setStore((prev) => {
      const descendants = getDescendantCollectionIds(prev.collections, id);
      return {
        collections: prev.collections.filter((c) => !descendants.has(c.id)),
        notes: prev.notes.filter(
          (n) => !(n.collectionId && descendants.has(n.collectionId))
        ),
      };
    });
    setSelectedId(null);
    setFilter((prev) => (prev.kind === 'collection' && prev.id === id ? { kind: 'all' } : prev));
    setActiveCourseId((prev) => (prev === id ? null : prev));
  }, []);

  const counts = useMemo(() => {
    const byCollection: Record<string, number> = {};
    for (const note of store.notes) {
      if (note.collectionId) {
        byCollection[note.collectionId] = (byCollection[note.collectionId] ?? 0) + 1;
      }
    }
    return {
      all: scopedNotes.length,
      favorites: scopedNotes.filter((n) => n.favorite).length,
      byCollection,
    };
  }, [store.notes, scopedNotes]);

  return {
    hydrated,
    notes: store.notes,
    collections: store.collections,
    courses,
    activeCourseId,
    setActiveCourseId,
    activeCourse,
    courseChildren,
    visibleNotes,
    selected,
    selectedId,
    setSelectedId,
    filter,
    setFilter,
    query,
    setQuery,
    counts,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    addCollection,
    renameCollection,
    deleteCollection,
    deleteCourse,
  };
}
