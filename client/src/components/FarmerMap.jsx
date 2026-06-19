import { useEffect, useState } from "react";
import axios from "axios";
import * as turf from "@turf/turf";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
  Tooltip,
  useMap,
  useMapEvents
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationSelector({
  setSelectedLocation,
  setPolygonPoints,
  boundaryConfirmed
}) {
  useMapEvents({
    click(event) {
      if (boundaryConfirmed) {
        return;
      }

      const point = {
        lat: event.latlng.lat,
        lng: event.latlng.lng
      };

      setSelectedLocation(point);
      setPolygonPoints((previousPoints) => [
        ...previousPoints,
        point
      ]);
    }
  });

  return null;
}

function FitBounds({ farmers, requestKey }) {
  const map = useMap();

  useEffect(() => {
    if (requestKey === 0) {
      return;
    }

    const points = [];

    farmers.forEach((farmer) => {
      const location = farmer.location?.coordinates;

      if (
        location?.length >= 2 &&
        Number.isFinite(location[0]) &&
        Number.isFinite(location[1])
      ) {
        points.push([location[1], location[0]]);
      }

      const boundary = farmer.landBoundary?.coordinates?.[0];

      boundary?.forEach((coordinate) => {
        if (
          coordinate?.length >= 2 &&
          Number.isFinite(coordinate[0]) &&
          Number.isFinite(coordinate[1])
        ) {
          points.push([coordinate[1], coordinate[0]]);
        }
      });
    });

    if (points.length === 1) {
      map.setView(points[0], 14);
    } else if (points.length > 1) {
      map.fitBounds(points, {
        padding: [60, 60],
        maxZoom: 15
      });
    }
  }, [farmers, map, requestKey]);

  return null;
}

