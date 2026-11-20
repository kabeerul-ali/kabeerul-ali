
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

import { useProfile } from "../../context/ProfileContext";
import "../../style/Footer.css"
function Footer() {
  const { profile } = useProfile();

  const currentYear = new Date().getFullYear();

  const name = profile?.name || "Kabeerul Ali";
  const brandName = name.split(" ")[0];

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
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand-section">
            <Link to="/" className="footer-brand">
              {brandName}<span>.</span>
            </Link>

            <p>
              {profile?.tagline ||
                "Building digital experiences with creativity, technology and a passion for solving real-world problems."}
            </p>
          </div>

          <div className="footer-navigation">
            <h3>Quick Links</h3>

            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-social">
            <h3>Connect With Me</h3>

            {socialLinks.map(({ name, url, icon: Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
              >
                <Icon size={17} />
                <span>{name}</span>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} {name}. All rights reserved.
          </p>

          <p>Designed & Built with passion.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
