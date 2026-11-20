
import { useEffect, useMemo, useState } from "react";

import {
  ExternalLink,
  Code2,
  ArrowUpRight,
} from "lucide-react";

import { FaGithub } from "react-icons/fa6";

import { apiRequest } from "../../services/api";
import "../../style/Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/api/projects");

        if (response.success) {
          setProjects(response.projects || []);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Unable to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filters = useMemo(() => {
    const categories = [
      ...new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...categories];
  }, [projects]);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter(
          (project) => project.category === activeFilter
        );

  return (
    <section className="projects-page section">
      <div className="container">
        <div className="projects-heading">
          <span className="section-eyebrow">
            <Code2 size={15} /> MY WORK
          </span>

          <h1>
            Projects that turn
            <br />
            <span className="gradient-text">
              ideas into reality.
            </span>
          </h1>

          <p>
            A collection of projects where I explore technologies,
            solve problems and build useful digital experiences.
          </p>
        </div>

        {!loading && !error && projects.length > 0 && (
          <div className="projects-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="projects-grid">
            {[1, 2, 3].map((item) => (
              <article className="project-card" key={item}>
                <div className="project-visual">
                  <div className="project-visual-icon">
                    <Code2 size={36} />
                  </div>
                  <span>Loading project...</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="projects-empty">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="projects-empty">
            <Code2 size={35} />
            <h2>No projects available yet</h2>
            <p>New projects will appear here soon.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            <div className="projects-grid">
              {filteredProjects.map((project, index) => {
                const technologies = project.technologies || [];
                const github = project.githubUrl;
                const live = project.liveUrl;
                const number = String(index + 1).padStart(2, "0");

                return (
                  <article
                    className="project-card"
                    key={project._id}
                  >
                    <div className="project-card-top">
                      <span className="project-number">
                        {number}
                      </span>

                      <span className="project-category">
                        {project.category}
                      </span>
                    </div>

                    <div className="project-visual">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "inherit",
                          }}
                        />
                      ) : (
                        <>
                          <div className="project-visual-icon">
                            <Code2 size={36} />
                          </div>
                          <span>{project.title}</span>
                        </>
                      )}
                    </div>

                    <div className="project-info">
                      <h2>{project.title}</h2>

                      <p>{project.description}</p>

                      <div className="project-tech">
                        {technologies.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>

                      <div className="project-links">
                        {github && (
                          <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} source code`}
                          >
                            <FaGithub size={17} />
                            GitHub
                            <ArrowUpRight size={15} />
                          </a>
                        )}

                        {live && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${project.title}`}
                          >
                            Live Demo
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="projects-empty">
                <p>No projects found in this category.</p>
              </div>
            )}
          </>
        )}

        <div className="projects-bottom">
          <p>Have an interesting project in mind?</p>

          <a href="/contact">
            Let's work together
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Projects;
