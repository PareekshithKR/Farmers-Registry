import { useEffect, useState } from "react";
import axios from "axios";
import * as turf from "@turf/turf";


import {
  Polygon
} from "react-leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  FeatureGroup,
  useMapEvents
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationSelector({
  setSelectedLocation,
  polygonPoints,
  setPolygonPoints
}) {
  useMapEvents({
    click(e) {

      const point = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      setSelectedLocation(point);

      setPolygonPoints(prev => [
        ...prev,
        point
      ]);
    }
  });

  return null;
}

function getCropColor(crop) {

  switch (
    crop?.toLowerCase()
  ) {

    case "paddy":
      return "green";

    case "coconut":
      return "brown";

    case "banana":
      return "yellow";

    default:
      return "blue";
  }
}

function FarmerMap({
  refreshKey,
  selectedLocation,
  setSelectedLocation,
  radius,
  selectedPolygon,
  setSelectedPolygon,
  calculatedArea,
  setCalculatedArea,
  polygonPoints,
  setPolygonPoints
}) {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchFarmers();
  }, [refreshKey]);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/farmers"
      );

      setFarmers(response.data);
    } catch (error) {
      console.error(
        "Error fetching farmers:",
        error
      );
    }
  };

  const searchNearby = async () => {
    if (!selectedLocation) {
      alert("Select a location on the map first");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/farmers/nearby",
        {
          params: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            km: radius
          }
        }
      );

      setFarmers(response.data);
    } catch (error) {
      console.error(
        "Nearby search error:",
        error
      );

      alert("Nearby search failed");
    }
  };

  const finishBoundary = () => {

  if (polygonPoints.length < 3) {
    alert("Select at least 3 points");
    return;
  }

  const coordinates =
    polygonPoints.map(point => [
      point.lng,
      point.lat
    ]);

  coordinates.push(coordinates[0]);

  const polygon =
    turf.polygon([coordinates]);

  const areaSqMeters =
    turf.area(polygon);

  const areaAcres =
    areaSqMeters * 0.000247105;

  setCalculatedArea(areaAcres);

  setSelectedPolygon(coordinates);

  alert(
    `Area: ${areaAcres.toFixed(2)} acres`
  );
};

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={searchNearby}>
          Find Nearby Farmers
        </button>

        <button
          onClick={fetchFarmers}
          style={{ marginLeft: "10px" }}
        >
          Show All Farmers
        </button>

        <button
  onClick={finishBoundary}
  style={{ marginLeft: "10px" }}
>
  Finish Boundary
</button>

<button
  onClick={() => {
    setPolygonPoints([]);
    setSelectedPolygon(null);
    setCalculatedArea(0);
  }}
  style={{
    marginLeft: "10px"
  }}
>
  Reset Boundary
</button>

{calculatedArea > 0 && (
  <div>
    Area:
    {" "}
    {calculatedArea.toFixed(2)}
    {" "}
    acres
  </div>
)}

      </div>

      <MapContainer
        center={[10.5276, 76.2711]}
        zoom={10}
        style={{
          height: "500px",
          marginTop: "20px"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSelector
  setSelectedLocation={setSelectedLocation}
  polygonPoints={polygonPoints}
  setPolygonPoints={setPolygonPoints}
/>

        {farmers.map((farmer) => {

  // NEW POLYGON FARMS

  const boundary =
    farmer.landBoundary?.coordinates?.[0];

  if (
    boundary &&
    boundary.length >= 3
  ) {

    const positions =
      boundary.map(coord => [
        coord[1],
        coord[0]
      ]);

    return (
      <Polygon
        key={farmer._id}
        positions={positions}
      >
        <Popup>
          <b>{farmer.name}</b>
          <br />
          Crop: {farmer.cropType}
          <br />
          Area:
          {" "}
          {farmer.plotSize?.toFixed(2)}
          {" "}
          acres
        </Popup>
      </Polygon>
    );
  }

  // OLD POINT FARMS

  const coordinates =
    farmer.location?.coordinates;

  if (
    coordinates &&
    coordinates.length >= 2
  ) {

    const [lng, lat] =
      coordinates;

    return (
      <Marker
        key={farmer._id}
        position={[
          lat,
          lng
        ]}
      >
        <Popup>
          <b>{farmer.name}</b>
          <br />
          Crop:
          {" "}
          {farmer.cropType}
        </Popup>
      </Marker>
    );
  }

  return null;
})}

        {selectedLocation && (
          <Marker
            position={[
              selectedLocation.lat,
              selectedLocation.lng
            ]}
          >
            <Popup>
              Selected Plot
            </Popup>
          </Marker>
        )}


{selectedLocation && (
  <Circle
    center={[
      selectedLocation.lat,
      selectedLocation.lng
    ]}
    radius={radius * 1000}
  />
)}

{polygonPoints.length >= 3 && (
  <Polygon
    positions={
      polygonPoints.map(p => [
        p.lat,
        p.lng
      ])
    }
  />
)}

      </MapContainer>
    </>
  );
}

export default FarmerMap;