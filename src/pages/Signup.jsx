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
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#132a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#132a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    );

  const ValidationItem = ({ label, met }) => (
    <div style={{ 
      ...styles.valItem, 
      color: met ? "#065f46" : "#1e2937", 
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
        
        @media (max-width: 520px) {
          .auth-card {
            flex-direction: column !important;
            width: 92% !important;
            height: auto !important;
            max-height: 95vh !important;
          }
          .auth-left-panel { display: none !important; }
        }
      `}</style>

      {/* Video Background */}
      {videoUrl && (
        <video 
          key={videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
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

        <div style={styles.rightPanel} className="auth-right-panel">
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
                color: validations.matches ? "#065f46" : "#991b1b",
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
    position:        "fixed",
    top:             0,
    left:            0,
    width:           "100%",
    height:          "100%",
    background:      "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 100%)",
    zIndex:          -1,
  },
  card: {
    display:             "flex",
    width:               "min(750px, 85%)",
    height:              "min(580px, 90vh)",
    backgroundColor:     "rgba(255,255,255,0.15)",
    backdropFilter:      "blur(20px)",
    WebkitBackdropFilter:"blur(20px)",
    borderRadius:        "28px",
    overflow:            "hidden",
    boxShadow:           "0 25px 50px -12px rgba(0,0,0,0.3)",
    border:              "1px solid rgba(255,255,255,0.4)",
    zIndex:              1,
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
    flex:           1,
    padding:        "32px 40px",
    display:        "flex",
    flexDirection:  "column",
    justifyContent: "center",
    overflowY:      "auto",
  },
  heading: {
    fontSize:     "28px",
    fontWeight:   "800",
    color:        "#132a26",
    textAlign:    "center",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  },
  inputGroup: { marginBottom: "14px" },
  label: {
    fontSize:     "12px",
    color:        "#132a26",
    marginBottom: "6px",
    display:      "block",
    marginLeft:   "14px",
    fontWeight:   "700",
  },
  input: {
    width:           "100%",
    padding:         "12px 20px",
    borderRadius:    "40px",
    border:          "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.25)",
    fontSize:        "13px",
    outline:         "none",
    boxSizing:       "border-box",
    color:           "#132a26",
    transition:      "all 0.2s ease",
  },
  validationBox: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 "6px",
    padding:             "8px 12px 12px 12px",
    marginBottom:        "8px",
  },
  valItem: {
    fontSize:   "13px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  eyeContainer: {
    position:  "absolute",
    right:     "18px",
    top:       "50%",
    transform: "translateY(-50%)",
    cursor:    "pointer",
    opacity:   0.7,
    display:   "flex",
  },
  signupBtn: {
    width:        "100%",
    padding:      "14px",
    borderRadius: "40px",
    border:       "none",
    color:        "#fff",
    fontSize:     "15px",
    fontWeight:   "700",
    marginTop:    "12px",
    cursor:       "pointer",
    transition:   "all 0.2s ease",
  },
  footerLink: { textAlign: "center", marginTop: "20px" },
  link: {
    color:          "#132a26",
    textDecoration: "none",
    fontWeight:     "700",
    fontSize:       "13px",
    opacity:        0.9,
  },
};