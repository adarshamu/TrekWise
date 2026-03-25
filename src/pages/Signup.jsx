import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useStore } from "../store/useStore";
import { useNavigate, Link } from "react-router-dom";

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export default function Signup() {
  const [username,     setUsername]     = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [videoUrl,     setVideoUrl]     = useState("");

  const navigate = useNavigate();

  const [validations, setValidations] = useState({
    hasUpper: false, hasNumber: false,
    hasSpecial: false, isLongEnough: false, matches: false,
  });

  useEffect(() => {
    setValidations({
      hasUpper:     /[A-Z]/.test(password),
      hasNumber:    /\d/.test(password),
      hasSpecial:   /[@$!%*?&]/.test(password),
      isLongEnough: password.length >= 8,
      matches:      password === confirm && confirm.length > 0,
    });
  }, [password, confirm]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          "https://api.pexels.com/videos/search?query=trekking+adventure+wilderness+expedition&per_page=5&orientation=landscape",
          { headers: { Authorization: PEXELS_KEY } }
        );
        const data = await res.json();
        const videos = data.videos;
        if (videos?.length) {
          const pick = videos[Math.floor(Math.random() * videos.length)];
          const file = pick.video_files?.find((f) => f.quality === "hd") || pick.video_files?.[0];
          if (file) setVideoUrl(file.link);
        }
      } catch (err) {
        console.error("Pexels error:", err);
      }
    };
    fetchVideo();
  }, []);

  const signup = async (e) => {
    e.preventDefault();
    const isReady = Object.values(validations).every((v) => v === true) && email && username.trim();
    if (!isReady) {
      alert("Please fill in all fields and ensure password requirements are met.");
      return;
    }
    setLoading(true);
    try {
      useStore.setState({ pendingUsername: username.trim() });
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      useStore.setState({ pendingUsername: "" });
      alert("Signup failed: " + err.message);
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    );

  const ValidationItem = ({ label, met }) => (
    <div style={{
      ...styles.valItem,
      color: met ? "#6ee7b7" : "rgba(255,255,255,0.7)",
      fontWeight: met ? "600" : "500"
    }}>
      {met ? "✓" : "○"} {label}
    </div>
  );

  return (
    <div style={styles.pageWrapper} className="auth-page">
      <style>{`
        @keyframes subtleZoom {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.05); }
        }

        body, html, #root {
          background: transparent !important;
        }

        /* Hide scrollbar — all browsers */
        .auth-scroll::-webkit-scrollbar { display: none; }
        .auth-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* SVG icon: desktop hidden, mobile visible */
        .welcome-svg { display: none; }
        @media (max-width: 520px) {
          .welcome-svg { display: flex; }
          .auth-card {
            flex-direction: column !important;
            width: 92% !important;
            height: 92vh !important;
            max-height: 92vh !important;
          }
          .auth-left-panel { display: none !important; }
          .auth-right-panel {
            padding: 28px 24px !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>

      {videoUrl && (
        <video
          key={videoUrl}
          autoPlay loop muted playsInline
          style={styles.bgVideo}
          onError={(e) => console.log("Video failed to load")}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      <div style={styles.overlay} />

      <div style={styles.card} className="auth-card">
        <div style={styles.leftPanel} className="auth-left-panel">
          <img src="/trek.jpg" alt="Signup illustration" style={styles.illustration} />
        </div>

        {/* Scrollable — no visible scrollbar */}
        <div style={styles.rightPanel} className="auth-right-panel auth-scroll">

          {/* Welcome to TrekWise — subtle uppercase tagline */}
          <div style={styles.welcomeWrap}>
            <div className="welcome-svg" style={{ alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
              <svg width="36" height="36" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))", flexShrink: 0 }}>
                <path d="M 112.61327,59.999933 A 52.613285,52.613215 0 0 1 59.999988,112.61315 52.613285,52.613215 0 0 1 7.3867023,59.999933 52.613285,52.613215 0 0 1 59.999988,7.3867164 52.613285,52.613215 0 0 1 112.61327,59.999933 Z" style={{fill:"#80deea",fillOpacity:1}}/>
                <path d="M 18.505128,47.20668 7.4749846,58.23683 c -0.039264,0.587218 -0.068705,1.175053 -0.088248,1.763258 2.53e-5,29.057459 23.5557648,52.613182 52.6132648,52.613192 20.020165,-0.0273 38.290009,-11.41432 47.132109,-29.376065 L 78.030986,50.754023 59.147845,70.671836 Z" style={{fill:"#03a9f4",fillOpacity:1,fillRule:"evenodd"}}/>
                <path d="m 72.542037,49.751571 a 6.7921822,6.792173 0 0 1 -6.792182,6.792173 6.7921822,6.792173 0 0 1 -6.792182,-6.792173 6.7921822,6.792173 0 0 1 6.792182,-6.792173 6.7921822,6.792173 0 0 1 6.792182,6.792173 z" style={{fill:"#fff59d",fillOpacity:1}}/>
                <path d="M 50.121376,34.123279 9.5202829,74.724305 A 52.613284,52.613215 0 0 0 60.000001,112.61328 52.613284,52.613215 0 0 0 110.85989,73.212375 L 84.151246,46.503756 76.227234,60.228613 50.121376,34.123279 Z" style={{fill:"#4fc3f7",fillOpacity:1,fillRule:"evenodd"}}/>
                <path d="m 50.121492,34.123872 -13.366444,13.36513 c 4.634846,2.671717 11.159136,6.705806 11.159136,6.705806 l 4.334578,-7.507404 3.754996,3.753702 3.819533,-6.615441 -9.701799,-9.701793 z" style={{fill:"#ffffff",fillRule:"evenodd"}}/>
              </svg>
            </div>
            <span style={styles.welcomeText}>Welcome to TrekWise</span>
          </div>

          <h2 style={styles.heading}>Create Account</h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div style={styles.eyeContainer} onClick={() => setShowPassword(!showPassword)}>
                <EyeIcon visible={showPassword} />
              </div>
            </div>
          </div>

          <div style={styles.validationBox}>
            <ValidationItem label="8+ characters"     met={validations.isLongEnough} />
            <ValidationItem label="Uppercase letter"  met={validations.hasUpper} />
            <ValidationItem label="Number"            met={validations.hasNumber} />
            <ValidationItem label="Special character" met={validations.hasSpecial} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <div style={styles.eyeContainer} onClick={() => setShowConfirm(!showConfirm)}>
                <EyeIcon visible={showConfirm} />
              </div>
            </div>
            {confirm && (
              <div style={{
                ...styles.valItem,
                fontSize: "10px",
                marginTop: 4,
                color: validations.matches ? "#6ee7b7" : "#fca5a5",
                fontWeight: validations.matches ? "600" : "500"
              }}>
                {validations.matches ? "✓ Passwords match" : "✗ Passwords do not match"}
              </div>
            )}
          </div>

          <button
            disabled={loading}
            style={{
              ...styles.signupBtn,
              backgroundColor: loading ? "#4a5568" : (isHovered ? "#1b3d37" : "#132a26"),
              transform: isHovered && !loading ? "translateY(-1px)" : "translateY(0)",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={signup}
          >
            {loading ? "Creating Account..." : "Sign up"}
          </button>

          <div style={styles.footerLink}>
            <Link to="/login" style={styles.link}>
              Already have an account? <span style={{ textDecoration: "underline" }}>Log in</span>
            </Link>
          </div>

          {/* Breathing room at bottom when scrolled */}
          <div style={{ minHeight: "16px", flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    position:       "relative",
    display:        "flex",
    justifyContent: "center",
    alignItems:     "center",
    height:         "100vh",
    width:          "100vw",
    margin:         0,
    overflow:       "hidden",
    fontFamily:     "'Segoe UI', Roboto, sans-serif",
    background:     "transparent",
  },
  bgVideo: {
    position:  "fixed",
    top:       "50%",
    left:      "50%",
    transform: "translate(-50%, -50%)",
    minWidth:  "100%",
    minHeight: "100%",
    width:     "auto",
    height:    "auto",
    objectFit: "cover",
    zIndex:    -2,
    animation: "subtleZoom 20s ease-in-out infinite alternate",
  },
  overlay: {
    position:   "fixed",
    top:        0,
    left:       0,
    width:      "100%",
    height:     "100%",
    background: "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 100%)",
    zIndex:     -1,
  },
  card: {
    display:              "flex",
    width:                "min(750px, 85%)",
    height:               "min(600px, 90vh)",
    backgroundColor:      "rgba(255,255,255,0.15)",
    backdropFilter:       "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius:         "28px",
    overflow:             "hidden",
    boxShadow:            "0 25px 50px -12px rgba(0,0,0,0.3)",
    border:               "1px solid rgba(255,255,255,0.4)",
    zIndex:               1,
  },
  leftPanel: {
    flex:     1,
    display:  "flex",
    overflow: "hidden",
  },
  illustration: {
    width:     "100%",
    height:    "100%",
    objectFit: "cover",
  },
  rightPanel: {
    flex:          1,
    padding:       "28px 40px",
    display:       "flex",
    flexDirection: "column",
    overflowY:     "auto",      // scrollable; bar hidden via .auth-scroll class
  },
  welcomeWrap: {
    textAlign:    "center",
    marginBottom: "4px",
  },
  welcomeText: {
    fontSize:      "10px",
    fontWeight:    "700",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color:         "rgba(255,255,255,0.55)",
    textShadow:    "0 1px 3px rgba(0,0,0,0.3)",
  },
  heading: {
    fontSize:      "26px",
    fontWeight:    "800",
    color:         "#ffffff",
    textAlign:     "center",
    marginBottom:  "20px",
    letterSpacing: "-0.5px",
    textShadow:    "0 1px 4px rgba(0,0,0,0.3)",
  },
  inputGroup: { marginBottom: "13px" },
  label: {
    fontSize:     "12px",
    color:        "rgba(255,255,255,0.9)",
    marginBottom: "6px",
    display:      "block",
    marginLeft:   "14px",
    fontWeight:   "700",
    textShadow:   "0 1px 3px rgba(0,0,0,0.25)",
  },
  input: {
    width:           "100%",
    padding:         "12px 20px",
    borderRadius:    "40px",
    border:          "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.18)",
    fontSize:        "13px",
    outline:         "none",
    boxSizing:       "border-box",
    color:           "#ffffff",
    transition:      "all 0.2s ease",
  },
  validationBox: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 "5px",
    padding:             "6px 12px 10px 12px",
    marginBottom:        "6px",
  },
  valItem: {
    fontSize:   "12px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  eyeContainer: {
    position:  "absolute",
    right:     "18px",
    top:       "50%",
    transform: "translateY(-50%)",
    cursor:    "pointer",
    opacity:   0.85,
    display:   "flex",
  },
  signupBtn: {
    width:        "100%",
    padding:      "13px",
    borderRadius: "40px",
    border:       "none",
    color:        "#fff",
    fontSize:     "15px",
    fontWeight:   "700",
    marginTop:    "10px",
    cursor:       "pointer",
    transition:   "all 0.2s ease",
    flexShrink:   0,
  },
  footerLink: { textAlign: "center", marginTop: "16px" },
  link: {
    color:          "rgba(255,255,255,0.9)",
    textDecoration: "none",
    fontWeight:     "700",
    fontSize:       "13px",
    textShadow:     "0 1px 3px rgba(0,0,0,0.25)",
  },
};