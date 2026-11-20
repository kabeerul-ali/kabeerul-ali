
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Globe,
  
  FileText,
  Save,
  RefreshCw,
  Camera,
  
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

import { profileAPI } from "../../services/api";
import "../../style/Profile.css";

const initialForm = {
  name: "",
  designation: "",
  tagline: "",
  bio: "",
  profileImage: "",
  email: "",
  phone: "",
  location: "",
  resumeUrl: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  },
};

function Profile() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await profileAPI.getProfile();

      if (response.profile) {
        setFormData({
          ...initialForm,
          ...response.profile,
          socialLinks: {
            ...initialForm.socialLinks,
            ...(response.profile.socialLinks || {}),
          },
        });
      } else {
        setFormData(initialForm);
      }
    } catch (err) {
      setError(err.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Profile name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await profileAPI.updateProfile({
        ...formData,
        name: formData.name.trim(),
      });

      if (response.profile) {
        setFormData({
          ...initialForm,
          ...response.profile,
          socialLinks: {
            ...initialForm.socialLinks,
            ...(response.profile.socialLinks || {}),
          },
        });
      }

      setSuccess(response.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <RefreshCw className="profile-spin" size={24} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div>
          <span className="profile-eyebrow">ADMINISTRATION</span>
          <h1>Profile Management</h1>
          <p>Manage the information displayed on your portfolio.</p>
        </div>

        <button
          type="button"
          className="profile-refresh-btn"
          onClick={fetchProfile}
          disabled={saving}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="profile-alert profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-alert profile-success">
          {success}
        </div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        {/* PERSONAL INFORMATION */}

        <div className="profile-card">
          <div className="profile-card-heading">
            <div className="profile-heading-icon">
              <UserRound size={20} />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Your basic portfolio identity and introduction.</p>
            </div>
          </div>

          <div className="profile-image-section">
            <div className="profile-avatar">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile preview"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Camera size={28} />
              )}
            </div>

            <div className="profile-image-info">
              <h3>Profile Picture</h3>
              <p>Add an image URL to display your profile picture.</p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="profile-field">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Full Stack MERN Developer"
              />
            </div>

            <div className="profile-field profile-full">
              <label>Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div className="profile-field profile-full">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Write a professional tagline"
              />
            </div>

            <div className="profile-field profile-full">
              <label>About / Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell visitors about yourself..."
                rows={5}
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}

        <div className="profile-card">
          <div className="profile-card-heading">
            <div className="profile-heading-icon">
              <Mail size={20} />
            </div>

            <div>
              <h2>Contact Information</h2>
              <p>How visitors can reach you.</p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <Mail size={14} />
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="profile-field">
              <label>
                <Phone size={14} />
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="profile-field profile-full">
              <label>
                <MapPin size={14} />
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your city, country"
              />
            </div>

            <div className="profile-field profile-full">
              <label>
                <FileText size={14} />
                Resume URL
              </label>

              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS */}

        <div className="profile-card">
          <div className="profile-card-heading">
            <div className="profile-heading-icon">
              <Globe size={20} />
            </div>

            <div>
              <h2>Social Links</h2>
              <p>Connect your professional profiles.</p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <FaGithub size={14} />
                GitHub
              </label>

              <input
                type="url"
                name="github"
                value={formData.socialLinks.github}
                onChange={handleSocialChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="profile-field">
              <label>
                <FaLinkedin size={14} />
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="profile-field">
              <label>
                <FaTwitter size={14} />
                Twitter / X
              </label>

              <input
                type="url"
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleSocialChange}
                placeholder="https://x.com/username"
              />
            </div>

            <div className="profile-field">
              <label>
                <Globe size={14} />
                Portfolio
              </label>

              <input
                type="url"
                name="portfolio"
                value={formData.socialLinks.portfolio}
                onChange={handleSocialChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTONS */}

        <div className="profile-submit-row">
          <button
            type="button"
            className="profile-cancel-btn"
            onClick={fetchProfile}
            disabled={saving}
          >
            Reset Changes
          </button>

          <button
            type="submit"
            className="profile-save-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="profile-spin" size={17} />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Profile;
