import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "admin") {
        window.location = "/admin";
      } else {
        window.location = "/registry";
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: "100%", maxWidth: "420px" }}>
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Welcome Back</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Sign in to access your agricultural dashboard
          </p>
        </header>

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "6px", color: "#14532d", fontSize: "14px" }}>
            Email Address
          </label>
          <input
            className="input"
            type="email"
            placeholder="name@farm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "6px", color: "#14532d", fontSize: "14px" }}>
            Password
          </label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          className="register-btn" 
          onClick={login}
          disabled={isLoading}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
        
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <a href="/" style={{ color: "#16a34a", fontSize: "14px", textDecoration: "none", fontWeight: "500" }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;