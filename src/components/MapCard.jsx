import { useEffect, useRef, useState } from "react";
import {
  MapContainer, TileLayer, Marker, Popup,
  Polyline, useMap, ScaleControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;gap:0">
    <div style="
      width:30px;height:30px;
      background:#34a853;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid #1e7e34;
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="
        width:10px;height:10px;
        background:#fff;
        border-radius:50%;
        transform:rotate(45deg);
      "></div>
    </div>
    <div style="
      width:2px;height:6px;
      background:#1e7e34;
      margin-top:-1px;
    "></div>
  </div>`,
  iconSize:    [30, 42],
  iconAnchor:  [15, 42],
  popupAnchor: [0, -44],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;gap:0">
    <div style="
      width:30px;height:30px;
      background:#ea4335;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid #c62828;
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="
        width:10px;height:10px;
        background:#fff;
        border-radius:50%;
        transform:rotate(45deg);
      "></div>
    </div>
    <div style="
      width:2px;height:6px;
      background:#c62828;
      margin-top:-1px;
    "></div>
  </div>`,
  iconSize:    [30, 42],
  iconAnchor:  [15, 42],
  popupAnchor: [0, -44],
});

// ── FitBounds ─────────────────────────────────────────────────
function FitBounds({ userLocation, treks, routePath }) {
  const map = useMap();
  useEffect(() => {
    const points = [];
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);
    treks.forEach((t) => { if (t.lat && t.lng) points.push([t.lat, t.lng]); });
    routePath.forEach((p) => points.push([p.lat, p.lng]));
    if (points.length > 0) {
      try { map.fitBounds(points, { padding: [60, 60], maxZoom: 14 }); } catch (_) {}
    }
  }, [userLocation?.lat, userLocation?.lng, treks.length, routePath.length]);
  return null;
}

