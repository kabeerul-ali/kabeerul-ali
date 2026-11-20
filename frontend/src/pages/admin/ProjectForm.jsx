
import { useEffect, useState } from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  images: [],
  technologies: [],
  liveUrl: "",
  githubUrl: "",
  category: "Web Development",
  featured: false,
  status: "published",
  order: 0,
};

function ProjectForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [technologyInput, setTechnologyInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        images: initialData.images || [],
        technologies: initialData.technologies || [],
      });
      setImagesInput((initialData.images || []).join("\n"));
    } else {
      setForm(emptyForm);
      setImagesInput("");
    }
    setTechnologyInput("");
    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addTechnology = () => {
    const value = technologyInput.trim();
    if (!value) return;

    if (!form.technologies.includes(value)) {
      setForm((prev) => ({
        ...prev,
        technologies: [...prev.technologies, value],
      }));
    }
    setTechnologyInput("");
  };

  const removeTechnology = (technology) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((item) => item !== technology),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      images: imagesInput
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      order: Number(form.order) || 0,
    };

    try {
      setSaving(true);
      await onSave(payload);
    } catch (err) {
      setError(err.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      {error && <div className="projects-alert projects-error">{error}</div>}

      <div className="project-form-grid">
        <div className="project-form-field full">
          <label>Project Title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Enter project title" required />
        </div>

        <div className="project-form-field full">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your project..." required />
        </div>

        <div className="project-form-field full">
          <label>Main Image URL</label>
          <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          {form.image && <img className="project-form-preview" src={form.image} alt="Preview" />}
        </div>

        <div className="project-form-field full">
          <label>Additional Image URLs</label>
          <textarea
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            rows={3}
            placeholder={"Paste one image URL per line\nhttps://example.com/image-1.jpg"}
          />
          <small>Enter one URL per line.</small>
        </div>

        <div className="project-form-field full">
          <label>Technologies</label>
          <div className="project-tech-input">
            <input
              value={technologyInput}
              onChange={(e) => setTechnologyInput(e.target.value)}
              placeholder="e.g. React"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechnology();
                }
              }}
            />
            <button type="button" onClick={addTechnology}><Plus size={17} /></button>
          </div>
          <div className="project-form-tags">
            {form.technologies.map((tech) => (
              <span key={tech}>
                {tech}
                <button type="button" onClick={() => removeTechnology(tech)} aria-label={`Remove ${tech}`}>
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="project-form-field">
          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="Web Development" />
        </div>

        <div className="project-form-field">
          <label>Display Order</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} />
        </div>

        <div className="project-form-field full">
          <label>Live URL</label>
          <input type="url" name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://your-project.com" />
        </div>

        <div className="project-form-field full">
          <label>GitHub URL</label>
          <input type="url" name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/username/project" />
        </div>

        <div className="project-form-field">
          <label>Publication Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <label className="project-featured-toggle">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          <span>Mark as Featured</span>
        </label>
      </div>

      <div className="project-form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" disabled={saving}>
          <Save size={16} /> {saving ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
