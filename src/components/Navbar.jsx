import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useStore } from "../store/useStore";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Icon = ({ path, className = "icon", size = 20 }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} style={{ width: size, height: size }}
  >
    <path d={path} />
  </svg>
);

// ── Uploaded globe + magnifying glass SVG logo ───────────────
const TrekWiseLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 508 508" xmlns="http://www.w3.org/2000/svg">
    {/* White circle background */}
    <circle style={{fill:"#ffffff"}} cx="254" cy="254" r="254"/>
    {/* Blue globe */}
    <circle style={{fill:"#54C0EB"}} cx="254" cy="254" r="161.4"/>
    {/* White continent paths */}
    <g>
      <path style={{fill:"#FFFFFF"}} d="M415.4,254c0,61-33.9,114.1-83.8,141.6v-0.1c1.1-11.1,3.7-22.1,7.8-32.5c0.6-1.4,1.2-3.1,0.6-4.5 c-0.5-1.1-1.5-1.9-2.5-2.7c-9-7.2-10.3-20-13-31.2c-0.4-1.7-0.9-3.6-2.3-4.8c-0.9-0.8-2.1-1.3-3.3-1.6c-6.4-1.9-13.2-2.4-19.6-4.4 s-12.8-6-15.1-12.3c-3.1-8.4,1.8-17.4,3.6-26.1c0.7-3.7,0.9-7.5,0.4-11.3c-0.3-2.2-0.7-4.6,0.5-6.4c0.7-1.1,1.9-1.8,3.1-2.4 c11.6-6.4,23.6-12.9,36.8-14.4c4.1-0.5,8.6-0.3,11.9,2.2c2.4,1.9,3.9,4.8,6.4,6.5c2.7,1.8,6.1,2,9.4,2c10.2-0.1,20.4-1.4,30.3-3.9 c2-0.5,4.2-1.2,5.3-3c1.8-3.1-1.1-6.9-4-8.9c-6.5-4.5-14.6-6.6-22.5-5.8c-1.7,0.2-3.6,0.5-5.1-0.4c-1.3-0.7-2-2.1-2.8-3.3 c-3.9-6.1-10.8-10.4-18-10.2c-7.2,0.3-14.2,5.8-15.1,13c-0.6,4.3,0.1,10.1-3.9,11.5c-1.3,0.5-2.8,0.2-4.1,0 c-4.7-0.9-9.6-2.1-13.2-5.2c-3.6-3.1-5.5-8.8-3-12.9c6.7-1.4,13.2-3.5,19.5-6.1c-1.9-2.9-3.8-5.7-5.7-8.6c-0.7-1.1-1.4-2.2-1.3-3.5 c0.4-4.4,8.3-2.7,10.6-6.5c1-1.6,0.6-3.7,1.8-5.1c0.9-1,2.3-1.3,3.7-1.5c6.9-1.1,13.8-2.1,20.7-3.2c4.9-0.7,10.6-2,12.8-6.5 c0.7-1.4,0.9-3.1,1.7-4.5c2.7-5.1,10.3-5.2,13.8-9.8c-4.5,1.7-9.5,1.9-14.2,0.7c1.8-3.8,3.6-7.9,3-12s-4.9-8-8.8-6.5 c-4.1,1.5-4.7,6.9-4.6,11.2c0.1,4,0.1,8,0.2,12.1c0,1.9,0,4-1.2,5.5c-2.5,3.2-7.7,1.4-11.2-0.8c-1,3.4-6.1,3.2-8.9,1 c-5.8-4.6-5.9-14.7-0.3-19.5c1.9-1.6,4.5-3,5-5.5c0.4-1.9-0.7-4.1,0.4-5.7c0.8-1.1,2.2-1.3,3.4-1.7c8-2,13.9-9.4,15.4-17.4 C392.1,158.3,415.4,203.4,415.4,254z"/>
      <path style={{fill:"#FFFFFF"}} d="M278.1,122c-1.9,2.8-4.4,5.2-5.9,8.2c-1.1,2.3-1.6,5-2.9,7.2c-5,8.4-19.9,8.7-21.7,18.3 c-0.4,2.2,0,4.5-1,6.5c-1.2,2.3-4.1,3.4-6.6,3c-7.3-0.9-10.4-9.9-10.2-17.2s2-15.2-1.6-21.6c-3.3-5.9-10.2-8.6-15.9-12.2 c-4.7-3-9.2-8.1-9.2-13.3c16-5.3,33.1-8.2,50.9-8.2c10,0,19.8,0.9,29.4,2.7C283.9,104.7,283.4,114.4,278.1,122z"/>
      <path style={{fill:"#FFFFFF"}} d="M215.3,189.4c-0.9,3.4-3.7,6.7-7.3,6.7c-2.4,0.1-5.2-1.2-6.9,0.5c-1.4,1.3-1.1,3.6-1,5.5 c0.3,4.8-1.8,9.6-5.4,12.7c-2,1.7-4.4,2.9-6.2,4.8c-2.3,2.5-3.4,5.8-4.9,8.9c-7,14.4-22.8,22.1-37.9,27.4 c-4.8,1.7-10.2,3.7-12.1,8.4c-1.5,3.8,0.1,8.5,3.5,10.6c3.5,2.1,8.4,1.3,11-1.7c0.5,4.7,1.1,9.8,4.1,13.5c1.8,2.2,4.4,3.8,6.5,5.8 s3.7,5,2.8,7.8c-3,2.3-7.9,1.7-10.2-1.3c-2-2.6-2.1-6.2-4.2-8.7c-3.8-4.7-11.1-2.7-17.1-3.3c-10-0.8-18.2-11-17-20.9 c0.2-1.6,0.6-3.5-0.4-4.8c-0.7-1.1-2.1-1.5-3.3-2c-3.9-1.6-7.1-4.7-8.8-8.5c-1-2-1.5-4.3-3-5.9c-1.2-1.3-2.7-2-4.4-2.7 C97.7,179,138.8,126,195.3,103.9c0.4,4.2-0.4,8.3-3.9,10.1c-1,0.5-2.2,0.8-3,1.5c-1.5,1.4-1.4,4-0.2,5.7s3,2.8,4.8,3.9 c9.5,6,17.8,15.9,17.4,27.1c-0.2,3.4-1.5,7.2-4.6,8.5c-2.4,1-5.2,0.2-7.6-0.7c-3.7-1.4-7.8-3.6-8.4-7.5c-0.4-2.4,0.7-4.8,0.9-7.3 c0.1-2.5-1.6-5.5-4-5c-1.9,0.4-2.7,2.6-2.7,4.6c0,1.9,0.6,3.9,0.1,5.8c-0.7,2.8-3.5,4.5-6,5.8c-2.6,1.4-5.2,2.9-7.8,4.3 c-3.7,2-7.6,4.2-9.8,7.8s-2.2,9,1.2,11.4c1.8,1.3,4.1,1.6,5.9,2.9c2.7,2.1,3,6,4.4,9.2c1.3,3.2,5.7,5.8,8,3.3 c0.7-0.8,0.9-1.8,1.1-2.7c0.8-4.5,0.2-9,0.4-13.6c0.2-4.5,1.3-9.4,4.8-12.3c3.5-2.9,9.7-2.8,11.8,1.2c0.4,0.8,0.7,1.7,1.2,2.5 c2.7,3.6,8.9-0.1,12.7,2.3c2,1.3,2.6,3.9,3,6.2C215.5,182.3,216.2,186,215.3,189.4z"/>
      <path style={{fill:"#FFFFFF"}} d="M244.4,348c-3.1,3.9-2.9,9.3-4.3,14.1c-3.4,12.4-16.2,19.4-24,29.6c-1.8,2.4-3.4,5-5.9,6.7 c-2.3,1.6-5.2,2.2-7.3,4.1c-1.1,1.1-1.9,2.4-2.5,3.8c-6.5-2.2-12.7-4.9-18.7-8c0-3,0.2-6.1,0.6-9.1c1.1-8.5,3.7-17.4,0.5-25.3 c-2.9-7.4-10.1-11.9-15.3-17.9c-4.1-4.7-7.1-10.5-8.5-16.6c-0.7-2.8-0.9-5.9,0.7-8.3c1.1-1.6,2.9-2.7,4-4.3 c2.7-4.1,0.2-10.1,2.9-14.2c1.4-2.1,3.9-3.2,6.3-3.9c16.9-5.3,36.8,1.1,47.4,15.3c1.1,1.5,2.2,3.1,3.8,4.2 c4.1,2.6,10.7,0.7,13.5,4.7c1.1,1.5,1.3,3.4,2.2,4.9c2.8,4.7,11.5,4.9,12,10.3C252.2,342.4,247.1,344.7,244.4,348z"/>
    </g>
    {/* Light blue overlay */}
    <path style={{fill:"#84DBFF"}} d="M297.8,166.8V256c-3.7,6.4-8.4,12.5-13.9,17.9c-9.1,9.1-19.7,15.8-31,20.1h-63 c-11.3-4.3-21.9-11-31-20.1c-0.3-0.3-0.6-0.6-0.9-0.9c-7.2-7.4-12.9-15.8-16.9-24.6v-73.9c4.2-9.2,10.2-17.9,17.8-25.6 c8.1-8.1,17.4-14.3,27.4-18.6h70.3c2.5,1.1,4.9,2.3,7.3,3.5c7.1,3.9,13.9,8.9,19.9,14.9c0,0,0.1,0.1,0.2,0.2 C289.4,154.4,294,160.5,297.8,166.8z"/>
    {/* Light grey detail */}
    <g>
      <path style={{fill:"#E6E9EE"}} d="M283.8,148.7c-5.5,3.4-12.3,5.5-15.7,9.9c-1,1.3-1.7,2.7-2.1,4.5c-0.5,2.5,0,5.1-1.1,7.3 c-1.3,2.6-4.6,3.8-7.4,3.4c-8.2-1-11.7-11.1-11.4-19.3c0.1-2.9,0.4-6,0.6-8.9c0.3-5.4,0.2-10.7-2.4-15.3c0,0,0,0,0-0.1h12.3 C266.4,134.5,275.7,140.7,283.8,148.7z"/>
      <path style={{fill:"#E6E9EE"}} d="M229.9,200.9c-1,3.8-4.2,7.5-8.2,7.5c-2.7,0-5.8-1.3-7.7,0.5c-1.6,1.5-1.2,4-1.1,6.2 c0.3,5.4-2,10.7-6,14.2c-2.2,1.9-4.9,3.3-6.9,5.4c-2.7,2.8-3.8,6.5-5.5,9.9c-4.1,8.6-11,15-19.2,20.1c-5.4,3.4-11.3,6.1-17.3,8.4 c-7.2-7.4-12.9-15.8-16.9-24.6v-73.9c4.2-9.2,10.2-17.9,17.8-25.6c8.1-8.1,17.4-14.3,27.4-18.6h21.2c4.2,3,8.1,6.6,11.1,10.8 c3.8,5.3,6.2,11.4,5.9,18c-0.2,3.8-1.7,8.1-5.2,9.5c-2.7,1.1-5.8,0.3-8.5-0.7c-4.1-1.5-8.7-4-9.4-8.4c-0.4-2.7,0.8-5.4,1-8.2 c0.2-2.7-1.7-6.1-4.5-5.6c-2.1,0.4-3.1,3-3,5.2c0,2.1,0.6,4.3,0.1,6.4c-0.8,3.1-3.9,5-6.7,6.5c-2.9,1.6-5.9,3.2-8.8,4.8 c-4.1,2.3-8.5,4.8-11,8.7c-2.5,4-2.5,10.1,1.4,12.8c2,1.4,4.6,1.7,6.6,3.3c3.1,2.4,3.4,6.7,4.9,10.3c1.5,3.5,6.4,6.5,8.9,3.7 c0.8-0.9,1.1-2,1.3-3.1c0.9-5,0.2-10.1,0.4-15.2c0.2-5.1,1.5-10.5,5.3-13.8c3.9-3.3,10.8-3.1,13.2,1.4c0.5,0.9,0.8,1.9,1.4,2.8 c3,4,10-0.1,14.2,2.6c2.2,1.4,2.9,4.3,3.4,6.9C230.1,193,230.8,197,229.9,200.9z"/>
    </g>
    {/* Magnifying glass handle */}
    <rect x="284.717" y="265.83" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 703.553 277.4382)" style={{fill:"#2B3B4E"}} width="19.2" height="37.2"/>
    {/* Magnifying glass circle ring */}
    <path style={{fill:"#324A5E"}} d="M283.9,148.9c-34.5-34.5-90.5-34.5-125,0s-34.5,90.5,0,125s90.5,34.5,125,0S318.4,183.4,283.9,148.9z M271.2,261.2c-27.5,27.5-72.1,27.5-99.6,0s-27.5-72.1,0-99.6s72.1-27.5,99.6,0S298.7,233.7,271.2,261.2z"/>
    {/* Magnifying glass handle red */}
    <path style={{fill:"#FF7058"}} d="M308.2,277.1l-21.1,21.1c-0.8,0.8-0.8,2.2,0,3l75.3,75.3c0.8,0.8,2.2,0.8,3,0l21.1-21.1 c0.8-0.8,0.8-2.2,0-3l-75.3-75.3C310.4,276.3,309.1,276.3,308.2,277.1z"/>
  </svg>
);

