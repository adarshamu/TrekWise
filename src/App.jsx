import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useStore } from "./store/useStore";

import Navbar           from "./components/Navbar";
import Dashboard        from "./pages/Dashboard";
import About            from "./pages/About";
import Favorites        from "./pages/Favorites";
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";
import Profile          from "./pages/Profile";
import DeveloperContact from "./pages/DeveloperContact";
import NotFound         from "./pages/NotFound";
import Footer from "./components/Footer";

export default function App() {
  const user            = useStore((s) => s.user);
  const initUserProfile = useStore((s) => s.initUserProfile);
  const location        = useLocation();

  // Only true until Firebase responds (usually < 300ms from localStorage)
  const [authLoading, setAuthLoading] = useState(true);

  // Routes where navbar and footer should be hidden
  const hideNavbarRoutes = ["/login", "/signup"];
  const hideFooterRoutes = ["/login", "/signup"];
  
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // 1. Set user in store IMMEDIATELY from Firebase auth token
        //    (no network call needed — comes from localStorage)
        useStore.setState({ user: firebaseUser });

        // 2. Load Firestore profile in the background — doesn't block the UI
        initUserProfile(firebaseUser).catch((err) =>
          console.error("Firestore profile load failed:", err)
        );
      } else {
        // No saved session
        useStore.setState({ user: null, username: "", favorites: [] });
      }

      // Mark auth as resolved — happens instantly since we don't await Firestore
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div style={S.page}>
        <svg style={S.globe} viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={S.brand}>TrekWise</span>
      </div>
    );
  }

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <div style={{ padding: 0 }}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/signup" replace />} />

          {/* Protected */}
          <Route path="/dashboard" element={user ? <Dashboard />   : <Navigate to="/login" replace />} />
          <Route path="/about"     element={user ? <About />       : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={user ? <Favorites />   : <Navigate to="/login" replace />} />
          <Route path="/profile"   element={user ? <Profile />     : <Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/contact" element={<DeveloperContact />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!shouldHideFooter && <Footer />}
      </div>
    </div>
  );
}

const S = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    background: "linear-gradient(170deg, #0a1628 0%, #0f1e30 40%, #0d1b2a 100%)",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  globe: {
    width: 42,
    height: 42,
    animation: "spin 2.5s linear infinite",
  },
  brand: {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "#f0f9ff",
    letterSpacing: "-0.5px",
  },
};