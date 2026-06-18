require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Farmer = require("./models/Farmer");


const app = express();

const path = require("path");

app.use(express.static("public"));

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    console.log("MongoDB Atlas Connected");
  })
  .catch((err) => {
    console.log(err);
  });
  
app.get("/", (req, res) => {
  res.send("Farmer Registry API Running");
});  

app.get("/farmers", async (req, res) => {
  try {
    const farmers = await Farmer.find({});
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/farmers/nearby", async (req, res) => {
  try {
    const { lat, lng, km = 5 } = req.query;

    const farmers = await Farmer.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [+lng, +lat]
          },
          $maxDistance: Number(km) * 1000
        }
      }
    });

    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/farmers/:id", async (req, res) => {
  try {

    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(farmer);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

app.post("/farmers", async (req, res) => {
  try {
    const farmer = new Farmer(req.body);

    await farmer.save();

    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});