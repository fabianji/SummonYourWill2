// Página para crear y filtrar elementos de media.
import { useEffect, useState } from "react";
import MediaCard from "../components/MediaCard";
import { fetchGuides, fetchMedia, createMedia } from "../services/api";

const initialForm = {
  title: "",
  description: "",
  media_type: "music",
  url: "",
  guide_ids: [],
  tags: "",
};

const MediaPage = () => {
  // Estado de guías, items de media, formulario, filtros y carga.
  const [guides, setGuides] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({ media_type: "", guide_id: "" });
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    // Recupera media con filtros actuales y lista de guías.
    fetchMedia(filters).then(setItems).catch(console.error);
    fetchGuides().then(setGuides).catch(console.error);
  };

  useEffect(() => {
    // Carga inicial de datos al montar el componente.
    loadData();
  }, []);

  useEffect(() => {
    // Recarga media cuando cambian los filtros.
    fetchMedia(filters).then(setItems).catch(console.error);
  }, [filters]);

  const toggleGuide = (id) => {
    // Añade o remueve IDs de guías seleccionadas en el formulario.
    setForm((prev) => ({
      ...prev,
      guide_ids: prev.guide_ids.includes(id)
        ? prev.guide_ids.filter((g) => g !== id)
        : [...prev.guide_ids, id],
    }));
  };

  const handleSubmit = async (e) => {
    // Crea un nuevo item de media desde el formulario controlado.
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };
      await createMedia(payload);
      setForm(initialForm);
      loadData();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section>
        <h2>Add Media</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Media type
            <select
              value={form.media_type}
              onChange={(e) => setForm({ ...form, media_type: e.target.value })}
            >
              <option value="music">Music</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label>
            URL
            <input
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </label>
          <label>
            Guides
            <div className="checkbox-group">
              {guides.map((guide) => (
                <label key={guide.id} className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.guide_ids.includes(guide.id)}
                    onChange={() => toggleGuide(guide.id)}
                  />
                  {guide.name}
                </label>
              ))}
            </div>
          </label>
          <label>
            Tags (comma separated)
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </label>
          <button className="button" disabled={loading}>
            {loading ? "Saving..." : "Save media"}
          </button>
        </form>
      </section>

      <section>
        <div className="section-header">
          <h2>Media</h2>
          <div className="filters">
            <select
              value={filters.media_type}
              onChange={(e) => setFilters({ ...filters, media_type: e.target.value })}
            >
              <option value="">All types</option>
              <option value="music">Music</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <select
              value={filters.guide_id}
              onChange={(e) => setFilters({ ...filters, guide_id: e.target.value })}
            >
              <option value="">All guides</option>
              {guides.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
          {items.length === 0 && <p className="muted">No media found.</p>}
        </div>
      </section>
    </div>
  );
};

export default MediaPage;
