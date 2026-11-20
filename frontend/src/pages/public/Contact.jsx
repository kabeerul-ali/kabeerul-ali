import { useState } from "react";

import { Mail, Send, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

import { useProfile } from "../../context/ProfileContext";
import { apiRequest } from "../../services/api";
import "../../style/Contact.css";

function Contact() {
  const { profile } = useProfile();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setStatus(null);

      const response = await apiRequest("/api/contact/send", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.success) {
        throw new Error(response.message || "Message could not be sent.");
      }

      setStatus({
        type: "success",
        message: response.message || "Message sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: profile?.socialLinks?.github,
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      url: profile?.socialLinks?.linkedin,
      icon: FaLinkedin,
    },
    {
      name: "X",
      url: profile?.socialLinks?.twitter,
      icon: FaXTwitter,
    },
  ].filter((item) => item.url);

  return (
    <section className="contact-page section">
      <div className="container">
        <div className="contact-heading">
          <span className="section-eyebrow">
            <Mail size={15} /> GET IN TOUCH
          </span>

          <h1>
            Let's build something
            <br />
            <span className="gradient-text">meaningful together.</span>
          </h1>

          <p>
            Have a project idea, collaboration opportunity or just want to
            connect? Send me a message.
          </p>
        </div>

        <div className="contact-layout">
          <div className="contact-details">
            <div
              className="contact-detail-card"
              onClick={() =>
                (window.location.href = "mailto:kabeerulali@gmail.com")
              }
              style={{ cursor: "pointer" }}
            >
              <div className="contact-detail-icon">
                <Mail size={21} />
              </div>

              <div>
                <span>Email</span>
                <p>
                  {profile?.email || "Let's connect through the contact form."}
                </p>
              </div>
            </div>

            <div className="contact-detail-card">
              <div className="contact-detail-icon">
                <MapPin size={21} />
              </div>

              <div>
                <span>Location</span>
                <p>{profile?.location || "India"}</p>
              </div>
            </div>

            {profile?.phone && (
              <div
                className="contact-detail-card"
                onClick={() => (window.location.href = "tel:+919528536346")}
                style={{ cursor: "pointer" }}
              >
                <div className="contact-detail-icon">
                  <Mail size={21} />
                </div>

                <div>
                  <span>Phone</span>
                  <p>{profile.phone}</p>
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="contact-socials">
                <h3>Find me online</h3>

                <div>
                  {socialLinks.map(({ name, url, icon: Icon }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      title={name}
                    >
                      <Icon size={19} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send a message</h2>

            <p>Fill in the details below and let's start a conversation.</p>

            <div className="contact-input-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Your Name</label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email Address</label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-phone">Phone Number</label>

              <input
                id="contact-phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                minLength={7}
                maxLength={15}
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Your Message</label>

              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Tell me about your idea..."
                value={formData.message}
                onChange={handleChange}
                maxLength={5000}
                required
              />
            </div>

            <button type="submit" className="contact-submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
              <Send size={17} />
            </button>

            {status && (
              <div
                className={`contact-status ${status.type}`}
                role="status"
                aria-live="polite"
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}

                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
