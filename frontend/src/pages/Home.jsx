// Página de inicio que muestra resúmenes de guías, diario, habilidades y media.
import { useEffect, useState } from "react";
import GuideCard from "../components/GuideCard";
import DiaryCard from "../components/DiaryCard";
import AbilityCard from "../components/AbilityCard";
import MediaCard from "../components/MediaCard";
import { fetchGuides, fetchDiaryEntries, fetchAbilities, fetchMedia } from "../services/api";

const HomePage = () => {
  // Estados locales para cada tipo de entidad mostrada en la portada.
  const [guides, setGuides] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    // Carga las colecciones y limita las listas para mostrar solo las más recientes.
    fetchGuides().then(setGuides).catch(console.error);
    fetchDiaryEntries().then((entries) => setDiaryEntries(entries.slice(0, 3))).catch(console.error);
    fetchAbilities().then((items) => setAbilities(items.slice(0, 3))).catch(console.error);
    fetchMedia().then((items) => setMedia(items.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div className="page">
      <section>
        <h2>Guides overview</h2>
        <div className="grid">
          {guides.slice(0, 3).map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
          {guides.length === 0 && <p className="muted">No guides yet.</p>}
        </div>
      </section>

      <section>
        <h2>Recent diary entries</h2>
        <div className="grid">
          {diaryEntries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
          {diaryEntries.length === 0 && <p className="muted">No diary entries yet.</p>}
        </div>
      </section>

      <section>
        <h2>Recent abilities</h2>
        <div className="grid">
          {abilities.map((ability) => (
            <AbilityCard key={ability.id} ability={ability} />
          ))}
          {abilities.length === 0 && <p className="muted">No abilities yet.</p>}
        </div>
      </section>

      <section>
        <h2>Recent media</h2>
        <div className="grid">
          {media.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
          {media.length === 0 && <p className="muted">No media yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
