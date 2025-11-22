// Enrutador principal que conecta las páginas con la barra de navegación.
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import GuidesPage from "./pages/Guides";
import GuideDetailPage from "./pages/GuideDetail";
import DiaryPage from "./pages/Diary";
import AbilitiesPage from "./pages/Abilities";
import MediaPage from "./pages/Media";
import NavBar from "./components/NavBar";

function App() {
  // Renderiza la estructura general: barra de navegación y área de contenido.
  return (
    <div className="app-container">
      <NavBar />
      <main className="content">
        <Routes>
          {/* Ruta de inicio con panel de resumen */}
          <Route path="/" element={<HomePage />} />
          {/* Listado y creación de guías */}
          <Route path="/guides" element={<GuidesPage />} />
          {/* Detalle de guía con información relacionada */}
          <Route path="/guides/:id" element={<GuideDetailPage />} />
          {/* Página de diario con filtros y formulario */}
          <Route path="/diary" element={<DiaryPage />} />
          {/* Página de habilidades */}
          <Route path="/abilities" element={<AbilitiesPage />} />
          {/* Página de media con filtros */}
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
