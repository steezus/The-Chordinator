import { Routes, Route } from 'react-router-dom';
import { SongCatalogProvider } from './context/SongCatalogContext';
import { HomePage } from './pages/HomePage';
import { SongPage } from './pages/SongPage';
import { SongListPage } from './pages/SongListPage';

function App() {
  return (
    <SongCatalogProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/song/:id" element={<SongPage />} />
        <Route path="/songs/:type" element={<SongListPage />} />
      </Routes>
    </SongCatalogProvider>
  );
}

export default App;
