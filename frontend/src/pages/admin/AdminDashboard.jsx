
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  UserRound,
  Code2,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ArrowUpRight,
  Plus,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import Profile from "./Profile";
import Projects from "./Projects";
import Skills from "./Skills";
import Messages from "./Messages";

import {
  projectAPI,
  skillAPI,
  messageAPI,
} from "../../services/api";

import "../../style/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, admin } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    loading: true,
  });

  const currentPath = location.pathname;

  const isDashboardPage =
    currentPath === "/admin" ||
    currentPath === "/admin/" ||
    currentPath === "/admin/dashboard";

  const isProfilePage = currentPath === "/admin/profile";
  const isProjectsPage = currentPath === "/admin/projects";
  const isSkillsPage = currentPath === "/admin/skills";
  const isMessagesPage = currentPath === "/admin/messages";
  const isSettingsPage = currentPath === "/admin/settings";

  // Dashboard statistics
  useEffect(() => {
    let active = true;

    const fetchDashboardStats = async () => {
      try {
        const results = await Promise.allSettled([
          projectAPI.getAll(),
          skillAPI.getAll(),
          messageAPI.getAll(),
        ]);

        if (!active) return;

        const [projectsResult, skillsResult, messagesResult] = results;

        setStats({
          projects:
            projectsResult.status === "fulfilled"
              ? projectsResult.value.projects?.length || 0
              : 0,

          skills:
            skillsResult.status === "fulfilled"
              ? skillsResult.value.skills?.length || 0
              : 0,

          messages:
            messagesResult.status === "fulfilled"
              ? messagesResult.value.conversations?.reduce(
                  (total, conversation) =>
                    total + (conversation.messages?.length || 0),
                  0
                ) || 0
              : 0,

          loading: false,
        });
      } catch {
        if (active) {
          setStats((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      }
    };

    fetchDashboardStats();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const navigation = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Profile",
      icon: UserRound,
      path: "/admin/profile",
    },
    {
      label: "Projects",
      icon: FolderKanban,
      path: "/admin/projects",
    },
    {
      label: "Skills",
      icon: Code2,
      path: "/admin/skills",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      path: "/admin/messages",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const dashboardStats = [
    {
      title: "Total Projects",
      value: stats.loading ? "..." : stats.projects,
      description: "Portfolio projects",
      icon: FolderKanban,
    },
    {
      title: "Total Skills",
      value: stats.loading ? "..." : stats.skills,
      description: "Technical skills",
      icon: Code2,
    },
    {
      title: "Messages",
      value: stats.loading ? "..." : stats.messages,
      description: "Contact submissions",
      icon: MessageSquare,
    },
    {
      title: "Profile Status",
      value: "Active",
      description: "Portfolio availability",
      icon: TrendingUp,
    },
  ];

  const pageTitles = {
    "/admin": "Dashboard",
    "/admin/": "Dashboard",
    "/admin/dashboard": "Dashboard",
    "/admin/profile": "Profile Management",
    "/admin/projects": "Project Management",
    "/admin/skills": "Skills Management",
    "/admin/messages": "Messages Management",
    "/admin/settings": "Settings",
  };

  const pageTitle = pageTitles[currentPath] || "Dashboard";

  const renderPage = () => {
    if (isProfilePage) return <Profile />;
    if (isProjectsPage) return <Projects />;
    if (isSkillsPage) return <Skills />;
    if (isMessagesPage) return <Messages />;

    if (isSettingsPage) {
      return (
        <div className="admin-dashboard-note">
          <div className="admin-note-icon">
            <Settings size={21} />
          </div>
          <div>
            <h3>Settings coming soon</h3>
            <p>
              Workspace settings will be available in a future update.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-dashboard-content">
        {/* Welcome */}
        <section className="admin-welcome-section">
          <div>
            <span className="admin-welcome-label">
              <span className="admin-welcome-dot" />
              ADMIN CONTROL CENTER
            </span>

            <h2>
              Welcome back, <span>Kabeerul.</span>
            </h2>

            <p>
              Manage your portfolio, projects and digital presence
              from one place.
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-preview-button"
          >
            Preview Website
            <ArrowUpRight size={17} />
          </Link>
        </section>

        {/* Statistics */}
        <section className="admin-stats-grid">
          {dashboardStats.map(
            ({ title, value, description, icon: Icon }) => (
              <article className="admin-stat-card" key={title}>
                <div className="admin-stat-top">
                  <span>{title}</span>

                  <div className="admin-stat-icon">
                    <Icon size={19} />
                  </div>
                </div>

                <h3>{value}</h3>
                <p>{description}</p>
              </article>
            )
          )}
        </section>

        {/* Quick Actions */}
        <section className="admin-management-section">
          <div className="admin-section-heading">
            <div>
              <span>MANAGEMENT</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-action-grid">
            <article className="admin-action-card">
              <div className="admin-action-icon purple">
                <UserRound size={22} />
              </div>

              <h3>Manage Profile</h3>

              <p>
                Update your portfolio introduction and personal details.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/profile")}
              >
                Manage Profile <ArrowUpRight size={16} />
              </button>
            </article>

            <article className="admin-action-card">
              <div className="admin-action-icon blue">
                <FolderKanban size={22} />
              </div>

              <h3>Manage Projects</h3>

              <p>
                Add, edit and organize your portfolio projects.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/projects")}
              >
                Manage Projects <ArrowUpRight size={16} />
              </button>
            </article>

            <article className="admin-action-card">
              <div className="admin-action-icon orange">
                <Code2 size={22} />
              </div>

              <h3>Manage Skills</h3>

              <p>
                Control your technical skills and expertise.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/skills")}
              >
                Manage Skills <ArrowUpRight size={16} />
              </button>
            </article>

            <article className="admin-action-card">
              <div className="admin-action-icon green">
                <MessageSquare size={22} />
              </div>

              <h3>View Messages</h3>

              <p>
                Review messages submitted through your contact page.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/messages")}
              >
                View Messages <ArrowUpRight size={16} />
              </button>
            </article>
          </div>
        </section>

        {/* Dashboard Note */}
        <section className="admin-dashboard-note">
          <div className="admin-note-icon">
            <Plus size={21} />
          </div>

          <div>
            <h3>Your workspace is ready</h3>

            <p>
              Manage your portfolio content directly from your
              administration dashboard.
            </p>
          </div>
        </section>

        <footer className="admin-dashboard-footer">
          <span>
            © {new Date().getFullYear()} Kabeerul Ali
          </span>

          <span>Portfolio Administration</span>
        </footer>
      </div>
    );
  };

  return (
    <main className="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          menuOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">K</div>

          <span>
            Kabeer<span>.</span>
          </span>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="admin-sidebar-label">
          WORKSPACE
        </div>

        <nav className="admin-sidebar-nav">
          {navigation.map(({ label, icon: Icon, path }) => {
            const active =
              path === "/admin/dashboard"
                ? isDashboardPage
                : currentPath === path;

            return (
              <button
                type="button"
                key={label}
                className={`admin-nav-item ${
                  active ? "active" : ""
                }`}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(path);
                }}
              >
                <Icon size={18} />

                <span>{label}</span>

                {active && (
                  <span className="admin-nav-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link
            to="/"
            className="admin-view-portfolio"
            onClick={() => setMenuOpen(false)}
          >
            <ExternalLink size={17} />
            View Portfolio
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {menuOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <section className="admin-dashboard-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="admin-topbar-eyebrow">
                WORKSPACE
              </span>

              <h1>{pageTitle}</h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-user-avatar">KA</div>

            <div className="admin-user-info">
              <strong>
                {admin?.email || "Administrator"}
              </strong>

              <span>Administrator</span>
            </div>
          </div>
        </header>

        {renderPage()}
      </section>
    </main>
  );
}

export default AdminDashboard;
