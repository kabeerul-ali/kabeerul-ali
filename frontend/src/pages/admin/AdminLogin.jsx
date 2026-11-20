
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "../../style/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await login(email, formData.password);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-glow admin-login-glow-one" />
      <div className="admin-login-glow admin-login-glow-two" />

      <div className="admin-login-wrapper">
        <Link to="/" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to Portfolio
        </Link>

        <div className="admin-login-card">
          <div className="admin-login-brand">
            <div className="admin-brand-icon">
              <ShieldCheck size={27} />
            </div>

            <span>
              Kabeer<span className="admin-brand-dot">.</span>
            </span>
          </div>

          <div className="admin-login-heading">
            <span className="admin-login-eyebrow">
              <LockKeyhole size={14} />
              SECURE ADMIN ACCESS
            </span>

            <h1>
              Welcome <span>Back.</span>
            </h1>

            <p>
              Sign in to manage your portfolio and digital presence.
            </p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-login-field">
              <label htmlFor="admin-email">
                Email Address
              </label>

              <div className="admin-input-wrapper">
                <Mail size={18} />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={submitting}
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={submitting}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-submit"
              disabled={submitting || authLoading}
            >
              {submitting ? "Signing In..." : "Sign In to Dashboard"}

              <ArrowLeft
                className="admin-login-arrow"
                size={18}
              />
            </button>
          </form>

          <div className="admin-login-footer">
            <LockKeyhole size={14} />
            Protected administrative access
          </div>
        </div>

        <p className="admin-login-copyright">
          © {new Date().getFullYear()} Kabeerul Ali. All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default AdminLogin;
