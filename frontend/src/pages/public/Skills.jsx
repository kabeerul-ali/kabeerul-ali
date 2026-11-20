
import { useEffect, useMemo, useState } from "react";
import {
  Code2,
  Database,
  Server,
  ShieldCheck,
  CreditCard,
  Cloud,
  Wrench,
  Layers,
  BriefcaseBusiness,
  Search,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { apiRequest } from "../../services/api";
import "../../style/PSkills.css";

const categoryIcons = {
  "frontend development": Code2,
  "backend development": Server,
  database: Database,
  "authentication & authorization": ShieldCheck,
  "payment gateway integration": CreditCard,
  "cloud & ai services": Cloud,
  "tools & platforms": Wrench,
  "full-stack development": Layers,
  "professional skills": BriefcaseBusiness,
};

const getCategoryIcon = (category = "") => {
  return (
    categoryIcons[category.toLowerCase()] || Sparkles
  );
};

const getPercentage = (level) => {
  const value = Number(level);

  if (!Number.isFinite(value)) return 0;

  return Math.min(100, Math.max(0, value <= 5 ? (value / 5) * 100 : value));
};

const normalizeSkills = (data) => {
  const records = Array.isArray(data)
    ? data
    : Array.isArray(data?.skills)
      ? data.skills
      : [];

  if (!records.length) return [];

  // Nested category format:
  // [{ name: "Frontend Development", skills: [{ name, level }] }]
  if (records.some((item) => Array.isArray(item.skills))) {
    return records
      .filter((category) => Array.isArray(category.skills))
      .map((category) => ({
        name: category.name || category.category || "Other Skills",
        skills: category.skills.filter((skill) => skill.name),
      }))
      .filter((category) => category.skills.length);
  }

  // Flat format:
  // [{ name, category, level }]
  const grouped = {};

  records.forEach((skill) => {
    if (!skill.name) return;

    const category = skill.category || "Other Skills";

    if (!grouped[category]) grouped[category] = [];

    grouped[category].push(skill);
  });

  return Object.entries(grouped).map(([name, skills]) => ({
    name,
    skills,
  }));
};

function Skills() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/api/skills");
      const normalized = normalizeSkills(response);

      setCategories(normalized);
    } catch (err) {
      console.error("Skills loading error:", err);
      setError(err.message || "Unable to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories
      .filter(
        (category) =>
          activeCategory === "All" ||
          category.name === activeCategory
      )
      .map((category) => ({
        ...category,
        skills: category.skills.filter((skill) =>
          skill.name.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.skills.length);
  }, [categories, activeCategory, search]);

  const totalSkills = categories.reduce(
    (total, category) => total + category.skills.length,
    0
  );

  return (
    <section className="skills-page" id="skills">
      <div className="skills-container">

        <div className="skills-heading">
          <span className="skills-eyebrow">
            <Sparkles size={15} />
            MY EXPERTISE
          </span>

          <h1>
            Skills & <span>Technologies</span>
          </h1>

          <p>
            Technologies, tools and skills I use to build
            modern, scalable and meaningful digital experiences.
          </p>
        </div>

        {!loading && !error && categories.length > 0 && (
          <div className="skills-stats">
            <div className="skills-stat-card">
              <span className="skills-stat-number">
                {totalSkills.toString().padStart(2, "0")}
              </span>
              <span className="skills-stat-label">Total Skills</span>
            </div>

            <div className="skills-stat-card">
              <span className="skills-stat-number">
                {categories.length.toString().padStart(2, "0")}
              </span>
              <span className="skills-stat-label">Categories</span>
            </div>

            <div className="skills-stat-card">
              <span className="skills-stat-number">MERN</span>
              <span className="skills-stat-label">Tech Stack</span>
            </div>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="skills-controls">
            <div className="skills-filters">
              <button
                className={`skills-filter ${
                  activeCategory === "All" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("All")}
              >
                All Skills
              </button>

              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`skills-filter ${
                    activeCategory === category.name ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="skills-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search a skill..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="skills-state">
            <RefreshCw className="skills-loader" size={30} />
            <p>Loading my skills...</p>
          </div>
        )}

        {!loading && error && (
          <div className="skills-state skills-error">
            <AlertCircle size={32} />
            <h3>Unable to load skills</h3>
            <p>{error}</p>
            <button onClick={fetchSkills}>
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="skills-state">
            <Sparkles size={32} />
            <h3>No skills available</h3>
            <p>Skills will appear here once added from the admin panel.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="skills-category-list">
            {filteredCategories.map((category) => {
              const CategoryIcon = getCategoryIcon(category.name);

              return (
                <div
                  className="skills-category"
                  key={category.name}
                >
                  <div className="skills-category-heading">
                    <div className="skills-category-icon">
                      <CategoryIcon size={23} />
                    </div>

                    <div>
                      <h2>{category.name}</h2>
                      <span>
                        {category.skills.length}{" "}
                        {category.skills.length === 1 ? "Skill" : "Skills"}
                      </span>
                    </div>
                  </div>

                  <div className="skills-grid">
                    {category.skills.map((skill, index) => {
                      const percentage = getPercentage(skill.level);

                      return (
                        <div
                          className="skills-card"
                          key={skill._id || `${skill.name}-${index}`}
                        >
                          <div className="skills-card-top">
                            <h3>{skill.name}</h3>
                            <span className="skills-level">
                              {percentage > 0
                                ? `${Math.round(percentage)}%`
                                : "—"}
                            </span>
                          </div>

                          <div
                            className="skills-progress-track"
                            role="progressbar"
                            aria-label={`${skill.name} proficiency`}
                            aria-valuenow={Math.round(percentage)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            <div
                              className="skills-progress-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="skills-card-caption">
                            {percentage >= 85
                              ? "Advanced"
                              : percentage >= 65
                                ? "Proficient"
                                : percentage > 0
                                  ? "Intermediate"
                                  : "Learning"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="skills-state">
                <Search size={30} />
                <h3>No matching skills</h3>
                <p>Try another search term or select a different category.</p>
              </div>
            )}
          </div>
        )}

        <div className="skills-footer">
          <Sparkles size={17} />
          <p>
            Always learning, building and exploring new technologies.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Skills;
