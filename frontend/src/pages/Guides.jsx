// Página para crear y listar guías espirituales.
import { useEffect, useState } from "react";
import GuideCard from "../components/GuideCard";
import { fetchGuides, createGuide } from "../services/api";

const initialForm = {
  name: "",
  description: "",
  main_image_url: "",
  theme_color: "",
  domains: "",
};

const GuidesPage = () => {
  // Estado de lista de guías y formulario controlado.
  const [guides, setGuides] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const loadGuides = () => fetchGuides().then(setGuides).catch(console.error);

  useEffect(() => {
    // Carga inicial de guías al montar el componente.
    loadGuides();
  }, []);

  const handleSubmit = async (e) => {
    // Envía el formulario para crear una nueva guía.
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        domains: form.domains ? form.domains.split(",").map((d) => d.trim()) : [],
      };
      await createGuide(payload);
      setForm(initialForm);
      loadGuides();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section>
        <h2>Add Guide</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            Main image URL
            <input
              value={form.main_image_url}
              onChange={(e) => setForm({ ...form, main_image_url: e.target.value })}
            />
          </label>
          <label>
            Theme color
            <input
              value={form.theme_color}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
            />
          </label>
          <label>
            Domains (comma separated)
            <input
              value={form.domains}
              onChange={(e) => setForm({ ...form, domains: e.target.value })}
            />
          </label>
          <button className="button" disabled={loading}>
            {loading ? "Saving..." : "Create guide"}
          </button>
        </form>
      </section>

      <section>
        <h2>Your guides</h2>
        <div className="grid">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
          {guides.length === 0 && <p className="muted">Add your first guide to get started.</p>}
        </div>
      </section>
    </div>
  );
};

export default GuidesPage;
