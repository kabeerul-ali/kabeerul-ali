
import "../../style/Home.css"
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";

import { useProfile } from "../../context/ProfileContext";

function Home() {
  const { profile } = useProfile();

  const name = profile?.name || "Kabeerul Ali";

  const designation =
    profile?.designation || "Full Stack MERN Developer";

  const description =
    profile?.bio ||
    "I'm a Full Stack MERN Developer passionate about creating modern web applications, solving real-world problems and turning ideas into powerful digital experiences.";

  const socialLinks = [
    {
      name: "GitHub",
      url: profile?.socialLinks?.github || "https://github.com/kabeerul-ali",
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      url: profile?.socialLinks?.linkedin,
      icon: FaLinkedin,
    },
  ].filter((item) => item.url);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-status">
              <span className="status-dot" />
              Available for opportunities
            </div>

            <div className="hero-intro">
              <Sparkles size={18} />
              <span>Hello, I'm {name}</span>
            </div>

            <h1>
              Building Digital
              <br />
              Experiences That
              <br />
              <span className="gradient-text">Matter.</span>
            </h1>

            <p className="hero-description">
              {profile?.tagline
                ? `${profile.tagline} — ${description}`
                : description}
            </p>

            <div className="hero-actions">
              <Link to="/projects" className="primary-btn">
                Explore Projects
                <ArrowRight size={18} />
              </Link>

              <Link to="/contact" className="secondary-btn">
                Let's Connect
              </Link>
            </div>

            <div className="hero-socials">
              <span>Find me on</span>

              {socialLinks.map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />

            <div className="hero-profile-card">
              <div className="profile-card-top">
                <span>PORTFOLIO / 2026</span>
                <Sparkles size={17} />
              </div>

              <div className="profile-avatar">{initials}</div>

              <h2>{name}</h2>
              <p>{designation}</p>

              <div className="profile-divider" />

              <div className="profile-stack">
                <span>React</span>
                <span>Node.js</span>
                <span>MongoDB</span>
                <span>Express</span>
              </div>

              <div className="profile-card-bottom">
                <span>Crafting the future</span>
                <span>✦</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span />
          Scroll to explore
        </div>
      </section>
    </main>
  );
}

export default Home;
