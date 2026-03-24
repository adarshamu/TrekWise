import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Animated globe */}
        <svg style={styles.globe} viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>

        <div style={styles.code}>404</div>
        <h1 style={styles.title}>Trail Not Found</h1>
        <p style={styles.desc}>
          Looks like this path leads nowhere. The page you're looking for doesn't exist or has moved.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/dashboard")}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1d4ed8"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2563eb"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Back to Dashboard
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: 24,
  },
  card: {
    textAlign: "center",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  globe: {
    width: 120,
    height: 120,
    animation: "spin 12s linear infinite",
    opacity: 0.5,
  },
  code: {
    fontSize: "5rem",
    fontWeight: 900,
    color: "#e2e8f0",
    lineHeight: 1,
    letterSpacing: "-4px",
    fontFamily: "'DM Mono', monospace",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  desc: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    lineHeight: 1.7,
    margin: 0,
    maxWidth: 340,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 22px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: "0.88rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  secondaryBtn: {
    padding: "11px 22px",
    background: "#fff",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "0.88rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
