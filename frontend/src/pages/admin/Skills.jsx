
import { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, Pencil, Trash2, Code2,
  RefreshCw, X, Star,
} from "lucide-react";
import { skillAPI } from "../../services/api";
import SkillForm from "./SkillForm";
import "../../style/Skills.css";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Frontend",
    "Backend",
    "Database",
    "Programming",
    "Tools",
    "Other",
  ];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await skillAPI.getAll();
      setSkills(response.skills || []);
    } catch (err) {
      setError(err.message || "Unable to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name?.toLowerCase().includes(search.toLowerCase()) ||
        skill.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || skill.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [skills, search, category]);

  const handleAdd = () => {
    setEditingSkill(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (skill) => {
    if (!window.confirm(`Delete "${skill.name}"?`)) return;

    try {
      await skillAPI.delete(skill._id);
      setSkills((prev) => prev.filter((item) => item._id !== skill._id));
      setSuccess("Skill deleted successfully.");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to delete skill.");
    }
  };

  const handleSave = async (formData) => {
    if (editingSkill) {
      const response = await skillAPI.update(editingSkill._id, formData);
      setSkills((prev) =>
        prev.map((item) =>
          item._id === editingSkill._id ? response.skill : item
        )
      );
      setSuccess(response.message || "Skill updated successfully.");
    } else {
      const response = await skillAPI.create(formData);
      setSkills((prev) => [...prev, response.skill]);
      setSuccess(response.message || "Skill created successfully.");
    }

    setShowForm(false);
    setEditingSkill(null);
    setError("");
  };

  const featuredCount = skills.filter((skill) => skill.featured).length;

  return (
    <section className="skills-admin">
      <div className="skills-header">
        <div>
          <span className="skills-eyebrow">PORTFOLIO MANAGEMENT</span>
          <h1>Skills</h1>
          <p>Manage your technical skills and expertise.</p>
        </div>

        <button className="skills-add-btn" onClick={handleAdd}>
          <Plus size={18} /> Add Skill
        </button>
      </div>

      {error && <div className="skills-alert skills-error">{error}</div>}
      {success && <div className="skills-alert skills-success">{success}</div>}

      <div className="skills-stats">
        <div className="skills-stat-card">
          <Code2 size={21} />
          <div>
            <strong>{skills.length}</strong>
            <span>Total Skills</span>
          </div>
        </div>

        <div className="skills-stat-card">
          <Star size={21} />
          <div>
            <strong>{featuredCount}</strong>
            <span>Featured Skills</span>
          </div>
        </div>

        <div className="skills-stat-card">
          <Code2 size={21} />
          <div>
            <strong>{new Set(skills.map((skill) => skill.category)).size}</strong>
            <span>Categories</span>
          </div>
        </div>
      </div>

      <div className="skills-toolbar">
        <div className="skills-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <button
          type="button"
          className="skills-refresh-btn"
          onClick={fetchSkills}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {loading ? (
        <div className="skills-loading">
          <RefreshCw className="skills-spin" size={25} />
          <p>Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="skills-empty">
          <Code2 size={38} />
          <h3>No skills found</h3>
          <p>Try another search or add a new skill.</p>
        </div>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <article className="skill-admin-card" key={skill._id}>
              <div className="skill-card-top">
                <div className="skill-card-icon">
                  <Code2 size={22} />
                </div>

                <div className="skill-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(skill)}
                    title="Edit skill"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="skill-delete-btn"
                    onClick={() => handleDelete(skill)}
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="skill-card-heading">
                <h3>{skill.name}</h3>
                {skill.featured && (
                  <span className="skill-featured-label">
                    <Star size={12} /> Featured
                  </span>
                )}
              </div>

              <span className="skill-category-label">{skill.category}</span>

              <div className="skill-level-heading">
                <span>Proficiency</span>
                <strong>{skill.level}%</strong>
              </div>

              <div
                className="skill-level-track"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
              >
                <div style={{ width: `${skill.level}%` }} />
              </div>

              <span className="skill-order-label">
                Display order: {skill.order}
              </span>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div className="skill-modal-overlay">
          <div className="skill-modal">
            <div className="skill-modal-header">
              <div>
                <span>SKILL MANAGER</span>
                <h2>{editingSkill ? "Edit Skill" : "Add New Skill"}</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            <SkillForm
              initialData={editingSkill}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Skills;
