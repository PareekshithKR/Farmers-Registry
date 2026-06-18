import { useState } from "react";
import FarmerForm from "./components/FarmerForm";
import FarmerMap from "./components/FarmerMap";

function App() {

  const [mapRefreshKey, setMapRefreshKey] = useState(0);

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [selectedPolygon, setSelectedPolygon] =
  useState(null);

const [calculatedArea, setCalculatedArea] =
  useState(0);  

  const [polygonPoints, setPolygonPoints] =
  useState([]);

  const [radius, setRadius] = useState(5);  

  return (
    <div>
      <h1>Farmer Land Registry</h1>

      <FarmerForm
  polygonPoints={polygonPoints}
  setPolygonPoints={setPolygonPoints}
  selectedLocation={selectedLocation}
  selectedPolygon={selectedPolygon}
  calculatedArea={calculatedArea}
  onRegistered={() =>
    setMapRefreshKey((key) => key + 1)
  }
/>

      <div>
  <label>Search Radius (km): </label>

  <input
    type="number"
    value={radius}
    onChange={(e) =>
      setRadius(Number(e.target.value))
    }
  />
</div>



<FarmerMap
  refreshKey={mapRefreshKey}
  selectedLocation={selectedLocation}
  setSelectedLocation={setSelectedLocation}
  radius={radius}
  selectedPolygon={selectedPolygon}
  setSelectedPolygon={setSelectedPolygon}
  calculatedArea={calculatedArea}
  setCalculatedArea={setCalculatedArea}
  polygonPoints={polygonPoints}
  setPolygonPoints={setPolygonPoints}
/>
    </div>
  );
}

export default App;