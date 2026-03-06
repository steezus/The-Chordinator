import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTopSongs, getRandomSongs, searchSongs, type SongMeta } from '../data/songs';
import { useSongCatalog } from '../context/SongCatalogContext';
import './HomePage.css';

const TOP_N = 5;
const RANDOM_N = 5;

export function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { catalog } = useSongCatalog();
  const topSongs = getTopSongs(TOP_N, catalog);
  const randomSongs = getRandomSongs(RANDOM_N, 42, catalog);
  const searchResults = query.trim() ? searchSongs(query, 10, catalog) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      const results = searchSongs(q, 1, catalog);
      if (results[0]) navigate(`/song/${results[0].id}`);
    }
  };

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__brand">The Chordinator</h1>
        <p className="home__tagline">Chord diagrams in sync with your lyrics</p>
        <p className="home__import-link">
          <Link to="/import">Import from Lyrics On Demand</Link>
          {' · '}
          <Link to="/piano-reference">Piano chord reference</Link>
        </p>
        <form className="home__search" onSubmit={handleSearch}>
          <input
            type="search"
            className="home__search-input"
            placeholder="Search songs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search songs"
          />
          <button type="submit" className="home__search-btn">
            Search
          </button>
        </form>
        {searchResults.length > 0 && (
          <ul className="home__search-results">
            {searchResults.map((s) => (
              <li key={s.id}>
                <Link to={`/song/${s.id}`} className="home__search-result-link">
                  {s.title} — {s.artist}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="home__section">
        <h2 className="home__section-head">
          <Link to="/songs/random" className="home__section-link">
            99 Random songs
          </Link>
        </h2>
        <ul className="home__song-list">
          {randomSongs.map((s) => (
            <SongItem key={s.id} song={s} />
          ))}
        </ul>
      </section>

      <section className="home__section">
        <h2 className="home__section-head">
          <Link to="/songs/top" className="home__section-link">
            99 Top songs
          </Link>
        </h2>
        <ul className="home__song-list">
          {topSongs.map((s) => (
            <SongItem key={s.id} song={s} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function SongItem({ song }: { song: SongMeta }) {
  return (
    <li>
      <Link to={`/song/${song.id}`} className="home__song-link">
        <span className="home__song-title">{song.title}</span>
        <span className="home__song-artist">{song.artist}</span>
      </Link>
    </li>
  );
}
