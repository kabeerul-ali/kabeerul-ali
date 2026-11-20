
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "Programming",
  "Tools",
  "Other",
];

const initialForm = {
  name: "",
  category: "Frontend",
  icon: "",
  level: 80,
  featured: false,
  order: 0,
};

function SkillForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      initialData
        ? { ...initialForm, ...initialData }
        : initialForm
    );
    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.category) {
      setError("Skill name and category are required.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        name: form.name.trim(),
        category: form.category,
        icon: form.icon.trim(),
        level: Number(form.level),
        featured: form.featured,
        order: Number(form.order) || 0,
      });
    } catch (err) {
      setError(err.message || "Unable to save skill.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      {error && <div className="skills-alert skills-error">{error}</div>}

      <div className="skill-form-field">
        <label>Skill Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. React.js"
          required
        />
      </div>

      <div className="skill-form-grid">
        <div className="skill-form-field">
          <label>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="skill-form-field">
          <label>Display Order</label>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
          />
        </div>

        <div className="skill-form-field skill-form-full">
          <label>Icon Name / URL</label>
          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="e.g. react or https://example.com/icon.svg"
          />
          <small>Optional. Enter an icon identifier or image URL.</small>
        </div>

        <div className="skill-form-field skill-form-full">
          <div className="skill-level-label">
            <label>Proficiency Level</label>
            <strong>{form.level}%</strong>
          </div>

          <input
            className="skill-level-input"
            type="range"
            name="level"
            min="0"
            max="100"
            value={form.level}
            onChange={handleChange}
          />
        </div>
      </div>

      <label className="skill-featured-toggle">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
        />
        <span>Mark as Featured Skill</span>
      </label>

      <div className="skill-form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          <X size={16} /> Cancel
        </button>

        <button type="submit" disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Skill"}
        </button>
      </div>
    </form>
  );
}

export default SkillForm;
