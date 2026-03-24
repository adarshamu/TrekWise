import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

const steps = [
  {
    number: "01",
    title: "Search Your Route",
    desc: "Type your starting point and destination. TrekWise supports any location worldwide — from city streets to remote Himalayan peaks.",
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    query: "mountain trail path",
  },
  {
    number: "02",
    title: "Get Route Intelligence",
    desc: "We calculate the optimal route using GraphHopper. For remote mountain terrain with no roads, we fall back to straight-line distance so you're never left without data.",
    icon: "M3 12h18M3 12l4-4m-4 4 4 4M21 12l-4-4m4 4-4 4",
    query: "hiking route map",
  },
  {
    number: "03",
    title: "Check Live Weather",
    desc: "Powered by Open-Meteo, get real-time temperature, UV index, humidity, wind speed, and an 8-day forecast — with elevation-aware accuracy for high-altitude treks.",
    icon: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2",
    query: "mountain clouds weather",
  },
  {
    number: "04",
    title: "View on Map",
    desc: "Your route renders live on an interactive OpenStreetMap. Both your start and destination are pinned, with the full polyline path drawn when a drivable route exists.",
    icon: "M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276",
    query: "aerial mountain landscape",
  },
  {
    number: "05",
    title: "Pack & Stay Safe",
    desc: "TrekWise auto-generates a gear list and safety checklist tailored to your trek difficulty — so you never forget essentials before hitting the trail.",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0",
    query: "hiking gear backpack",
  },
  {
    number: "06",
    title: "Save Favourites",
    desc: "Heart any destination to save it. Your favourites are stored instantly and accessible from your profile — ready for whenever wanderlust strikes again.",
    icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    query: "beautiful mountain destination",
  },
];

const values = [
  { label: "Trails Mapped", value: "10K+", icon: "M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-1.447-.894L15 9m0 8V9m0 0L9 7" },
  { label: "Countries", value: "195", icon: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945" },
  { label: "Free Forever", value: "100%", icon: "M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" },
];

const apis = [
  {
    name: "Firebase",
    desc: "Authentication & persistent user data storage",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    href: "https://console.firebase.google.com/",
  },
  {
    name: "Geoapify",
    desc: "Location search and place autocomplete",
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    color: "#8b5cf6",
    bg: "#faf5ff",
    border: "#ddd6fe",
    href: "https://www.geoapify.com",
  },
  {
    name: "GraphHopper",
    desc: "Route calculation and distance between locations",
    icon: "M3 12h18M3 12l4-4m-4 4 4 4M21 12l-4-4m4 4-4 4",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    href: "https://www.graphhopper.com",
  },
  {
    name: "Open-Meteo",
    desc: "Free high-accuracy weather forecasts with UV, wind & elevation data",
    icon: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41",
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
    href: "https://open-meteo.com",
  },
  {
    name: "OpenStreetMap",
    desc: "Interactive maps and live route visualisation via Leaflet",
    icon: "M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    href: "https://www.openstreetmap.org",
  },
  {
    name: "Unsplash",
    desc: "High-quality photography for continents, treks and UI visuals",
    icon: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    color: "#cbd5e1",
    bg: "#1e293b",
    border: "#334155",
    href: "https://unsplash.com",
  },
  {
    name: "Pexels",
    desc: "Free video backgrounds on the login and signup pages",
    icon: "M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    href: "https://www.pexels.com",
  },
  {
    name: "Zustand",
    desc: "Lightweight global state management for user sessions and favourites",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    href: "https://zustand-demo.pmnd.rs",
  },
];

async function fetchImage(query) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || "";
  } catch {
    return "";
  }
}

