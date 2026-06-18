import { useState } from "react";
import axios from "axios";

function FarmerForm({
  onRegistered,
  selectedLocation,
  selectedPolygon,
  calculatedArea,
  setPolygonPoints,
  setBoundaryConfirmed
}) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cropType, setCropType] = useState("");

  const registerFarmer = async () => {

    try {

      if (!selectedLocation) {
        alert("Please select a location");
        return;
      }

      if (!selectedPolygon) {
        alert("Please finish drawing boundary");
        return;
      }

      const farmer = {
        name,
        phone,
        cropType,
        plotSize: calculatedArea,

        landBoundary: {
          type: "Polygon",
          coordinates: [selectedPolygon]
        }
      };

      const response = await axios.post(
        "http://localhost:3000/farmers",
        farmer
      );

      console.log(response.data);

      onRegistered?.();

      setPolygonPoints([]);
      setBoundaryConfirmed(false);

      setName("");
      setPhone("");
      setCropType("");

      alert("Farmer Registered Successfully");

    } catch (error) {

      console.error(error);

      if (error.response) {
        alert(
          JSON.stringify(error.response.data)
        );
      } else {
        alert(error.message);
      }

    }
  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <button
          className="close-btn"
          onClick={() =>
            setBoundaryConfirmed(false)
          }
        >
          ✕
        </button>

        <h2>
          Register Farmer
        </h2>

        <input
          className="input"
          placeholder="Farmer Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Crop Type"
          value={cropType}
          onChange={(e) =>
            setCropType(e.target.value)
          }
        />

        <div className="location-box">
          📍
          {" "}
          {selectedLocation?.lat.toFixed(5)}
          ,
          {" "}
          {selectedLocation?.lng.toFixed(5)}
        </div>

        <div className="area-box">
          🌾 Area:
          {" "}
          {calculatedArea.toFixed(2)}
          {" "}
          acres
        </div>

        <button
          className="register-btn"
          onClick={registerFarmer}
        >
          Register Farmer
        </button>

      </div>

    </div>
  );
}

export default FarmerForm;