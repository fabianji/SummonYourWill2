import { useEffect, useState } from "react";
import AbilityCard from "../components/AbilityCard";
import { fetchGuides, fetchAbilities, createAbility } from "../services/api";

const initialForm = {
  name: "",
  description: "",
  guide_ids: [],
  image_urls: "",
  main_media_id: "",
  unlocked_at: "",
};

const AbilitiesPage = () => {
  const [guides, setGuides] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    fetchGuides().then(setGuides).catch(console.error);
    fetchAbilities().then(setAbilities).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        image_urls: form.image_urls ? form.image_urls.split(",").map((u) => u.trim()) : [],
        guide_ids: form.guide_ids,
        unlocked_at: form.unlocked_at || new Date().toISOString(),
      };
      await createAbility(payload);
      setForm(initialForm);
      loadData();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleGuide = (id) => {
    setForm((prev) => ({
      ...prev,
      guide_ids: prev.guide_ids.includes(id)
        ? prev.guide_ids.filter((g) => g !== id)
        : [...prev.guide_ids, id],
    }));
  };

  return (
    <div className="page">
      <section>
        <h2>Add Ability</h2>
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
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            Image URLs (comma separated)
            <input
              value={form.image_urls}
              onChange={(e) => setForm({ ...form, image_urls: e.target.value })}
            />
          </label>
          <label>
            Main media ID (optional)
            <input
              value={form.main_media_id}
              onChange={(e) => setForm({ ...form, main_media_id: e.target.value })}
            />
          </label>
          <label>
            Unlocked at
            <input
              type="datetime-local"
              value={form.unlocked_at}
              onChange={(e) => setForm({ ...form, unlocked_at: e.target.value })}
            />
          </label>
          <button className="button" disabled={loading}>
            {loading ? "Saving..." : "Save ability"}
          </button>
        </form>
      </section>

      <section>
        <h2>Abilities</h2>
        <div className="grid">
          {abilities.map((ability) => (
            <AbilityCard key={ability.id} ability={ability} />
          ))}
          {abilities.length === 0 && <p className="muted">No abilities registered.</p>}
        </div>
      </section>
    </div>
  );
};

export default AbilitiesPage;
