
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import {
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import { useProfile } from "../../context/ProfileContext";
import "../../style/Navbar.css"
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useProfile();

  const closeMenu = () => setMenuOpen(false);

  const brandName = profile?.name
    ? profile.name.split(" ")[0]
    : "Kabeer";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    //<NavLink to="/skills">Skills</NavLink>
    {name:"Skills",path:"/skills"},
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <span className="brand-symbol">
            {brandName.charAt(0).toUpperCase()}
          </span>

          <span>
            {brandName}
            <span className="brand-highlight">.</span>
          </span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "nav-active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/contact"
            className="navbar-mobile-cta"
            onClick={closeMenu}
          >
            Let's Talk <ArrowUpRight size={17} />
          </Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/contact" className="navbar-cta">
            Let's Talk <ArrowUpRight size={17} />
          </Link>

          <button
            type="button"
            className="navbar-menu-btn"
            aria-label={
              menuOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
