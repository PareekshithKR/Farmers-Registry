import { useState } from "react";
import axios from "axios";

function FarmerForm({
  onRegistered,
  selectedLocation,
  selectedPolygon,
  calculatedArea,
  polygonPoints,
  setPolygonPoints
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cropType, setCropType] = useState("");
  const [plotSize, setPlotSize] = useState("");

  const registerFarmer = async () => {
  try {
    if (!selectedLocation) {
      alert("Please click a location on the map first");
      return;
    }

    const farmer = {
      name,
      phone,
      cropType,
      plotSize: Number(plotSize),
      plotSize: calculatedArea,

landBoundary: {
  type: "Polygon",
  coordinates: [
    selectedPolygon
  ]
}
    };

    console.log("Sending farmer:", farmer);

    const response = await axios.post(
      "http://localhost:3000/farmers",
      farmer
    );

    console.log("Success:", response.data);

    onRegistered?.();

    alert("Farmer Registered");
    setPolygonPoints?.([]);
  } catch (error) {
    console.error("POST ERROR:", error);

    if (error.response) {
      console.log(error.response.data);
      alert(
        `Server Error: ${JSON.stringify(error.response.data)}`
      );
    } else {
      alert(error.message);
    }
  }
};

  return (
    <div>
      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Crop"
        onChange={(e) => setCropType(e.target.value)}
      />

      {selectedLocation && (
  <p>
    Selected:
    {" "}
    {selectedLocation.lat.toFixed(5)},
    {" "}
    {selectedLocation.lng.toFixed(5)}
  </p>
)}

      <button onClick={registerFarmer}>
        Register
      </button>
    </div>
  );
}

export default FarmerForm;
