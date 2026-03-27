import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Favorites() {
  const favorites = useStore((s) => s.favorites);
  const removeFavorite = useStore((s) => s.removeFavorite);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState(null);

  const mapEmbedUrl = (lat, lng) =>
    `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`;

  const mapsDirectionsUrl = (lat, lng) =>
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const handleNavigate = (place) => {
    navigate("/dashboard", { state: { destination: place } });
  };

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => {
      removeFavorite(id);
      setRemoving(null);
    }, 350);
  };

  const filtered = favorites.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page} className="fav-page">
      <style>{`
        .fav-page {
          padding-top: 110px; /* Increased to give more space below navbar */
        }

        .fav-header {
          margin-top: 20px; /* Pushes the favorites header down a little */
        }

        @media (max-width: 768px) {
          .fav-page {
            padding-top: 100px;
          }
          .fav-header {
            margin-top: 15px;
          }
        }

        @media (max-width: 480px) {
          .fav-page {
            padding: 100px 14px 80px;
          }
          .fav-header {
            margin-top: 12px;
          }
          .fav-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .fav-search {
            width: 100% !important;
          }
          .fav-search input {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Header - Now pushed down a little */}
      <div style={styles.header} className="fav-header">
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <h1 style={styles.title}>My Favorites</h1>
            <p style={styles.subtitle}>
              {favorites.length === 0
                ? "No saved places yet"
                : `${favorites.length} saved place${favorites.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <div style={styles.searchWrapper} className="fav-search">
            <svg 
              width="15" 
              height="15" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={styles.searchIcon}
            >
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              style={styles.searchInput}
              placeholder="Search saved places…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No favorites yet</h3>
          <p style={styles.emptyText}>
            Search for a destination on the dashboard and tap the ♥ icon to save it here.
          </p>
          <button
            style={styles.emptyBtn}
            onClick={() => navigate("/dashboard")}
          >
            Explore Destinations
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      )}

      {/* No Results */}
      {favorites.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#94a3b8" }}>
            No places match "{search}"
          </p>
        </div>
      )}

      {/* Grid */}
      <div style={styles.grid} className="fav-grid">
        {filtered.map((place) => (
          <div
            key={place.id}
            style={{
              ...styles.card,
              opacity: removing === place.id ? 0 : 1,
              transform: removing === place.id ? "scale(0.95) translateY(8px)" : "scale(1) translateY(0)",
              transition: "opacity 0.35s ease, transform 0.35s ease, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              if (removing !== place.id) {
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.13)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }
            }}
            onMouseLeave={(e) => {
              if (removing !== place.id) {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <div style={styles.mapWrapper}>
              <iframe
                title={place.name}
                src={mapEmbedUrl(place.lat, place.lng)}
                style={styles.mapIframe}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={styles.mapClickBlocker} />

              <button
                style={styles.removeBtn}
                onClick={() => handleRemove(place.id)}
                title="Remove from favorites"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              <div style={styles.heartBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
            </div>

            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{place.name}</h3>

              <div style={styles.coordsRow}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span style={styles.coordsText}>
                  {Number(place.lat).toFixed(4)}, {Number(place.lng).toFixed(4)}
                </span>
              </div>

              <div style={styles.actionsRow}>
                <button
                  style={styles.navigateBtn}
                  onClick={() => handleNavigate(place)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1d4ed8";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                  Navigate Here
                </button>

                <a
                  href={mapsDirectionsUrl(place.lat, place.lng)}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.mapsLinkBtn}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  title="Open in Google Maps"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <p style={styles.tip}>
          Click <strong>Navigate Here</strong> to set as destination on the dashboard — then enter your starting point to get directions.
        </p>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 32px 100px",
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(170deg, #0a1628 0%, #0f1e30 40%, #0d1b2a 100%)",
    color: "rgba(255, 255, 255, 0.85)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 40,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "rgba(225,29,72,0.12)",
    border: "1.5px solid rgba(225,29,72,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#f0f9ff",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.5)",
    margin: "2px 0 0",
    fontWeight: 500,
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    pointerEvents: "none",
  },
  searchInput: {
    paddingLeft: 40,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "0.88rem",
    fontWeight: 500,
    color: "#f0f9ff",
    background: "rgba(255,255,255,0.05)",
    outline: "none",
    width: 240,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 20px",
    gap: 16,
    textAlign: "center",
  },
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    border: "2px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#f0f9ff",
    margin: 0,
  },
  emptyText: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.5)",
    maxWidth: 340,
    lineHeight: 1.7,
    margin: 0,
  },
  emptyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    padding: "12px 24px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
  },
  card: {
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    transition: "all 0.25s ease",
  },
  mapWrapper: {
    position: "relative",
    height: 200,
    overflow: "hidden",
    background: "#0a1628",
  },
  mapIframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
    pointerEvents: "none",
  },
  mapClickBlocker: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  heartBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: "18px 20px 20px",
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#f0f9ff",
    margin: "0 0 8px",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  coordsRow: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 14,
  },
  coordsText: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)",
    fontFamily: "'DM Mono', monospace",
    fontWeight: 500,
  },
  actionsRow: {
    display: "flex",
    gap: 8,
  },
  navigateBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: "10px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 11,
    fontWeight: 700,
    fontSize: "0.83rem",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.15s",
  },
  mapsLinkBtn: {
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 11,
    textDecoration: "none",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  tip: {
    textAlign: "center",
    marginTop: 48,
    fontSize: "0.82rem",
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.6,
  },
};