import { Link } from 'react-router-dom';
import { getFavoriteSongs, type SongMeta } from '../data/songs';
import { useSongCatalog } from '../context/SongCatalogContext';
import './HomePage.css';

export function HomePage() {
  const { catalog } = useSongCatalog();
  const songs = getFavoriteSongs(catalog);

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__brand">The Chordinator</h1>
        <p className="home__tagline">Chord diagrams in sync with your lyrics</p>
        <p className="home__import-link">
          <Link to="/piano-reference">Piano chord reference</Link>
        </p>
      </section>

      <section className="home__section">
        <h2 className="home__section-head">Songs</h2>
        <ul className="home__song-list">
          {songs.map((s) => (
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
