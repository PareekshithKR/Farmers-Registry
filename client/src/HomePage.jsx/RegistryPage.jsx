import { useState } from "react";
import FarmerForm from "../components/FarmerForm";
import FarmerMap from "../components/FarmerMap";

function App() {
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [boundaryConfirmed, setBoundaryConfirmed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [radius, setRadius] = useState(5);

  const handleRegistered = () => {
    setMapRefreshKey((key) => key + 1);
    setPolygonPoints([]);
    setSelectedLocation(null);
    setSelectedPolygon(null);
    setCalculatedArea(0);
    setBoundaryConfirmed(false);
  };

  return (
    <div className="app">
      {/* Botanical Header Area */}
      <header style={{ marginBottom: "20px" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          🌾 Farmer Land Registry
        </h1>
        <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>
          GIS-Based Agricultural Land Registration & Management System
        </p>
      </header>

      {/* Main Grid Wrapper */}
      <div className={`dashboard ${!boundaryConfirmed ? "map-only" : ""}`}>
        
        {/* Dynamic Left Sidebar: Registration Form Panel */}
        {boundaryConfirmed && (
          <div className="sidebar" style={{ animation: "fadeIn 0.3s ease" }}>
            <FarmerForm
              selectedLocation={selectedLocation}
              selectedPolygon={selectedPolygon}
              calculatedArea={calculatedArea}
              setPolygonPoints={setPolygonPoints}
              setBoundaryConfirmed={setBoundaryConfirmed}
              onRegistered={handleRegistered}
              polygonPoints={polygonPoints}
            />
          </div>
        )}

        {/* Right Content View: Map Framework Container */}
        <div className="content" style={{ padding: "12px" }}>
          <FarmerMap
            refreshKey={mapRefreshKey}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            radius={radius}
            setRadius={setRadius}
            setSelectedPolygon={setSelectedPolygon}
            calculatedArea={calculatedArea}
            setCalculatedArea={setCalculatedArea}
            polygonPoints={polygonPoints}
            setPolygonPoints={setPolygonPoints}
            boundaryConfirmed={boundaryConfirmed}
            setBoundaryConfirmed={setBoundaryConfirmed}
          />
        </div>
        
      </div>
    </div>
  );
}

export default App;