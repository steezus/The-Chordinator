import { Link, useParams } from 'react-router-dom';
import { getTopSongs, getRandomSongs, type SongMeta } from '../data/songs';
import { useSongCatalog } from '../context/SongCatalogContext';
import './HomePage.css';

const N = 99;

export function SongListPage() {
  const { type } = useParams<{ type: 'random' | 'top' }>();
  const { catalog } = useSongCatalog();
  const isTop = type === 'top';
  const songs: SongMeta[] = isTop
    ? getTopSongs(N, catalog)
    : getRandomSongs(N, 123, catalog);
  const title = isTop ? '99 Top songs' : '99 Random songs';

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__brand">{title}</h1>
        <Link to="/" className="home__tagline" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
          ← Back to home
        </Link>
      </section>
      <section className="home__section">
        <ul className="home__song-list">
          {songs.map((s) => (
            <li key={s.id}>
              <Link to={`/song/${s.id}`} className="home__song-link">
                <span className="home__song-title">{s.title}</span>
                <span className="home__song-artist">{s.artist}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