function FarmerMap({
  refreshKey,
  selectedLocation,
  setSelectedLocation,
  radius,
  setRadius,
  setSelectedPolygon,
  calculatedArea,
  setCalculatedArea,
  polygonPoints,
  setPolygonPoints,
  boundaryConfirmed,
  setBoundaryConfirmed
}) {
  const [farmers, setFarmers] = useState([]);
  const [fitBoundsRequest, setFitBoundsRequest] = useState(0);
  const [editingFarmer, setEditingFarmer] =
  useState(null);

  useEffect(() => {
    let ignoreResponse = false;

    const loadFarmers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/farmers"
        );

        if (!ignoreResponse) {
          setFarmers(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadFarmers();

    return () => {
      ignoreResponse = true;
    };
  }, [refreshKey]);

  const fetchFarmers = async (fitResults = false) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/farmers"
      );

      setFarmers(response.data);

      if (fitResults) {
        setFitBoundsRequest((request) => request + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchNearby = async () => {
    if (!selectedLocation) {
      alert("Select a location first");
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
      setFitBoundsRequest((request) => request + 1);
    } catch (error) {
      console.error(error);
      alert("Nearby search failed");
    }
  };

  const deleteFarmer = async (id) => {

  const confirmed =
    window.confirm(
      "Delete this farmer?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await axios.delete(
  `http://localhost:3000/farmers/${id}`,
  {
    headers: {
      Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
  }
);

    fetchFarmers(true);

  } catch (error) {

    console.error(error);

    alert(
      "Delete failed"
    );

  }

};

const startEditing = (
  farmer
) => {

  setEditingFarmer(
    farmer
  );

};

  const finishBoundary = () => {
    if (polygonPoints.length < 3) {
      alert("Select at least 3 points");
      return;
    }

    const coordinates = polygonPoints.map((point) => [
      point.lng,
      point.lat
    ]);

    coordinates.push(coordinates[0]);

    const polygon = turf.polygon([coordinates]);
    const areaSqMeters = turf.area(polygon);
    const areaAcres = areaSqMeters * 0.000247105;

    setCalculatedArea(areaAcres);
    setSelectedPolygon(coordinates);
    setBoundaryConfirmed(true);
  };

  const resetBoundary = () => {
    setPolygonPoints([]);
    setSelectedLocation(null);
    setSelectedPolygon(null);
    setCalculatedArea(0);
    setBoundaryConfirmed(false);
  };

  return (
    <>
      <div className="map-toolbar">

        <div className="radius-control">
  <label>Radius (km)</label>

  <input
    type="number"
    min="1"
    value={radius}
    onChange={(e) =>
      setRadius(Number(e.target.value))
    }
  />
</div>

        <button onClick={searchNearby}>
          Find Nearby Farmers
        </button>

        <button onClick={() => fetchFarmers(true)}>
          Show All Farmers
        </button>

        {calculatedArea > 0 && (
          <div className="toolbar-area">
            Area: {calculatedArea.toFixed(2)} acres
          </div>
        )}
      </div>

      <MapContainer
        center={[10.5276, 76.2711]}
        zoom={10}
        style={{
          height: "calc(100vh - 180px)",
          borderRadius: "12px"
        }}
      >
        <FitBounds
          farmers={farmers}
          requestKey={fitBoundsRequest}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSelector
          setSelectedLocation={setSelectedLocation}
          setPolygonPoints={setPolygonPoints}
          boundaryConfirmed={boundaryConfirmed}
        />

        {farmers.map((farmer) => {
          const boundary = farmer.landBoundary?.coordinates?.[0];

          if (boundary && boundary.length >= 3) {

  const positions = boundary.map((coordinate) => [
    coordinate[1],
    coordinate[0]
  ]);

  const centerLat =
    positions.reduce(
      (sum, p) => sum + p[0],
      0
    ) / positions.length;

  const centerLng =
    positions.reduce(
      (sum, p) => sum + p[1],
      0
    ) / positions.length;

  return (
    <>
      <Polygon
        key={`poly-${farmer._id}`}
        positions={positions}
        pathOptions={{
          color: "#16a34a",
          fillColor: "#22c55e",
          fillOpacity: 0.3
        }}
      />

      <Marker
        key={`marker-${farmer._id}`}
        position={[
          centerLat,
          centerLng
        ]}
      >
        <Popup>

          <b>{farmer.name}</b>

          <br />

          Crop:
          {" "}
          {farmer.cropType}

          <br />

          Area:
          {" "}
          {farmer.plotSize?.toFixed(2)}
          {" "}
          acres

          <br />
          <br />

          {localStorage.getItem("role") === "admin" && (
  <>
    
  </>
)}

        </Popup>
      </Marker>
    </>
  );
}

          const coordinates = farmer.location?.coordinates;

          if (coordinates && coordinates.length >= 2) {
            const [lng, lat] = coordinates;

            return (
              <Marker
                key={farmer._id}
                position={[lat, lng]}
              >
                <Popup>

  <b>{farmer.name}</b>

  <br />

  Crop:
  {" "}
  {farmer.cropType}

  <br />

  Area:
  {" "}
  {farmer.plotSize?.toFixed(2)}
  {" "}
  acres

  <br />
  <br />

  {localStorage.getItem("role") === "admin" && (
  <>
    
  </>
)}

</Popup>
              </Marker>
            );
          }

          return null;
        })}

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
          <>
            <Polygon
              positions={polygonPoints.map((point) => [
                point.lat,
                point.lng
              ])}
              pathOptions={{
                color: "#2563eb",
                fillOpacity: 0.2
              }}
            />

            {!boundaryConfirmed && (
              <Marker
                position={[
                  polygonPoints[polygonPoints.length - 1].lat,
                  polygonPoints[polygonPoints.length - 1].lng
                ]}
              >
                <Tooltip
                  permanent
                  interactive
                  direction="right"
                  offset={[14, 0]}
                  opacity={1}
                  className="boundary-actions-tooltip"
                >
                  <div className="boundary-actions">
                    <button
                      type="button"
                      className="boundary-action confirm"
                      aria-label="Finish boundary"
                      title="Finish boundary"
                      onClick={(event) => {
                        event.stopPropagation();
                        finishBoundary();
                      }}
                    >
                      ✓
                    </button>

                    <button
                      type="button"
                      className="boundary-action reset"
                      aria-label="Reset boundary"
                      title="Reset boundary"
                      onClick={(event) => {
                        event.stopPropagation();
                        resetBoundary();
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </Tooltip>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </>
  );
}

export default FarmerMap;
