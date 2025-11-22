import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import GuidesPage from "./pages/Guides";
import GuideDetailPage from "./pages/GuideDetail";
import DiaryPage from "./pages/Diary";
import AbilitiesPage from "./pages/Abilities";
import MediaPage from "./pages/Media";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideDetailPage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/abilities" element={<AbilitiesPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
