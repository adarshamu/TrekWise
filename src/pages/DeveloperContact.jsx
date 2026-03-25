import { useState, useEffect } from "react";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

var teamMembers = [
  {
    name: "M U Adarsha",
    role: "Project Planning & Integration Developer",
    email: "adarshamu2004@gmail.com",
    github: "adarshamu",
    linkedin: "adarsha-m-u-912428318",
    initials: "MU",
    gradient: "linear-gradient(135deg, #2563eb, #16a34a)",
    accent: "#2563eb",
    glowColor: "#2563eb",
  },
  {
    name: "Monal Jiya Rasquinha",
    role: "Project Planning & API Integration Developer",
    email: "230933@sdmcujire.in",
    github: "monalrasquinha",
    linkedin: "monal-rasquinha-799515218",
    initials: "MJ",
    gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
    accent: "#7c3aed",
    glowColor: "#7c3aed",
  },
  {
    name: "Nanjappa K K",
    role: "Testing & Project Documentaion",
    email: "230934@sdmcujire.in",
    github: "Nanjappa9",
    linkedin: "--",
    initials: "NK",
    gradient: "linear-gradient(135deg, #b45309, #78350f)",
    accent: "#d97706",
    glowColor: "#d97706",
  },
  {
    name: "Neil Ivan Mascarenhas",
    role: "Frontend Developer & Project Documentaion",
    email: "neilivan8789@gmail.com",
    github: "neillivann",
    linkedin: "neil-ivan-mascarenhas-45b97531a",
    initials: "NI",
    gradient: "linear-gradient(135deg, #0f766e, #134e4a)",
    accent: "#0d9488",
    glowColor: "#0d9488",
  },
];

var faqs = [
  {
    q: "Can I contribute to TrekWise?",
    a: "Absolutely! The project is open source. Fork the repo on GitHub, make your changes, and open a pull request. All contributions are welcome.",
  },
  {
    q: "How do I report a bug?",
    a: "Open an issue on GitHub with a description of the bug, steps to reproduce it, and your browser/OS. We will get to it as soon as possible.",
  },
  {
    q: "Can I request a new feature?",
    a: "Yes! Drop us an email or open a GitHub issue tagged feature request. If it fits TrekWise's mission, we will add it to the roadmap.",
  },
];

var techStack = ["React", "Vite", "Firebase", "GraphHopper", "Open-Meteo", "Zustand", "Pexels"];

var devStatsList = [
  { label: "Team Members", value: "4" },
  { label: "APIs Integrated", value: "5+" },
  { label: "Project Started", value: "2026" },
];

