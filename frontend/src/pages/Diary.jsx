// Página de diario con filtros y formulario de creación de entradas.
import { useEffect, useMemo, useState } from "react";
import DiaryCard from "../components/DiaryCard";
import { fetchGuides, fetchDiaryEntries, createDiaryEntry } from "../services/api";

const initialForm = {
  title: "",
  content: "",
  entry_type: "personal",
  guide_ids: [],
  mood_tags: "",
};

const DiaryPage = () => {
  // Estado de entradas, guías disponibles, formulario, filtros y carga.
  const [entries, setEntries] = useState([]);
  const [guides, setGuides] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({ entry_type: "", guide_id: "" });
  const [loading, setLoading] = useState(false);

  const loadEntries = () => fetchDiaryEntries(filters).then(setEntries).catch(console.error);

  useEffect(() => {
    // Carga guías para permitir selección en formularios y filtros.
    fetchGuides().then(setGuides).catch(console.error);
  }, []);

  useEffect(() => {
    // Vuelve a cargar entradas cuando cambian los filtros seleccionados.
    loadEntries();
  }, [filters]);

  const handleSubmit = async (e) => {
    // Procesa la creación de una nueva entrada de diario.
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        mood_tags: form.mood_tags ? form.mood_tags.split(",").map((t) => t.trim()) : [],
      };
      await createDiaryEntry(payload);
      setForm(initialForm);
      loadEntries();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Memo simple por consistencia; en futuro podría filtrar guías.
  const filteredGuides = useMemo(() => guides, [guides]);

  return (
    <div className="page">
      <section>
        <h2>Add Diary Entry</h2>
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
            Content
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </label>
          <label>
            Entry type
            <select
              value={form.entry_type}
              onChange={(e) => setForm({ ...form, entry_type: e.target.value })}
            >
              <option value="personal">Personal</option>
              <option value="single_guide">Single guide</option>
              <option value="multi_guide">Multi guide</option>
            </select>
          </label>
          <label>
            Guides
            <div className="checkbox-group">
              {filteredGuides.map((guide) => (
                <label key={guide.id} className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.guide_ids.includes(guide.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, guide_ids: [...form.guide_ids, guide.id] });
                      } else {
                        setForm({
                          ...form,
                          guide_ids: form.guide_ids.filter((id) => id !== guide.id),
                        });
                      }
                    }}
                  />
                  {guide.name}
                </label>
              ))}
            </div>
          </label>
          <label>
            Mood tags (comma separated)
            <input
              value={form.mood_tags}
              onChange={(e) => setForm({ ...form, mood_tags: e.target.value })}
            />
          </label>
          <button className="button" disabled={loading}>
            {loading ? "Saving..." : "Save entry"}
          </button>
        </form>
      </section>

      <section>
        <div className="section-header">
          <h2>Diary entries</h2>
          <div className="filters">
            <select
              value={filters.entry_type}
              onChange={(e) => setFilters({ ...filters, entry_type: e.target.value })}
            >
              <option value="">All types</option>
              <option value="personal">Personal</option>
              <option value="single_guide">Single guide</option>
              <option value="multi_guide">Multi guide</option>
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
          {entries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
          {entries.length === 0 && <p className="muted">No entries match the filters.</p>}
        </div>
      </section>
    </div>
  );
};

export default DiaryPage;
