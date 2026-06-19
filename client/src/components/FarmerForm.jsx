import { useState } from "react";
import axios from "axios";

function FarmerForm({
  onRegistered,
  selectedLocation,
  selectedPolygon,
  calculatedArea,
  polygonPoints,
  setPolygonPoints,
  setBoundaryConfirmed
}) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cropType, setCropType] = useState("");
  const [email, setEmail] = useState("");

const [username, setUsername] = useState("");

const [password, setPassword] = useState("");

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

      const centerLat =
  polygonPoints.reduce(
    (sum, point) =>
      sum + point.lat,
    0
  ) / polygonPoints.length;

const centerLng =
  polygonPoints.reduce(
    (sum, point) =>
      sum + point.lng,
    0
  ) / polygonPoints.length;

      const farmer = {
  name,
  email,
  username,
  password,
  phone,
  cropType,
  plotSize: calculatedArea,

  location: {
  type: "Point",
  coordinates: [
    centerLng,
    centerLat
  ]
},

  landBoundary: {
    type: "Polygon",
    coordinates: [selectedPolygon]
  }
};

      const response = await axios.post(
        "https://farmers-registry.onrender.com/register-farm",
        farmer
      );

      console.log(response.data);

      onRegistered?.();

      setPolygonPoints([]);
      setBoundaryConfirmed(false);

      setName("");
      setPhone("");
      setEmail("");
setUsername("");
setPassword("");
      setCropType("");

      alert(
  "Farm submitted for admin approval"
);

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

        <div className="form-group">
  <input
    className="input"
    placeholder="Email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
  />
</div>

<div className="form-group">
  <input
    className="input"
    placeholder="Username"
    value={username}
    onChange={(e) =>
      setUsername(e.target.value)
    }
  />
</div>

<div className="form-group">
  <input
    type="password"
    className="input"
    placeholder="Password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
  />
</div>

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