export default function DeveloperContact() {
  var visibleState = useState(false);
  var visible = visibleState[0];
  var setVisible = visibleState[1];

  var openFaqState = useState(null);
  var openFaq = openFaqState[0];
  var setOpenFaq = openFaqState[1];

  // Hero background image from Unsplash
  var [heroBg, setHeroBg] = useState("");
  var [imgLoaded, setImgLoaded] = useState(false);

  useEffect(function () {
    var t = setTimeout(function () { setVisible(true); }, 80);
    return function () { clearTimeout(t); };
  }, []);

  // Fetch a stunning mountain/trekking landscape from Unsplash
  useEffect(function () {
    fetch(
      "https://api.unsplash.com/search/photos?query=himalaya+mountain+peak+misty&per_page=10&orientation=landscape&content_filter=high",
      { headers: { Authorization: "Client-ID " + UNSPLASH_KEY } }
    )
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var results = data.results;
        if (results && results.length > 0) {
          var pick = results[Math.floor(Math.random() * Math.min(results.length, 6))];
          setHeroBg(pick.urls.regular);
        }
      })
      .catch(function () {});
  }, []);

  function toggleFaq(i) {
    if (openFaq === i) { setOpenFaq(null); } else { setOpenFaq(i); }
  }

  function handleMemberEnter(e, glowColor) {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = `0 20px 40px ${glowColor}20, 0 0 0 1px ${glowColor}40 inset`;
    e.currentTarget.style.borderColor = glowColor;
  }

  function handleMemberLeave(e) {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* ══════════ HERO with Unsplash background ══════════ */}
      <section
        style={Object.assign({}, styles.hero, {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
          backgroundImage: heroBg
            ? "linear-gradient(to bottom, rgba(10,15,28,0.65) 0%, rgba(10,15,28,0.75) 60%, rgba(10,15,28,0.92) 100%), url(" + heroBg + ")"
            : "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f2744 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        })}
      >
        {heroBg && (
          <img
            src={heroBg}
            alt=""
            style={{ display: "none" }}
            onLoad={() => setImgLoaded(true)}
          />
        )}

        <div style={styles.avatarRing}>
          <div style={styles.avatarCircle}>TW</div>
        </div>
        <div style={styles.heroBadge}>Open to collaborations</div>
        <h1 style={styles.heroTitle}>
          Meet the team
          <br />
          <span style={styles.heroAccentWrapper}>
            <span style={styles.heroAccent}>behind TrekWise</span>
          </span>
        </h1>
        <p style={styles.heroSub}>
          TrekWise is built by a passionate team of developers who love the outdoors.
          Got feedback, ideas, or bugs to report? We would love to hear from you.
        </p>
      </section>

      {/* ══════════ TEAM GRID ══════════ */}
      <section style={Object.assign({}, styles.section, {
        opacity: visible ? 1 : 0,
        transition: "all 0.8s ease 0.15s",
      })}>
        <p style={styles.sectionTag}>The Team</p>
        <h2 style={styles.sectionHeading}>People who built this</h2>
        <div style={styles.teamGrid}>
          {teamMembers.map(function (member, i) {
            return (
              <div
                key={i}
                style={styles.memberCard}
                onMouseEnter={(e) => handleMemberEnter(e, member.glowColor)}
                onMouseLeave={handleMemberLeave}
              >
                <div style={Object.assign({}, styles.memberAccentLine, { background: member.accent })} />
                <div style={styles.memberTop}>
                  <div style={Object.assign({}, styles.memberAvatar, { background: member.gradient })}>
                    {member.initials}
                  </div>
                </div>
                <h3 style={styles.memberName}>{member.name}</h3>
                <p style={styles.memberRole}>{member.role}</p>
                <div style={styles.memberDivider} />
                <div style={styles.memberLinks}>
                  <a href={"mailto:" + member.email} style={styles.memberLink}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span style={styles.memberLinkText}>{member.email}</span>
                  </a>
                  <a href={"https://github.com/" + member.github} target="_blank" rel="noreferrer" style={styles.memberLink}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    <span style={styles.memberLinkText}>{"github.com/" + member.github}</span>
                  </a>
                  {member.linkedin !== "--" && (
                    <a href={"https://linkedin.com/in/" + member.linkedin} target="_blank" rel="noreferrer" style={styles.memberLink}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span style={styles.memberLinkText}>{"linkedin.com/in/" + member.linkedin}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════ ABOUT TREKWISE CARD ══════════ */}
      <section style={Object.assign({}, styles.section, {
        opacity: visible ? 1 : 0,
        transition: "all 0.8s ease 0.35s",
      })}>
        <div style={styles.devCard}>
          <div style={styles.devLeft}>
            <p style={styles.sectionTagLight}>About TrekWise</p>
            <h2 style={styles.devName}>Built with passion</h2>
            <p style={styles.devBio}>
              TrekWise started as a personal tool for planning weekend hikes and grew into a
              full platform powered by modern web technologies and a team that loves the outdoors.
            </p>
            <p style={styles.devBio}>
              When not pushing commits, you will find us somewhere on a trail, probably without cell service.
            </p>
            <div style={styles.techRow}>
              {techStack.map(function (t) {
                return (<span key={t} style={styles.techChip}>{t}</span>);
              })}
            </div>
          </div>
          <div style={styles.devRight}>
            <div style={styles.devStats}>
              {devStatsList.map(function (s, i) {
                return (
                  <div key={i} style={styles.devStat}>
                    <span style={styles.devStatNum}>{s.value}</span>
                    <span style={styles.devStatLabel}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section style={Object.assign({}, styles.section, {
        opacity: visible ? 1 : 0,
        transition: "all 0.8s ease 0.5s",
        maxWidth: 700,
      })}>
        <p style={styles.sectionTag}>FAQ</p>
        <h2 style={styles.faqHeading}>Common questions</h2>
        {faqs.map(function (faq, i) {
          return (
            <div key={i} style={Object.assign({}, styles.faqItem, {
              borderColor: openFaq === i ? "#84cc16" : "rgba(255,255,255,0.1)",
            })}>
              <button style={styles.faqQ} onClick={function () { toggleFaq(i); }}>
                <span>{faq.q}</span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openFaq === i && <p style={styles.faqA}>{faq.a}</p>}
            </div>
          );
        })}
      </section>
    </div>
  );
}

var styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(170deg, #0a1628 0%, #0f1e30 40%, #0d1b2a 100%)",
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    paddingBottom: 100,
    color: "rgba(255, 255, 255, 0.85)",
  },
  blob1: {
    position: "fixed",
    top: -120,
    right: -120,
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(132,204,22,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob2: {
    position: "fixed",
    bottom: -100,
    left: -100,
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob3: {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(132,204,22,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
    transform: "translate(-50%, -50%)",
  },

  // ── Hero ──
  hero: {
    textAlign: "center",
    padding: "100px 32px 80px",
    width: "100%",
    margin: 0,
    position: "relative",
    zIndex: 1,
    borderRadius: 0,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #84cc16, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    padding: 3,
    boxShadow: "0 0 20px rgba(132,204,22,0.3)",
    animation: "pulseRing 2s ease-in-out infinite",
  },
  avatarCircle: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e3a8a, #14532d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#fff",
  },
  heroBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    color: "#84cc16",
    fontSize: "0.78rem",
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 30,
    letterSpacing: "0.5px",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1.2,
    margin: "0 0 20px",
    letterSpacing: "-1px",
    fontFamily: "Georgia, serif",
    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
  },
  heroAccentWrapper: {
    display: "inline-block",
    position: "relative",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #84cc16, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontStyle: "italic",
    display: "inline-block",
    animation: "glowPulse 2s ease-in-out infinite",
  },
  heroSub: {
    fontSize: "1.05rem",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.8,
    maxWidth: 560,
    margin: "0 auto",
  },

  // ── Sections ──
  section: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 32px 64px",
    position: "relative",
    zIndex: 1,
  },
  sectionTag: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#84cc16",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: 10,
  },
  sectionTagLight: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: "clamp(1.5rem, 3vw, 1.8rem)",
    fontWeight: 800,
    color: "#f0f9ff",
    margin: "0 0 32px",
    letterSpacing: "-0.8px",
    fontFamily: "Georgia, serif",
  },

  // ── Team Grid ──
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 24,
  },
  memberCard: {
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
    cursor: "default",
  },
  memberAccentLine: {
    height: 4,
    width: "100%",
    transition: "opacity 0.3s",
  },
  memberTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 20px 0",
  },
  memberAvatar: {
    width: 58,
    height: 58,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#fff",
    flexShrink: 0,
    transition: "transform 0.2s",
  },
  memberName: {
    fontSize: "1.08rem",
    fontWeight: 800,
    color: "#f0f9ff",
    margin: "14px 20px 4px",
    letterSpacing: "-0.3px",
  },
  memberRole: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
    margin: "0 20px 16px",
    lineHeight: 1.4,
  },
  memberDivider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "0 20px 14px",
  },
  memberLinks: {
    display: "flex",
    flexDirection: "column",
    gap: 9,
    padding: "0 20px 20px",
  },
  memberLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    fontSize: "0.8rem",
    fontWeight: 500,
    transition: "color 0.2s",
  },
  memberLinkText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // ── Dev Card (Glassmorphic) ──
  devCard: {
    background: "rgba(10, 22, 40, 0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: 24,
    padding: "48px 52px",
    display: "flex",
    gap: 48,
    alignItems: "flex-start",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    flexWrap: "wrap",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.3s ease",
  },
  devLeft: {
    flex: 2,
    minWidth: 260,
  },
  devRight: {
    flex: 1,
    minWidth: 200,
  },
  devName: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: 800,
    color: "#f0f9ff",
    margin: "0 0 16px",
    letterSpacing: "-1px",
    fontFamily: "Georgia, serif",
  },
  devBio: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 1.8,
    margin: "0 0 14px",
  },
  techRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  techChip: {
    background: "rgba(132,204,22,0.12)",
    border: "1px solid rgba(132,204,22,0.25)",
    color: "#84cc16",
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 20,
    transition: "all 0.2s",
  },
  devStats: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingTop: 8,
  },
  devStat: {
    display: "flex",
    flexDirection: "column",
    borderLeft: "3px solid #84cc16",
    paddingLeft: 16,
    transition: "transform 0.2s",
  },
  devStatNum: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#f0f9ff",
    letterSpacing: "-1px",
    lineHeight: 1,
  },
  devStatLabel: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: 4,
  },

  // ── FAQ ──
  faqHeading: {
    fontSize: "clamp(1.5rem, 4vw, 1.8rem)",
    fontWeight: 800,
    color: "#f0f9ff",
    margin: "0 0 32px",
    letterSpacing: "-1px",
    fontFamily: "Georgia, serif",
  },
  faqItem: {
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    transition: "all 0.2s",
  },
  faqQ: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#f0f9ff",
    textAlign: "left",
    gap: 12,
    transition: "background 0.2s",
  },
  faqA: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 1.7,
    padding: "0 20px 18px",
    margin: 0,
  },
};

// Add animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes glowPulse {
    0%, 100% {
      text-shadow: 0 0 5px rgba(132, 204, 22, 0.3);
    }
    50% {
      text-shadow: 0 0 20px rgba(132, 204, 22, 0.6);
    }
  }
  
  @keyframes pulseRing {
    0%, 100% {
      box-shadow: 0 0 20px rgba(132, 204, 22, 0.3);
    }
    50% {
      box-shadow: 0 0 30px rgba(132, 204, 22, 0.6);
    }
  }
  
  .member-link:hover {
    color: #84cc16 !important;
  }
  
  .tech-chip:hover {
    background: rgba(132, 204, 22, 0.2) !important;
    transform: translateY(-2px);
  }
  
  .faq-item:hover {
    border-color: rgba(132, 204, 22, 0.3) !important;
  }
`;
document.head.appendChild(styleSheet);