import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { SongMeta } from '../data/songs.types';
import { SONG_CATALOG, filterCatalogToSongsWithContent } from '../data/songs';
import { loadSongsJson } from '../data/catalogLoader';

export interface SongCatalogValue {
  catalog: SongMeta[];
  contentMap: Map<string, string>;
  loaded: boolean;
}

const SongCatalogContext = createContext<SongCatalogValue | null>(null);

/** Only songs that have full ChordPro content are shown in the catalog. */
function initialCatalog(): SongMeta[] {
  return filterCatalogToSongsWithContent(SONG_CATALOG, new Map());
}

export function SongCatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<SongMeta[]>(() => initialCatalog());
  const [contentMap, setContentMap] = useState<Map<string, string>>(() => new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSongsJson().then((result) => {
      if (result && result.songs.length > 0) {
        const seen = new Set(SONG_CATALOG.map((s) => s.id));
        const merged: SongMeta[] = [...SONG_CATALOG];
        for (const s of result.songs) {
          if (!seen.has(s.id)) {
            seen.add(s.id);
            merged.push(s);
          }
        }
        const contentMapNext = new Map(result.contentMap);
        setCatalog(filterCatalogToSongsWithContent(merged, contentMapNext));
        setContentMap((prev) => {
          const next = new Map(prev);
          result.contentMap.forEach((v, k) => next.set(k, v));
          return next;
        });
      }
      setLoaded(true);
    });
  }, []);

  const value = useMemo<SongCatalogValue>(
    () => ({ catalog, contentMap, loaded }),
    [catalog, contentMap, loaded]
  );

  return (
    <SongCatalogContext.Provider value={value}>
      {children}
    </SongCatalogContext.Provider>
  );
}

export function useSongCatalog(): SongCatalogValue {
  const ctx = useContext(SongCatalogContext);
  if (!ctx) {
    return {
      catalog: initialCatalog(),
      contentMap: new Map(),
      loaded: true,
    };
  }
  return ctx;
}
