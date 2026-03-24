import { useEffect, useState } from "react";
import { getRouteInfo } from "../api/graphhopper";
import "./TrekCard.css";

const CardIcon = ({ path, className = "card-svg" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
);

export default function TrekCard({ fromLocation, toLocation, trek, vehicle }) {
  const [distance, setDistance] = useState("-");
  const [time, setTime] = useState("-");
  const [isFallback, setIsFallback] = useState(false);

  const icons = {
    mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    clock: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    route: "M9 18l6-6-6-6",
    difficulty: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    warning: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    externalLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (!fromLocation || !toLocation) return;
      setDistance("...");
      setTime("...");
      try {
        const route = await getRouteInfo(
          fromLocation.lat, fromLocation.lng,
          toLocation.lat, toLocation.lng,
          vehicle
        );
        if (route) {
          setIsFallback(route.isFallback);
          setDistance(`${route.distanceKm} km`);
          setTime(route.durationHrs ? `${route.durationHrs} hrs` : "N/A");
        } else {
          setDistance("Unavailable");
          setTime("Unavailable");
        }
      } catch (err) {
        setDistance("Error");
        setTime("Error");
      }
    };
    fetchRoute();
  }, [fromLocation, toLocation, vehicle]);

  // Build Google Maps directions URL from fromLocation → toLocation
  const googleMapsUrl = (() => {
    if (!toLocation) return null;
    const to = `${toLocation.lat},${toLocation.lng}`;
    if (fromLocation?.lat && fromLocation?.lng) {
      const from = `${fromLocation.lat},${fromLocation.lng}`;
      return `https://www.google.com/maps/dir/${from}/${to}`;
    }
    // No from location — just open destination on map
    return `https://www.google.com/maps/search/?api=1&query=${to}`;
  })();

  return (
    <div className="trek-card">
      <div className="card-header">
        <div className="trek-badge">{trek.difficulty}</div>
        <h3 className="trek-title">{trek.name}</h3>
      </div>

      <div className="location-flow">
        <div className="loc-item">
          <CardIcon path={icons.mapPin} className="pin-icon from" />
          <span>{fromLocation?.name ?? "Start Point"}</span>
        </div>
        <div className="route-line"></div>
        <div className="loc-item">
          <CardIcon path={icons.mapPin} className="pin-icon to" />
          <span>{toLocation?.name ?? "Destination"}</span>
        </div>
      </div>

      {isFallback && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#fffbeb",
          border: "1px solid #fcd34d",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: "0.75rem",
          color: "#92400e",
          marginBottom: 8,
          fontWeight: 600,
        }}>
          <CardIcon path={icons.warning} className="small-icon" />
          No drivable route found. Showing straight-line distance.
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Distance</span>
          <span className="stat-value">{distance}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Travel Time</span>
          <div className="time-row">
            <CardIcon path={icons.clock} className="small-icon" />
            <span className="stat-value">{time}</span>
          </div>
        </div>
      </div>

      {/* Replaced broken "View Full Route" button with Google Maps link */}
      {googleMapsUrl ? (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="view-details-btn"
        >
          Open in Google Maps
          <CardIcon path={icons.externalLink} className="small-icon" />
        </a>
      ) : (
        <button className="view-details-btn" disabled>
          Select a destination first
        </button>
      )}
    </div>
  );
}
