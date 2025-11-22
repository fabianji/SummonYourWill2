// Página de detalle que muestra datos y contenidos relacionados a una guía.
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DiaryCard from "../components/DiaryCard";
import MediaCard from "../components/MediaCard";
import { fetchGuide, fetchDiaryEntries, fetchMedia } from "../services/api";

const GuideDetailPage = () => {
  // Lee el ID de la guía desde la URL.
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    // Carga información de la guía y sus recursos asociados.
    fetchGuide(id).then(setGuide).catch(console.error);
    fetchDiaryEntries({ guide_id: id }).then(setDiaryEntries).catch(console.error);
    fetchMedia({ guide_id: id }).then(setMedia).catch(console.error);
  }, [id]);

  if (!guide) {
    // Estado de carga mientras se obtiene la guía.
    return (
      <div className="page">
        <p className="muted">Loading guide...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <section>
        <h2>{guide.name}</h2>
        {guide.description && <p>{guide.description}</p>}
        {guide.domains?.length > 0 && (
          <div className="tag-row">
            {guide.domains.map((domain) => (
              <span key={domain} className="chip">
                {domain}
              </span>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-header">
          <h3>Diary entries for this guide</h3>
        </div>
        <div className="grid">
          {diaryEntries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
          {diaryEntries.length === 0 && <p className="muted">No diary entries yet.</p>}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h3>Media linked to this guide</h3>
        </div>
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

export default GuideDetailPage;
