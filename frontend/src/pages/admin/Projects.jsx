
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  FolderKanban,
  RefreshCw,
  X,
} from "lucide-react";

import { FaGithub } from "react-icons/fa6";

import { projectAPI } from "../../services/api";
import ProjectForm from "./ProjectForm";
import "../../style/adminProjects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await projectAPI.getAll();

      setProjects(
        Array.isArray(response.projects) ? response.projects : []
      );
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Search and filter projects
  const filteredProjects = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        project.title?.toLowerCase().includes(searchTerm) ||
        project.category?.toLowerCase().includes(searchTerm) ||
        project.technologies?.some((tech) =>
          tech.toLowerCase().includes(searchTerm)
        );

      const matchesFilter =
        filter === "All" ||
        project.status === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  // Open add form
  const handleAdd = () => {
    setEditingProject(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (project) => {
    setEditingProject(project);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Close modal
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  // Delete project
  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await projectAPI.delete(project._id);

      setProjects((prev) =>
        prev.filter((item) => item._id !== project._id)
      );

      setSuccess("Project deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete project.");
    }
  };

  // Create or update project
  const handleSave = async (formData) => {
    try {
      setError("");
      setSuccess("");

      if (editingProject) {
        const response = await projectAPI.update(
          editingProject._id,
          formData
        );

        if (!response.project) {
          throw new Error("Updated project data was not received.");
        }

        setProjects((prev) =>
          prev.map((item) =>
            item._id === editingProject._id
              ? response.project
              : item
          )
        );

        setSuccess(
          response.message || "Project updated successfully."
        );
      } else {
        const response = await projectAPI.create(formData);

        if (!response.project) {
          throw new Error("Created project data was not received.");
        }

        setProjects((prev) => [
          response.project,
          ...prev,
        ]);

        setSuccess(
          response.message || "Project created successfully."
        );
      }

      handleCloseForm();
    } catch (err) {
      setError(err.message || "Unable to save project.");
      throw err;
    }
  };

  return (
    <section className="projects-admin">
      {/* Header */}
      <div className="projects-header">
        <div>
          <span className="projects-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Projects</h1>

          <p>
            Manage and organize your portfolio projects.
          </p>
        </div>

        <button
          className="projects-add-btn"
          onClick={handleAdd}
          type="button"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="projects-alert projects-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="projects-alert projects-success" role="status">
          {success}
        </div>
      )}

      {/* Toolbar */}
      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter projects"
        >
          <option value="All">All Projects</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>

        <button
          className="projects-refresh-btn"
          onClick={fetchProjects}
          disabled={loading}
          type="button"
          title="Refresh"
          aria-label="Refresh projects"
        >
          <RefreshCw
            className={loading ? "projects-spin" : ""}
            size={17}
          />
        </button>
      </div>

      {/* Statistics */}
      <div className="projects-stats">
        <div className="projects-stat-card">
          <FolderKanban size={21} />

          <div>
            <strong>{projects.length}</strong>
            <span>Total Projects</span>
          </div>
        </div>

        <div className="projects-stat-card">
          <ExternalLink size={21} />

          <div>
            <strong>
              {projects.filter(
                (project) => project.status === "published"
              ).length}
            </strong>

            <span>Published</span>
          </div>
        </div>

        <div className="projects-stat-card">
          <Pencil size={21} />

          <div>
            <strong>
              {projects.filter(
                (project) => project.status === "draft"
              ).length}
            </strong>

            <span>Drafts</span>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="projects-loading">
          <RefreshCw
            className="projects-spin"
            size={25}
          />

          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="projects-empty">
          <FolderKanban size={38} />

          <h3>No projects found</h3>

          <p>
            Try another search or add a new project.
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article
              className="project-admin-card"
              key={project._id}
            >
              {/* Project Image */}
              <div className="project-admin-image">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />
                ) : (
                  <FolderKanban size={35} />
                )}

                <span
                  className={`project-status ${project.status}`}
                >
                  {project.status}
                </span>
              </div>

              {/* Project Content */}
              <div className="project-admin-content">
                <div className="project-admin-meta">
                  <span>
                    {project.category || "Web Development"}
                  </span>

                  {project.featured && (
                    <span className="project-featured">
                      Featured
                    </span>
                  )}
                </div>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                {/* Technologies */}
                <div className="project-tech-list">
                  {(project.technologies || [])
                    .slice(0, 4)
                    .map((tech, index) => (
                      <span key={`${tech}-${index}`}>
                        {tech}
                      </span>
                    ))}

                  {project.technologies?.length > 4 && (
                    <span>
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="project-admin-actions">
                  <button
                    onClick={() => handleEdit(project)}
                    type="button"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="project-delete-btn"
                    onClick={() => handleDelete(project)}
                    type="button"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live project"
                      aria-label="Open live project"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      aria-label="Open GitHub repository"
                    >
                      <FaGithub size={16} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="project-modal-overlay">
          <div className="project-modal">
            <div className="project-modal-header">
              <div>
                <span>PROJECT MANAGER</span>

                <h2>
                  {editingProject
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>
              </div>

              <button
                onClick={handleCloseForm}
                type="button"
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            <ProjectForm
              initialData={editingProject}
              onSave={handleSave}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
