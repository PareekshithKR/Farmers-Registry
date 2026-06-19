import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function FitFarmBounds({ boundary }) {
  const map = useMap();

  useEffect(() => {
    if (!boundary || boundary.length === 0) return;

    const bounds = boundary.map(coordinate => [
      coordinate[1],
      coordinate[0]
    ]);

    map.fitBounds(bounds, {
      padding: [40, 40]
    });
  }, [boundary, map]);

  return null;
}

function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    loadPending();
  }, []);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const loadPending = async () => {
    try {
      const response = await axios.get("https://farmers-registry.onrender.com/admin/pending-farms", getHeaders());
      setFarmers(response.data);
      setShowAll(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const loadAll = async () => {
    try {
      const response = await axios.get("https://farmers-registry.onrender.com/admin/farms", getHeaders());
      setFarmers(response.data);
      setShowAll(true);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshList = () => {
    if (showAll) {
      loadAll();
    } else {
      loadPending();
    }
    // Deselect if active item was modified or removed
    setSelectedFarm(null);
  };

  const approve = async (id) => {
    try {
      await axios.put(`https://farmers-registry.onrender.com/farmers/${id}/approve`, {}, getHeaders());
      refreshList();
    } catch (error) {
      console.error(error);
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`https://farmers-registry.onrender.com/farmers/${id}/reject`, {}, getHeaders());
      refreshList();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFarm = async (id) => {
    const confirmed = window.confirm("Delete this farm permanently?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://farmers-registry.onrender.com/farmers/${id}`, getHeaders());
      refreshList();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header Controls Banner */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem" }}>
            {showAll ? "All Registered Farms" : "Pending Farm Requests"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            Review, approve, audit, or inspect regional GIS farm submissions.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            style={{ backgroundColor: !showAll ? "#14532d" : "#16a34a" }} 
            onClick={loadPending}
          >
            Pending Queue
          </button>
          <button 
            style={{ backgroundColor: showAll ? "#14532d" : "#16a34a" }} 
            onClick={loadAll}
          >
            View All
          </button>
          <button 
            className="secondary-btn" 
            style={{ border: "1px solid #cbd5e1" }}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Main Multi-Column Split Panel View */}
      <div className="dashboard" style={{ gridTemplateColumns: selectedFarm ? "1fr 1fr" : "1fr" }}>
        
        {/* Left Side: Cards Feed Listing Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {farmers.length === 0 && (
            <div className="sidebar" style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#64748b", fontWeight: "500" }}>
                No farm records matched your active filter queue.
              </p>
            </div>
          )}

          {farmers.map((farmer) => {
            const isActive = selectedFarm?._id === farmer._id;
            
            // Generate visual status color codes
            const statusColors = 
              farmer.status === "approved" ? { bg: "#dcfce7", text: "#14532d" } :
              farmer.status === "pending" ? { bg: "#fef3c7", text: "#92400e" } :
              { bg: "#fee2e2", text: "#991b1b" };

            return (
              <div 
                key={farmer._id} 
                className="admin-card"
                style={{ 
                  borderColor: isActive ? "#16a34a" : "#e6ede8",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 4px 20px rgba(22, 163, 74, 0.1)" : "0 4px 12px rgba(0,0,0,.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h3 style={{ color: "#14532d" }}>{farmer.name}</h3>
                  <span style={{ 
                    fontSize: "12px", 
                    fontWeight: "700", 
                    padding: "4px 10px", 
                    borderRadius: "20px",
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    textTransform: "uppercase"
                  }}>
                    {farmer.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "14px", color: "#475569", marginBottom: "15px" }}>
                  <div>📞 <b>Phone:</b> {farmer.phone}</div>
                  <div>🌾 <b>Crop:</b> {farmer.cropType}</div>
                  <div style={{ gridColumn: "span 2" }}>📐 <b>Plot Area:</b> {farmer.plotSize?.toFixed(2)} acres</div>
                </div>

                <div className="admin-actions" style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  <button 
                    style={{ backgroundColor: isActive ? "#14532d" : "#64748b", padding: "8px 14px", fontSize: "13px" }}
                    onClick={() => setSelectedFarm(isActive ? null : farmer)}
                  >
                    {isActive ? "🗺️ Close Map" : "🗺️ View Map"}
                  </button>

                  {farmer.status !== "approved" && (
                    <button 
                      className="approve-btn" 
                      style={{ padding: "8px 14px", fontSize: "13px" }}
                      onClick={() => approve(farmer._id)}
                    >
                      ✓ Approve
                    </button>
                  )}

                  {farmer.status !== "rejected" && (
                    <button 
                      className="reject-btn" 
                      style={{ padding: "8px 14px", fontSize: "13px" }}
                      onClick={() => reject(farmer._id)}
                    >
                      ✗ Reject
                    </button>
                  )}

                  <button 
                    style={{ backgroundColor: "#ef4444", padding: "8px 14px", fontSize: "13px", marginLeft: "auto" }}
                    onClick={() => deleteFarm(farmer._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Map Framework Frame Canvas */}
        {selectedFarm && (
          <div style={{ position: "sticky", top: "20px", height: "calc(100vh - 160px)", minHeight: "450px" }}>
            <div style={{ 
              background: "white", 
              padding: "12px", 
              borderRadius: "15px", 
              boxShadow: "0 4px 20px rgba(22, 101, 52, 0.05)",
              border: "1px solid #e6ede8",
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: "700", color: "#14532d" }}>
                  Interactive Land Plot: {selectedFarm.name}
                </span>
                <button 
                  style={{ background: "none", color: "#64748b", padding: 0, fontSize: "18px" }}
                  onClick={() => setSelectedFarm(null)}
                >
                  ✕
                </button>
              </div>

              <MapContainer
                center={[10.5276, 76.2711]}
                zoom={13}
                style={{
                  flexGrow: 1,
                  width: "100%",
                  borderRadius: "10px"
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {selectedFarm.landBoundary?.coordinates?.[0] && (
                  <>
                    <FitFarmBounds boundary={selectedFarm.landBoundary.coordinates[0]} />
                    <Polygon
                      positions={selectedFarm.landBoundary.coordinates[0].map(coord => [
                        coord[1],
                        coord[0]
                      ])}
                      pathOptions={{
                        color: selectedFarm.status === "approved" ? "green" : selectedFarm.status === "pending" ? "orange" : "red",
                        fillOpacity: 0.35
                      }}
                    />
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;