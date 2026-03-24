import { useState, useRef, useEffect } from "react";
import { searchPlace } from "../api/geoapify";

export default function SearchBar({ onSelect, prefilledTo = "", isFavorited = false, onFavorite = null }) {
  const [fromQuery,   setFromQuery]   = useState("");
  const [toQuery,     setToQuery]     = useState(prefilledTo);
  const [fromResults, setFromResults] = useState([]);
  const [toResults,   setToResults]   = useState([]);
  const [fromFocus,   setFromFocus]   = useState(false);
  const [toFocus,     setToFocus]     = useState(false);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading,   setToLoading]   = useState(false);

  const fromRef = useRef(null);
  const toRef   = useRef(null);

  // If parent passes a prefilled destination (from Favorites), show it
  useEffect(() => {
    if (prefilledTo) setToQuery(prefilledTo);
  }, [prefilledTo]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromResults([]);
        setFromFocus(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToResults([]);
        setToFocus(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchFrom = async (e) => {
    const v = e.target.value;
    setFromQuery(v);
    if (v.length > 2) {
      setFromLoading(true);
      const res = await searchPlace(v);
      setFromResults(res);
      setFromLoading(false);
    } else {
      setFromResults([]);
    }
  };

  const searchTo = async (e) => {
    const v = e.target.value;
    setToQuery(v);
    if (v.length > 2) {
      setToLoading(true);
      const res = await searchPlace(v);
      setToResults(res);
      setToLoading(false);
    } else {
      setToResults([]);
    }
  };

  const selectFrom = (place) => {
    setFromQuery(place.name);
    setFromResults([]);
    setFromFocus(false);
    onSelect({ type: "from", ...place });
  };

  const selectTo = (place) => {
    setToQuery(place.name);
    setToResults([]);
    setToFocus(false);
    onSelect({ type: "to", ...place });
  };

  const clearFrom = () => {
    setFromQuery("");
    setFromResults([]);
  };

  const clearTo = () => {
    setToQuery("");
    setToResults([]);
  };

  return (
    <div style={styles.wrapper}>
      {/* ── FROM ── */}
      <div style={styles.fieldGroup} ref={fromRef}>
        <label style={styles.label}>
          <span style={{ ...styles.dot, background: "#84cc16" }} />
          From
        </label>
        <div style={{
          ...styles.inputWrapper,
          boxShadow: fromFocus ? "0 0 0 3px rgba(132,204,22,0.2)" : "none",
          borderColor: fromFocus ? "#84cc16" : "rgba(255,255,255,0.12)",
        }}>
          {/* Location pin icon */}
          <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>

          <input
            style={styles.input}
            placeholder="Your starting point…"
            value={fromQuery}
            onChange={searchFrom}
            onFocus={() => setFromFocus(true)}
            autoComplete="off"
          />

          {fromLoading ? (
            <div style={styles.spinner} />
          ) : fromQuery ? (
            <button style={styles.clearBtn} onClick={clearFrom} title="Clear">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ) : null}
        </div>

        {/* Dropdown */}
        {fromFocus && fromResults.length > 0 && (
          <div style={styles.dropdown}>
            {fromResults.map((r, i) => (
              <div
                key={r.id}
                style={styles.dropdownItem}
                onMouseDown={() => selectFrom(r)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(132, 204, 22, 0.12)";
                  e.currentTarget.style.color = "#84cc16";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#f0f9ff";
                }}
              >
                <div style={styles.dropdownIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <span style={styles.dropdownText}>{r.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {fromFocus && fromQuery.length > 2 && !fromLoading && fromResults.length === 0 && (
          <div style={styles.noResults}>No places found</div>
        )}
      </div>

      {/* ── Swap / divider ── */}
      <div style={styles.dividerRow}>
        <div style={styles.dividerLine} />
        <div style={styles.routeDot}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
        <div style={styles.dividerLine} />
      </div>

      {/* ── TO ── */}
      <div style={styles.fieldGroup} ref={toRef}>
        <label style={styles.label}>
          <span style={{ ...styles.dot, background: "#f87171" }} />
          To
        </label>
        <div style={{
          ...styles.inputWrapper,
          boxShadow: toFocus ? "0 0 0 3px rgba(248,113,113,0.2)" : "none",
          borderColor: toFocus ? "#f87171" : "rgba(255,255,255,0.12)",
        }}>
          <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>

          <input
            style={styles.input}
            placeholder="Where are you heading?…"
            value={toQuery}
            onChange={searchTo}
            onFocus={() => setToFocus(true)}
            autoComplete="off"
          />

          {toLoading ? (
            <div style={styles.spinner} />
          ) : toQuery ? (
            <button style={styles.clearBtn} onClick={clearTo} title="Clear">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ) : null}
        </div>

        {/* Dropdown */}
        {toFocus && toResults.length > 0 && (
          <div style={styles.dropdown}>
            {toResults.map((r) => (
              <div
                key={r.id}
                style={styles.dropdownItem}
                onMouseDown={() => selectTo(r)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(248,113,113,0.12)";
                  e.currentTarget.style.color = "#f87171";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#f0f9ff";
                }}
              >
                <div style={styles.dropdownIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                </div>
                <span style={styles.dropdownText}>{r.name}</span>
              </div>
            ))}
          </div>
        )}

        {toFocus && toQuery.length > 2 && !toLoading && toResults.length === 0 && (
          <div style={styles.noResults}>No places found</div>
        )}
      </div>

      {/* ── Add to Favorites — shown when destination is typed ── */}
      {onFavorite && toQuery && (
        <>
          <div style={styles.favDivider} />
          <button
            style={{
              ...styles.favBtn,
              background:   isFavorited ? "rgba(132,204,22,0.15)" : "rgba(132,204,22,0.08)",
              borderColor:  isFavorited ? "#84cc16" : "rgba(132,204,22,0.3)",
              color:        isFavorited ? "#84cc16" : "#84cc16",
            }}
            onClick={onFavorite}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = "rgba(132,204,22,0.2)";
              e.currentTarget.style.borderColor  = "#84cc16";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = isFavorited ? "rgba(132,204,22,0.15)" : "rgba(132,204,22,0.08)";
              e.currentTarget.style.borderColor  = isFavorited ? "#84cc16" : "rgba(132,204,22,0.3)";
            }}
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill={isFavorited ? "#84cc16" : "none"}
              stroke="#84cc16" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "fill 0.2s" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(10, 22, 40, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '20px 24px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
    maxWidth: 780,
    margin: '0 auto',
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    color: 'rgba(255, 255, 255, 0.85)',
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#84cc16',      // label text stays green for both (optional)
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },

  fieldGroup: {
    position: 'relative',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '14px',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputIcon: {
    flexShrink: 0,
    stroke: 'rgba(255, 255, 255, 0.5)',
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '0.92rem',
    fontWeight: 500,
    color: '#f0f9ff',
    outline: 'none',
    width: '100%',
    padding: 0,
    fontFamily: 'inherit',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.35)',
    },
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    padding: 2,
    borderRadius: 4,
    flexShrink: 0,
    transition: 'color 0.15s',
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderTop: '2px solid #84cc16',   // spinner always green (or could be red for To, but we keep consistent)
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },

  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: '14px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(255, 255, 255, 0.1)',
  },
  routeDot: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
    zIndex: 10000,
    overflow: 'hidden',
    maxHeight: 240,
    overflowY: 'auto',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    background: 'transparent',
    color: '#f0f9ff',
  },
  dropdownIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dropdownText: {
    fontSize: '0.85rem',
    color: 'inherit',
    fontWeight: 500,
    lineHeight: 1.4,
    textAlign: 'left',
  },
  noResults: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    padding: '12px 16px',
    fontSize: '0.83rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 500,
    zIndex: 10000,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
  },
  favDivider: {
    height: 1,
    background: 'rgba(255, 255, 255, 0.08)',
    margin: '16px 0 12px',
  },
  favBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 16px',
    border: '1px solid',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
    fontFamily: 'inherit',
  },
};