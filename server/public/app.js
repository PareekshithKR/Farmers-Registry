const map = L.map("map").setView([10.5276, 76.2711], 10);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors"
  }
).addTo(map);

async function loadFarmers() {
  const response = await fetch("/farmers");
  const farmers = await response.json();

  farmers.forEach(farmer => {
    const coordinates = farmer.location && farmer.location.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return;
    }

    const [lng, lat] = coordinates;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    L.marker([lat, lng])
      .bindPopup(`
        <b>${farmer.name}</b><br>
        Crop: ${farmer.cropType}<br>
        Plot Size: ${farmer.plotSize} acres
      `)
      .addTo(map);
  });
}

document
  .getElementById("register-btn")
  .addEventListener("click", () => {

    if (!selectedLocation) {
  alert("Please click a location on the map first");
  return;
}

const farmer = {
  name,
  phone,
  cropType,
  plotSize: Number(plotSize),

  location: {
    type: "Point",
    coordinates: [
      selectedLocation.lng,
      selectedLocation.lat
    ]
  }
};

await axios.post(
  "http://localhost:3000/farmers",
  farmer
);

onRegistered?.();
alert("Farmer Registered");
  });

loadFarmers();