// ── Developer Contact Icon ────────────────────────────────────
const DevContactIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <polyline points="9 9 7 11 9 13" />
    <polyline points="15 9 17 11 15 13" />
    <line x1="12" y1="9" x2="12" y2="13" />
  </svg>
);

export default function Navbar() {
  const user     = useStore((s) => s.user);
  const username = useStore((s) => s.username);
  const favorites = useStore((s) => s.favorites);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const logout = async () => {
    await signOut(auth);
    useStore.setState({ user: null, username: "", favorites: [] });
    setIsOpen(false);
  };

  const initials = username
    ? username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || "U";

  const displayName = username || user?.email?.split("@")[0] || "Explorer";

  const isActive = (path) => location.pathname === path;

  const icons = {
    about:     "M12 16v-4M12 8h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z",
    profile:   "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    favorites: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    logout:    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    chevron:   "m6 9 6 6 6-6",
  };

  return (
    <nav className="modern-nav">
      <div className="nav-container">

        {/* ── Brand with uploaded SVG logo ── */}
        <Link to="/" className="brand">
          <div className="logo-wrapper">
            <TrekWiseLogo size={56} />
          </div>
          <span className="brand-text">TrekWise</span>
        </Link>

        {/* ── Center nav links ── */}
        <div className="nav-group">
          <Link to="/dashboard" className={`nav-btn${isActive("/dashboard") ? " nav-btn--active" : ""}`}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link to="/about" className={`nav-btn${isActive("/about") ? " nav-btn--active" : ""}`}>
            <Icon path={icons.about} size={19} />
            <span>About</span>
          </Link>

          <Link to="/contact" className={`nav-btn${isActive("/contact") ? " nav-btn--active" : ""}`}>
            <DevContactIcon size={19} />
            <span>Developers</span>
          </Link>
        </div>

        {/* ── User section ── */}
        <div className="user-group">
          {user ? (
            <div className="dropdown-wrapper"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <button className="profile-pill">
                <div className="user-avatar">{initials}</div>
                <span className="user-name-pill">{displayName}</span>
                {/* Favorites badge */}
                {favorites.length > 0 && (
                  <span className="fav-badge">{favorites.length}</span>
                )}
                <Icon path={icons.chevron} className={`chevron ${isOpen ? "rotate" : ""}`} size={15} />
              </button>

              {isOpen && (
                <div className="dropdown-menu">
                  {/* Header */}
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{initials}</div>
                    <div className="dropdown-info">
                      {displayName !== user.email && (
                        <p className="dropdown-name">{displayName}</p>
                      )}
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="divider" />

                  <Link to="/profile" className="drop-link" onClick={() => setIsOpen(false)}>
                    <Icon path={icons.profile} size={16} /> My Account
                  </Link>
                  <Link to="/favorites" className="drop-link" onClick={() => setIsOpen(false)}>
                    {/* Heart icon — filled if favorites exist */}
                    <svg width="16" height="16" viewBox="0 0 24 24"
                      fill={favorites.length > 0 ? "#e11d48" : "none"}
                      stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Favorites
                    {favorites.length > 0 && (
                      <span className="drop-badge">{favorites.length}</span>
                    )}
                  </Link>

                  <div className="divider" />

                  <button onClick={logout} className="drop-link logout">
                    <Icon path={icons.logout} size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-cta">Get Started</Link>
            </div>
          )}
          {/* ── Hamburger — mobile only ── */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span className="ham-line" style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}/>
            <span className="ham-line" style={{ opacity: menuOpen ? 0 : 1 }}/>
            <span className="ham-line" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}/>
          </button>
        </div>

      </div>

      {/* ── Mobile hamburger menu overlay ── */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Menu</span>
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <Link to="/dashboard" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dashboard
          </Link>
          <Link to="/about" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16v-4M12 8h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z"/>
            </svg>
            About
          </Link>
          <Link to="/contact" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <polyline points="9 9 7 11 9 13"/><polyline points="15 9 17 11 15 13"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
            </svg>
            Developers
          </Link>
          {user && (
            <>
              <div className="mobile-menu-divider"/>
              <Link to="/profile" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Account
              </Link>
              <Link to="/favorites" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.length > 0 ? "#e11d48" : "none"} stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Favorites {favorites.length > 0 && <span className="mobile-fav-count">{favorites.length}</span>}
              </Link>
              <div className="mobile-menu-divider"/>
              <button className="mobile-menu-link mobile-logout" onClick={async () => { await signOut(auth); useStore.setState({ user: null, username: "", favorites: [] }); setMenuOpen(false); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}