export default function TrekInfo({ difficulty }) {
  const resources =
    difficulty === "Hard"
      ? ["Oxygen", "Trekking Poles", "Medical Kit", "Thermal Wear", "GPS/Map"]
      : ["Water", "Snacks", "Cap", "Light Jacket", "First Aid Kit"];

  const safetyTips = [
    "Check weather before starting",
    "Carry emergency contacts",
    "Do not trek alone",
    "Inform someone about your route and ETA",
  ];

  const resourceIcons = {
    "Oxygen": "M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z",
    "Trekking Poles": "M12 2v20M7 7l5-5 5 5",
    "Medical Kit": "M22 12h-4l-3 9L9 3l-3 9H2",
    "Thermal Wear": "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z",
    "GPS/Map": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
    "Water": "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    "Snacks": "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z",
    "Cap": "M3 12h18M3 12a9 9 0 0 1 18 0",
    "Light Jacket": "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z",
    "First Aid Kit": "M22 12h-4l-3 9L9 3l-3 9H2",
  };

  const tipIcons = [
    "M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z M12 8v4l3 3",
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91",
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    "M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z",
  ];

  return (
    <div style={styles.wrapper}>
      {/* Resources */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.headerDot} />
          <h3 style={styles.cardTitle}>Resources Required</h3>
        </div>
        <div style={styles.grid}>
          {resources.map((r) => (
            <div key={r} style={styles.resourceChip}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" style={styles.chipIcon}>
                <path d={resourceIcons[r] || "M12 5v14M5 12h14"} />
              </svg>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.headerDot, background: "#f97316" }} />
          <h3 style={styles.cardTitle}>Safety Tips</h3>
        </div>
        <div style={styles.tipsList}>
          {safetyTips.map((tip, i) => (
            <div key={i} style={styles.tipRow}>
              <div style={styles.tipIconBox}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" style={styles.chipIcon}>
                  <path d={tipIcons[i]} />
                </svg>
              </div>
              <span style={styles.tipText}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    width: "100%",
    marginTop: 16,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: "24px 28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#38bdf8",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "2px",
    margin: 0,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  resourceChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(56,189,248,0.08)",
    border: "1px solid rgba(56,189,248,0.18)",
    color: "#7dd3fc",
    fontSize: "0.82rem",
    fontWeight: 600,
    padding: "7px 13px",
    borderRadius: 30,
    transition: "background 0.2s, transform 0.2s",
    cursor: "default",
  },
  chipIcon: {
    width: 14,
    height: 14,
    flexShrink: 0,
  },
  tipsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  tipRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  tipIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "rgba(249,115,22,0.1)",
    border: "1px solid rgba(249,115,22,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipText: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.65)",
    fontWeight: 500,
    lineHeight: 1.5,
    paddingTop: 6,
  },
};
