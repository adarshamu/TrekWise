import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          "https://api.pexels.com/videos/search?query=mountain+hiking+trek+nature&per_page=5&orientation=landscape",
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

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
      setLoading(false);
    }
  };

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
          <img src="/trek.jpg" alt="Login illustration" style={styles.illustration} />
        </div>

        <div style={styles.rightPanel} className="auth-right-panel">
          <h2 style={styles.heading}>Log in</h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login(e)}
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
                onKeyDown={(e) => e.key === "Enter" && login(e)}
              />
              <div style={styles.eyeContainer} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#132a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#132a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            style={{
              ...styles.loginBtn,
              backgroundColor: loading ? "#4a5568" : (isHovered ? "#1b3d37" : "#132a26"),
              transform: isHovered && !loading ? "translateY(-1px)" : "translateY(0)",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={login}
          >
            {loading ? "Authenticating…" : "Log in"}
          </button>

          <div style={styles.forgotPass}>
            <Link to="/signup" style={styles.link}>
              Don't have an account?{" "}
              <span style={{ textDecoration: "underline" }}>Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    margin: 0,
    overflow: "hidden",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    background: "transparent",
  },
  bgVideo: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "cover",
    zIndex: -2,
    animation: "subtleZoom 20s ease-in-out infinite alternate",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 100%)",
    zIndex: -1,
  },
  card: {
    display: "flex",
    width: "min(750px, 85%)",
    height: "min(450px, 70vh)",
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.4)",
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  illustration: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  rightPanel: {
    flex: 1,
    padding: "40px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflowY: "auto",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#132a26",
    textAlign: "center",
    marginBottom: "30px",
    letterSpacing: "-0.5px",
  },
  inputGroup: { marginBottom: "18px" },
  label: {
    fontSize: "12px",
    color: "#132a26",
    marginBottom: "6px",
    display: "block",
    marginLeft: "14px",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    padding: "12px 20px",
    borderRadius: "40px",
    border: "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.25)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#132a26",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  eyeContainer: {
    position: "absolute",
    right: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    opacity: 0.7,
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "40px",
    border: "none",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "12px",
  },
  forgotPass: { textAlign: "center", marginTop: "24px" },
  link: {
    color: "#132a26",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    opacity: 0.9,
  },
};