// ── Google Maps-style Zoom Control ───────────────────────────
function GoogleZoomControl() {
  const map = useMap();
  return (
    <div style={gmStyles.zoomBox}>
      <button
        style={gmStyles.zoomBtn}
        onClick={() => map.zoomIn()}
        title="Zoom in"
        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      <div style={gmStyles.zoomDivider} />
      <button
        style={gmStyles.zoomBtn}
        onClick={() => map.zoomOut()}
        title="Zoom out"
        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
}

// ── Route ─────────────────────────────────────────────────────
function RoutePolyline({ positions }) {
  if (!positions || positions.length < 2) return null;
  return (
    <>
      {/* Casing / outline */}
      <Polyline positions={positions} pathOptions={{ color: "#1a6fcc", weight: 7, opacity: 1, lineCap: "round", lineJoin: "round" }} />
      {/* Main blue line — Google Maps route blue */}
      <Polyline positions={positions} pathOptions={{ color: "#4285f4", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" }} />
    </>
  );
}

// ── Map Layer toggler (inside map) ────────────────────────────
function LayerSwitcher({ layer, setLayer }) {
  return (
    <div style={gmStyles.layerCard}>
      <button
        style={{ ...gmStyles.layerBtn, ...(layer === "map" ? gmStyles.layerBtnActive : {}) }}
        onClick={() => setLayer("map")}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={layer === "map" ? "#1a73e8" : "#777"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
        <span style={{ ...gmStyles.layerLabel, color: layer === "map" ? "#1a73e8" : "#555" }}>Map</span>
      </button>
      <button
        style={{ ...gmStyles.layerBtn, ...(layer === "satellite" ? gmStyles.layerBtnActive : {}) }}
        onClick={() => setLayer("satellite")}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={layer === "satellite" ? "#1a73e8" : "#777"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={{ ...gmStyles.layerLabel, color: layer === "satellite" ? "#1a73e8" : "#555" }}>Satellite</span>
      </button>
    </div>
  );
}

// ── Main MapCard ──────────────────────────────────────────────
function MapCard({ treks = [], routePath = [], userLocation = null }) {
  const [layer, setLayer] = useState("map");

  const tileUrl = layer === "satellite"
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttr = layer === "satellite"
    ? "Tiles &copy; Esri"
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';

  if (!userLocation) {
    return (
      <div style={gmStyles.emptyState}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p style={gmStyles.emptyText}>Enter a starting point to see the map</p>
      </div>
    );
  }

  return (
    <div style={gmStyles.wrapper}>
      <style>{`
        .gm-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          padding: 0;
          font-family: 'Google Sans', Roboto, Arial, sans-serif;
          border: none;
        }
        .gm-popup .leaflet-popup-content {
          margin: 0;
        }
        .gm-popup .leaflet-popup-tip {
          box-shadow: none;
        }
        .gm-popup .leaflet-popup-close-button {
          color: #70757a;
          font-size: 18px;
          top: 8px;
          right: 8px;
        }
        .leaflet-control-attribution {
          display: none;
        }
        .leaflet-control-scale-line {
          border: 2px solid #555;
          border-top: none;
          font-family: Roboto, Arial, sans-serif;
          font-size: 10px;
          color: #555;
          background: rgba(255,255,255,0.8);
          padding: 1px 4px;
        }
      `}</style>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={10}
        style={gmStyles.map}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={tileUrl} attribution={tileAttr} maxZoom={19} />

        <div className="leaflet-bottom leaflet-right" style={{ marginBottom: 80, marginRight: 10 }}>
          <div className="leaflet-control">
            <GoogleZoomControl />
          </div>
        </div>

        <ScaleControl position="bottomleft" imperial={false} />

        {/* User marker — green pin */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup className="gm-popup">
            <div style={gmStyles.popup}>
              <div style={gmStyles.popupTitle}>Your location</div>
              <div style={gmStyles.popupCoords}>
                {userLocation.lat?.toFixed(5)}, {userLocation.lng?.toFixed(5)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Destination markers — red pin */}
        {treks.map((t, i) =>
          t.lat && t.lng ? (
            <Marker key={i} position={[t.lat, t.lng]} icon={destinationIcon}>
              <Popup className="gm-popup">
                <div style={gmStyles.popup}>
                  <div style={gmStyles.popupTitle}>{t.name}</div>
                  <div style={gmStyles.popupCoords}>
                    {Number(t.lat).toFixed(5)}, {Number(t.lng).toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}

        {routePath.length > 0 && (
          <RoutePolyline positions={routePath.map(({ lat, lng }) => [lat, lng])} />
        )}

        <FitBounds userLocation={userLocation} treks={treks} routePath={routePath} />
      </MapContainer>

      <div style={gmStyles.layerWrapper}>
        <LayerSwitcher layer={layer} setLayer={setLayer} />
      </div>

      <div style={gmStyles.attribution}>
        <span>Map data &copy; {new Date().getFullYear()} OpenStreetMap contributors</span>
        <span style={{ marginLeft: "auto" }}>
          <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer" style={{ color: "#70757a", textDecoration: "none" }}>
            Terms
          </a>
        </span>
      </div>
    </div>
  );
}

export default MapCard;

// ── Google Maps UI Styles ─────────────────────────────────────
const gmStyles = {
  wrapper: {
    position:     "relative",
    borderRadius: 12,
    overflow:     "hidden",
    boxShadow:    "0 2px 10px rgba(0,0,0,0.2)",
    border:       "none",
    background:   "#e8eaed",
  },
  map: {
    width:  "100%",
    height: "460px",
  },
  emptyState: {
    height:         "460px",
    background:     "#e8eaed",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            12,
    borderRadius:   12,
  },
  emptyText: {
    fontSize:   "0.85rem",
    color:      "#9aa0a6",
    fontWeight: 400,
    maxWidth:   240,
    textAlign:  "center",
    lineHeight: 1.5,
    margin:     0,
    fontFamily: "Roboto, Arial, sans-serif",
  },
  popup: {
    padding:    "12px 16px 14px",
    minWidth:   180,
    fontFamily: "Roboto, Arial, sans-serif",
  },
  popupTitle: {
    fontSize:   "0.95rem",
    fontWeight: 500,
    color:      "#202124",
    marginBottom: 4,
  },
  popupCoords: {
    fontSize:   "0.75rem",
    color:      "#70757a",
    fontFamily: "monospace",
  },
  zoomBox: {
    background:    "#fff",
    borderRadius:  4,
    boxShadow:     "0 1px 4px rgba(0,0,0,0.3)",
    display:       "flex",
    flexDirection: "column",
    overflow:      "hidden",
    width:          40,
  },
  zoomBtn: {
    width:          40,
    height:         40,
    background:     "#fff",
    border:         "none",
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    transition:     "background 0.15s",
    padding:        0,
  },
  zoomDivider: {
    height:     1,
    background: "#e0e0e0",
    margin:     "0 6px",
  },
  layerWrapper: {
    position: "absolute",
    bottom:   40,
    right:    10,
    zIndex:   1000,
  },
  layerCard: {
    display:      "flex",
    gap:          6,
    background:   "#fff",
    borderRadius: 8,
    padding:      "8px 10px",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.3)",
  },
  layerBtn: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           4,
    background:    "none",
    border:        "2px solid transparent",
    borderRadius:  6,
    padding:       "6px 10px",
    cursor:        "pointer",
    transition:    "border-color 0.15s",
  },
  layerBtnActive: {
    borderColor: "#1a73e8",
  },
  layerLabel: {
    fontSize:   "0.65rem",
    fontWeight: 500,
    fontFamily: "Roboto, Arial, sans-serif",
  },
  attribution: {
    position:       "absolute",
    bottom:         0,
    left:           0,
    right:          0,
    background:     "rgba(255,255,255,0.85)",
    padding:        "3px 10px",
    fontSize:       "0.65rem",
    color:          "#70757a",
    display:        "flex",
    alignItems:     "center",
    fontFamily:     "Roboto, Arial, sans-serif",
    zIndex:         1000,
    backdropFilter: "blur(4px)",
  },
};