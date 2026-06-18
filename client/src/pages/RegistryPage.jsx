import { useState } from "react";
import FarmerForm from "../components/FarmerForm";
import FarmerMap from "../components/FarmerMap";

function App() {
  const [mapRefreshKey, setMapRefreshKey] = useState(0);

  const [boundaryConfirmed, setBoundaryConfirmed] =
    useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [selectedPolygon, setSelectedPolygon] =
    useState(null);

  const [calculatedArea, setCalculatedArea] =
    useState(0);

  const [polygonPoints, setPolygonPoints] =
    useState([]);

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

      <header className="header">
        <h1>🌾 Farmer Land Registry</h1>
        <p>GIS-Based Land Management System</p>
      </header>

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

      {boundaryConfirmed && (
        <FarmerForm
          selectedLocation={selectedLocation}
          selectedPolygon={selectedPolygon}
          calculatedArea={calculatedArea}
          setPolygonPoints={setPolygonPoints}
          setBoundaryConfirmed={setBoundaryConfirmed}
          onRegistered={handleRegistered}
        />
      )}

    </div>
  );
}

export default App;