export default function About() {
  const [visible, setVisible] = useState(false);
  const [heroImg, setHeroImg] = useState("");
  const [missionImg, setMissionImg] = useState("");
  const [stepImages, setStepImages] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetchImage("epic himalayan trek panorama").then(setHeroImg);
    fetchImage("mountain expedition base camp").then(setMissionImg);
    Promise.all(steps.map((s) => fetchImage(s.query))).then((results) => {
      const map = {};
      steps.forEach((s, i) => { map[s.number] = results[i]; });
      setStepImages(map);
    });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* ── HERO ── */}
      <section style={styles.heroSection}>
        {heroImg && <img src={heroImg} alt="Trek hero" style={styles.heroBgImg} />}
        <div style={styles.heroOverlay} />
        
        {/* Enhanced Hero Content with glassmorphic overlay */}
        <div style={{ ...styles.heroContent, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s ease" }}>
          <div style={styles.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            </svg>
            About TrekWise
          </div>
          <h1 style={styles.heroTitle}>
            The world is vast.<br />
            <span style={styles.heroAccentWrapper}>
              <span style={styles.heroAccent}>Start exploring it.</span>
            </span>
          </h1>
          <p style={styles.heroSub}>
            TrekWise was built for one reason — to make trekking accessible, informed, and safe for everyone.
            Whether you're planning a day hike or a multi-week expedition, we give you the data you need to go confidently.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ ...styles.statsSection, opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.2s" }}>
        <div style={styles.statsRow}>
          {values.map((v, i) => (
            <div key={i} style={styles.statCard}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                <path d={v.icon} />
              </svg>
              <span style={styles.statNum}>{v.value}</span>
              <span style={styles.statLabel}>{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ ...styles.section, opacity: visible ? 1 : 0, transition: "all 0.9s ease 0.3s" }}>
        <div style={styles.missionCard}>
          <div style={styles.missionLeft}>
            <p style={styles.sectionTag}>Our Mission</p>
            <h2 style={{ ...styles.sectionTitle, color: "#f0f9ff" }}>
              Trails shouldn't come with guesswork.
            </h2>
            <p style={{ ...styles.bodyText, color: "rgba(255,255,255,0.65)" }}>
              Too many trekkers set off underprepared — wrong gear, no weather data, no route plan.
              TrekWise bridges that gap. We combine live weather intelligence, accurate routing,
              and curated safety guidance into one clean dashboard so every trek starts with clarity.
            </p>
            <p style={{ ...styles.bodyText, color: "rgba(255,255,255,0.65)" }}>
              Our vision is a world where distance, terrain, and altitude are never a barrier —
              where a solo traveller in Karnataka has the same planning power as a seasoned expedition team.
            </p>
          </div>
          {missionImg && (
            <div style={styles.missionRight}>
              <img src={missionImg} alt="Mission" style={styles.missionImg} />
              <div style={styles.missionImgOverlay}>
                <span style={styles.missionImgText}>One Earth,<br />Many Worlds</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ ...styles.section, opacity: visible ? 1 : 0, transition: "all 0.9s ease 0.5s" }}>
        <p style={styles.sectionTag}>How It Works</p>
        <h2 style={{ ...styles.sectionTitle, textAlign: "center", marginBottom: 48 }}>
          Six steps from idea to trail.
        </h2>
        <div style={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={styles.stepCard}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {stepImages[step.number] && (
                <div style={styles.stepImgWrapper}>
                  <img src={stepImages[step.number]} alt={step.title} style={styles.stepImg} />
                  <div style={styles.stepImgOverlay} />
                  <span style={styles.stepNumberOverlay}>{step.number}</span>
                </div>
              )}
              <div style={styles.stepBody}>
                <div style={styles.stepTitleRow}>
                  <div style={styles.stepIconBox}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={step.icon} />
                    </svg>
                  </div>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                </div>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POWERED BY ── */}
      <section style={{ ...styles.section, opacity: visible ? 1 : 0, transition: "all 0.9s ease 0.6s" }}>
        <p style={styles.sectionTag}>Powered By</p>
        <h2 style={{ ...styles.sectionTitle, textAlign: "center", marginBottom: 8 }}>
          APIs & services behind TrekWise.
        </h2>
        <p style={{ ...styles.bodyText, textAlign: "center", margin: "0 auto 40px", maxWidth: 520 }}>
          Every feature in TrekWise is backed by a best-in-class API. Here's what's running under the hood.
        </p>
        <div style={styles.apisGrid}>
          {apis.map((api, i) => (
            <a
              key={i}
              href={api.href}
              target="_blank"
              rel="noreferrer"
              style={styles.apiCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = api.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${api.color}30`;
                const iconBox = e.currentTarget.querySelector('.api-icon-box');
                if (iconBox) iconBox.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
                const iconBox = e.currentTarget.querySelector('.api-icon-box');
                if (iconBox) iconBox.style.transform = "scale(1)";
              }}
            >
              <div style={{ ...styles.apiIconBox, background: api.bg, border: `1px solid ${api.border}` }} className="api-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={api.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={api.icon} />
                </svg>
              </div>
              <div style={styles.apiText}>
                <p style={{ ...styles.apiName, color: api.color }}>{api.name}</p>
                <p style={styles.apiDesc}>{api.desc}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: "auto" }}>
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ ...styles.ctaSection, opacity: visible ? 1 : 0, transition: "all 0.9s ease 0.7s" }}>
        <h2 style={styles.ctaTitle}>Ready to find your trail?</h2>
        <p style={styles.ctaSub}>Search any route in the world — takes 10 seconds.</p>
        <Link
          to="/dashboard"
          style={styles.ctaBtn}
          onMouseEnter={e => { e.currentTarget.style.background = "#a3e635"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#84cc16"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Open Dashboard →
        </Link>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(170deg, #0a1628 0%, #0f1e30 40%, #0d1b2a 100%)",
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    paddingBottom: 80,
    color: "rgba(255, 255, 255, 0.85)",
  },
  blob1: {
    position: "fixed", top: -120, right: -120,
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(132,204,22,0.08) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  blob2: {
    position: "fixed", bottom: -100, left: -100,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  heroSection: {
    position: "relative", height: "70vh", minHeight: 480,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  heroBgImg: {
    position: "absolute", inset: 0,
    width: "100%", height: "100%", objectFit: "cover", zIndex: 0,
  },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to bottom, rgba(10,22,40,0.65) 0%, rgba(10,22,40,0.85) 100%)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative", zIndex: 2,
    textAlign: "center", padding: "0 32px", maxWidth: 780,
  },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    color: "#84cc16",
    fontSize: "0.75rem", fontWeight: 700,
    padding: "6px 14px", borderRadius: 30,
    letterSpacing: "0.5px", textTransform: "uppercase",
    marginBottom: 24, fontFamily: "inherit",
  },
  heroTitle: {
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
    fontWeight: 800, color: "#ffffff",
    lineHeight: 1.15, margin: "0 0 20px",
    letterSpacing: "-1.5px",
    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
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
    position: "relative",
    display: "inline-block",
    animation: "glowPulse 2s ease-in-out infinite",
  },
  heroSub: {
    fontSize: "1.05rem", color: "rgba(255,255,255,0.75)",
    lineHeight: 1.8, maxWidth: 600, margin: "0 auto",
    fontFamily: "inherit",
  },
  statsSection: {
    position: "relative", zIndex: 1,
    padding: "0 32px", marginTop: -48, marginBottom: 60,
  },
  statsRow: {
    display: "flex", justifyContent: "center",
    gap: 20, flexWrap: "wrap",
    maxWidth: 700, margin: "0 auto",
  },
  statCard: {
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: "24px 36px",
    display: "flex", flexDirection: "column", alignItems: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    minWidth: 140,
    transition: "transform 0.2s",
  },
  statNum: {
    fontSize: "2rem", fontWeight: 800,
    color: "#f0f9ff", letterSpacing: "-1px",
    fontFamily: "inherit",
  },
  statLabel: {
    fontSize: "0.72rem", color: "rgba(255,255,255,0.5)",
    fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "1px", marginTop: 4,
    fontFamily: "inherit",
  },
  section: {
    maxWidth: 1100, margin: "0 auto",
    padding: "0 32px 80px",
    position: "relative", zIndex: 1,
  },
  sectionTag: {
    fontSize: "0.72rem", fontWeight: 700,
    color: "#84cc16", textTransform: "uppercase",
    letterSpacing: "2px", marginBottom: 12,
    fontFamily: "inherit",
  },
  sectionTitle: {
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
    fontWeight: 800, color: "#f0f9ff",
    letterSpacing: "-0.8px", lineHeight: 1.2,
    margin: "0 0 20px",
  },
  bodyText: {
    fontSize: "1rem", color: "rgba(255,255,255,0.65)",
    lineHeight: 1.8, margin: "0 0 16px",
    maxWidth: 520, fontFamily: "inherit",
  },
  missionCard: {
    background: "rgba(10, 22, 40, 0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: 24,
    padding: "56px",
    display: "flex", gap: 48, alignItems: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
    flexWrap: "wrap",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  missionLeft: { flex: 2, minWidth: 280 },
  missionRight: {
    flex: 1, minWidth: 220,
    position: "relative", borderRadius: 16, overflow: "hidden", height: 260,
  },
  missionImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 },
  missionImgOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
    borderRadius: 16, display: "flex", alignItems: "flex-end", padding: 20,
  },
  missionImgText: { 
    color: "#fff", 
    fontSize: "1.1rem", 
    fontWeight: 700, 
    lineHeight: 1.4,
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
    background: "linear-gradient(135deg, #fff, #84cc16)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
  },
  stepCard: {
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    cursor: "default",
  },
  stepImgWrapper: { position: "relative", height: 160, overflow: "hidden" },
  stepImg: { width: "100%", height: "100%", objectFit: "cover" },
  stepImgOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.45))",
  },
  stepNumberOverlay: {
    position: "absolute", bottom: 12, right: 16,
    fontSize: "3rem", fontWeight: 800,
    color: "rgba(255,255,255,0.25)",
    lineHeight: 1, letterSpacing: "-3px",
    fontFamily: "inherit",
  },
  stepBody: { padding: "20px 24px 24px" },
  stepTitleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  stepIconBox: {
    width: 34, height: 34, borderRadius: 10,
    background: "rgba(132,204,22,0.12)",
    border: "1px solid rgba(132,204,22,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepTitle: {
    fontSize: "1rem", fontWeight: 700,
    color: "#f0f9ff", margin: 0,
    fontFamily: "inherit",
  },
  stepDesc: {
    fontSize: "0.87rem", color: "rgba(255,255,255,0.6)",
    lineHeight: 1.7, margin: 0,
    fontFamily: "inherit",
  },
  apisGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  apiCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: "16px 20px",
    textDecoration: "none",
    transition: "all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  apiIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "transform 0.2s",
  },
  apiText: {
    flex: 1,
    minWidth: 0,
  },
  apiName: {
    fontSize: "0.9rem",
    fontWeight: 800,
    margin: "0 0 4px",
    fontFamily: "inherit",
    transition: "color 0.2s",
  },
  apiDesc: {
    fontSize: "0.76rem",
    color: "rgba(255, 255, 255, 0.55)",
    margin: 0,
    lineHeight: 1.5,
    fontFamily: "inherit",
    transition: "color 0.2s",
  },
  ctaSection: {
    textAlign: "center", padding: "0 32px",
    position: "relative", zIndex: 1,
  },
  ctaTitle: {
    fontSize: "clamp(1.8rem, 4vw, 3rem)",
    fontWeight: 800, color: "#f0f9ff",
    letterSpacing: "-1px", margin: "0 0 12px",
  },
  ctaSub: {
    fontSize: "1rem", color: "rgba(255,255,255,0.6)",
    margin: "0 0 32px", fontFamily: "inherit",
  },
  ctaBtn: {
    display: "inline-block",
    background: "#84cc16",
    color: "#0f172a",
    padding: "16px 40px",
    borderRadius: 14,
    fontWeight: 700,
    fontSize: "1rem",
    textDecoration: "none",
    transition: "background 0.2s, transform 0.2s",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(132,204,22,0.3)",
  },
};

// Add animation keyframes to the document
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
  
  .hero-accent-text {
    animation: glowPulse 2s ease-in-out infinite;
  }
`;
document.head.appendChild(styleSheet);