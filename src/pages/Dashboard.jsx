import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import TrekInfo from "../components/TrekInfo";
import SearchBar from "../components/SearchBar";
import TrekCard from "../components/TrekCard";
import MapCard from "../components/MapCard";
import { toPolylinePath, getRouteInfo } from "../api/graphhopper";
import { useStore } from "../store/useStore";
import "./AppPage.css";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

const continents = [
  { name: "Asia",          query: "Asia Himalaya mountains dramatic" },
  { name: "Europe",        query: "Europe Alps hiking scenic" },
  { name: "North America", query: "North America Rocky Mountains trekking" },
  { name: "South America", query: "Patagonia mountains dramatic landscape" },
  { name: "Africa",        query: "Africa Kilimanjaro mountain landscape" },
  { name: "Australia",     query: "Australia outback red rock landscape" },
  { name: "Antarctica",    query: "Antarctica ice mountains dramatic" },
];

export default function Dashboard() {
  const routerLocation = useLocation();

  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation,   setToLocation]   = useState(null);
  const [routePath,    setRoutePath]    = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [continentImages, setContinentImages] = useState([]);
  const [heroBgIndex,  setHeroBgIndex]  = useState(0);
  const [fromFavorites, setFromFavorites] = useState(false);

  const addFavorite    = useStore((s) => s.addFavorite);
  const removeFavorite = useStore((s) => s.removeFavorite);
  const favorites      = useStore((s) => s.favorites);
  const isFavorited    = favorites.some((f) => f.id === toLocation?.name);
  const vehicle        = "car";

  // Pre-fill destination from Favorites page
  useEffect(() => {
    if (routerLocation.state?.destination) {
      const dest = routerLocation.state.destination;
      setToLocation({ type: "to", id: dest.id, name: dest.name, lat: dest.lat, lng: dest.lng });
      setFromFavorites(true);
      window.history.replaceState({}, "");
    }
  }, []);

  // Favorites toggle
  const handleFavorite = () => {
    if (!toLocation) return;
    if (isFavorited) removeFavorite(toLocation.name);
    else addFavorite({ id: toLocation.name, name: toLocation.name, lat: toLocation.lat, lng: toLocation.lng });
  };

  // Compute route
  useEffect(() => {
    const computeRoute = async () => {
      if (!fromLocation || !toLocation) return;
      setLoadingRoute(true);
      try {
        const route = await getRouteInfo(fromLocation.lat, fromLocation.lng, toLocation.lat, toLocation.lng, vehicle);
        if (route?.coordinates && Array.isArray(route.coordinates)) {
          setRoutePath(toPolylinePath(route.coordinates));
        }
      } catch (err) {
        console.error("GraphHopper error:", err);
      } finally {
        setLoadingRoute(false);
      }
    };
    computeRoute();
  }, [fromLocation, toLocation]);

  // Fetch continent images for hero slideshow
  useEffect(() => {
    const fetchImages = async () => {
      const results = await Promise.all(
        continents.map(async (c) => {
          try {
            const res  = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(c.query)}&client_id=${UNSPLASH_KEY}&per_page=3&orientation=landscape`);
            const data = await res.json();
            const picks = data.results || [];
            const pick  = picks[Math.floor(Math.random() * Math.min(picks.length, 3))];
            return { name: c.name, url: pick?.urls?.regular || "" };
          } catch { return { name: c.name, url: "" }; }
        })
      );
      setContinentImages(results);
    };
    fetchImages();
  }, []);

  // Hero background slideshow — cycles through continent images every 4s
  useEffect(() => {
    if (continentImages.length === 0) return;
    const interval = setInterval(() => {
      setHeroBgIndex((i) => (i + 1) % continentImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [continentImages]);

  const onSelect = (place) => {
    if (place.type === "from") setFromLocation(place);
    else if (place.type === "to") setToLocation(place);
  };

  const bothSelected = fromLocation && toLocation;
  const currentBg    = continentImages[heroBgIndex]?.url || "";
  const currentName  = continentImages[heroBgIndex]?.name || continents[heroBgIndex]?.name || "";

  return (
    <div className="app-page">

      {/* ══════════ HERO — continent image background ══════════ */}
      <header className="app-header" style={{
        backgroundImage: currentBg
          ? `linear-gradient(to bottom, rgba(8,14,28,0.52) 0%, rgba(8,14,28,0.65) 50%, rgba(8,14,28,0.88) 100%), url(${currentBg})`
          : "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f2744 100%)",
        backgroundSize:     "cover",
        backgroundPosition: "center",
        transition:         "background-image 1.2s ease-in-out",
      }}>
        {/* Live continent label - shows the current continent name */}
        {currentName && (
          <div className="hero-location-pill">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {currentName}
          </div>
        )}

        <div className="hero-badge">World's Best Trekking Routes</div>
        <h1 className="hero-title">
          Explore the World's Treks
          <br />
          <span className="hero-accent">One Earth, Many Worlds</span>
        </h1>
        <p className="app-description">
          Plan your perfect adventure — live routes, weather forecasts &amp; safety tips in one place.
        </p>

        {/* Slide dots for the 7 continents */}
        {continentImages.length > 0 && (
          <div className="hero-dots">
            {continentImages.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === heroBgIndex ? " hero-dot--active" : ""}`}
                onClick={() => setHeroBgIndex(i)}
                aria-label={`View ${continentImages[i]?.name || `slide ${i + 1}`}`}
              />
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">7</span>
            <span className="hero-stat-label">Continents</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">195</span>
            <span className="hero-stat-label">Countries</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">Free</span>
            <span className="hero-stat-label">Forever</span>
          </div>
        </div>
      </header>

      {/* ══════════ SEARCH ══════════ */}
      <section className="search-section">
        <div className="search-section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Plan Your Route
        </div>

        {/* Favorites info banner */}
        {fromFavorites && toLocation && (
          <div className="info-banner">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Destination set to <strong>{toLocation.name}</strong>. Now enter your starting point.</span>
            <button className="banner-close" onClick={() => setFromFavorites(false)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        <SearchBar
          onSelect={onSelect}
          prefilledTo={routerLocation.state?.destination?.name || ""}
          isFavorited={isFavorited}
          onFavorite={toLocation ? handleFavorite : null}
        />
      </section>

      {/* ══════════ ROUTE RESULTS ══════════ */}
      {bothSelected && (
        <section className="route-section">
          <div className="route-section-header">
            <div className="route-section-line" />
            <span className="route-section-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Route Details
            </span>
            <div className="route-section-line" />
          </div>

          {loadingRoute && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              Calculating optimized route…
            </div>
          )}

          <div className="cards-horizontal-row">
            <div className="trek-card-wrapper">
              <TrekCard
                fromLocation={fromLocation}
                toLocation={toLocation}
                trek={{ name: toLocation.name, difficulty: "Varies" }}
                vehicle={vehicle}
              />
            </div>
            <div className="weather-card-wrapper">
              <WeatherCard lat={toLocation.lat} lon={toLocation.lng} />
            </div>
          </div>

          <div className="map-wrapper">
            <MapCard
              treks={[{ name: toLocation.name, lat: toLocation.lat, lng: toLocation.lng }]}
              routePath={routePath}
              userLocation={fromLocation}
            />
          </div>

          <TrekInfo difficulty="Varies" />
        </section>
      )}
    </div>
  );
}