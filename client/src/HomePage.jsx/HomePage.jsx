import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Mini Navigation Bar */}
      <nav style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "20px 40px",
        background: "white",
        boxShadow: "0 2px 10px rgba(22, 101, 52, 0.03)",
        borderBottom: "1px solid #e6ede8"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#14532d", fontSize: "1.1rem" }}>
          <span>🌾</span> LandRegistry
        </div>
        <div>
          <button 
            className="secondary-btn" 
            style={{ padding: "8px 20px", fontSize: "14px" }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flexGrow: 1 }}>
        <div className="hero" style={{ padding: "100px 20px 60px" }}>
          <h1 style={{ lineHeight: "1.2", maxWidth: "800px", margin: "0 auto" }}>
            Farmer Land Registry
          </h1>
          <p style={{ maxWidth: "600px", margin: "20px auto 0", lineHeight: "1.6" }}>
            An intuitive GIS-based agricultural land registration and management system. 
            Map boundaries, evaluate plot areas, and manage geospatial assets cleanly.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/registry")}
              style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", padding: "14px 32px" }}
            >
              Explore Map Registry 🗺️
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section className="features" style={{ paddingBottom: "80px" }}>
          <div className="feature-card">
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📍</div>
            <h3>Land Mapping</h3>
            <p>
              Draw farm boundaries seamlessly with interactive point-and-click geometric tools.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📏</div>
            <h3>Area Calculation</h3>
            <p>
              Instantly calculate physical plot surfaces in precise acreage using automated geospatial analytics.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🛡️</div>
            <h3>Approval Workflow</h3>
            <p>
              Maintain verified record integrity. Submitted farm boundaries publish following admin confirmation.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🛰️</div>
            <h3>Geospatial Queries</h3>
            <p>
              Execute radius-based distance searches to analyze and audit neighboring agricultural spaces.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: "center", 
        padding: "24px", 
        background: "white", 
        color: "#64748b", 
        fontSize: "14px",
        borderTop: "1px solid #e6ede8"
      }}>
        © {new Date().getFullYear()} Farmer Land Registry System. Powered by React-Leaflet & Turf.js
      </footer>
    </div>
  );
}

export default HomePage;