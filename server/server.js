require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Farmer = require("./models/Farmer");
const User = require("./models/Userr");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {

    console.log(
      "MongoDB Atlas Connected"
    );

    await Farmer.syncIndexes();

    console.log(
      "Indexes Synced"
    );

  })
  .catch((err) => {
    console.log(err);
  });
  

app.get("/", (req, res) => {
  res.send("Farmer Registry API Running");
});

const authMiddleware = (
  req,
  res,
  next
) => {

  const token =
    req.headers.authorization?.split(
      " "
    )[1];

  if (!token) {

    return res.status(401).json({
      message:
        "Access denied"
    });

  }

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch {

    return res.status(401).json({
      message:
        "Invalid token"
    });

  }

};

const adminMiddleware = (
  req,
  res,
  next
) => {

  if (
    req.user.role !== "admin"
  ) {

    return res.status(403).json({
      message:
        "Admins only"
    });

  }

  next();

};

/*
==================================
GET ALL FARMERS
==================================
*/

app.get("/farmers", async (req, res) => {
  try {

    const farmers =
  await Farmer.find({
    status: "approved"
  });

    res.json(farmers);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

/*
==================================
CREATE FARMER
(Current system)
==================================
*/

app.get(
  "/farmers/nearby",
  async (req, res) => {

    try {

      const {
        lat,
        lng,
        km = 5
      } = req.query;

      const farmers =
        await Farmer.find({

          status: "approved",

          location: {

            $nearSphere: {

              $geometry: {
                type: "Point",
                coordinates: [
                  Number(lng),
                  Number(lat)
                ]
              },

              $maxDistance:
                Number(km) * 1000

            }

          }

        });

      res.json(farmers);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message
      });

    }

  }
);

app.post("/farmers", async (req, res) => {
  try {

    const farmer =
      new Farmer(req.body);

    await farmer.save();

    res.status(201).json(farmer);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
});



/*
==================================
REGISTER FARM + ACCOUNT
(New system)
==================================
*/

app.post(
  "/register-farm",
  async (req, res) => {

    try {

      const {
  name,
  email,
  username,
  password,
  phone,
  cropType,
  plotSize,
  location,
  landBoundary
} = req.body;

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message:
              "Email already exists"
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      console.log("Creating user...");

const user =
  await User.create({

    name,
    email,
    username,
    password: hashedPassword,
    role: "farmer",
    approved: false

  });

console.log("User created:", user);

      const farmer =
        await Farmer.create({

          name,

          phone,

          cropType,

          plotSize,

          owner:
            user._id,

          status:
            "pending",
           
          location,  

          landBoundary

        });

        console.log("Farmer created:", farmer);

      res.status(201).json({

        message:
          "Farm submitted for approval",

        farmer

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  }
);

/*
==================================
UPDATE FARMER
==================================
*/


app.get(
  "/admin/farms",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const farms =
      await Farmer.find({});

    res.json(farms);

  }
);

app.put(
  "/farmers/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const farmer =
        await Farmer.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true
          }
        );

      res.json(farmer);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  }
);

/*
==================================
DELETE FARMER
==================================
*/

app.delete(
  "/farmers/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      await Farmer.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Farmer deleted"
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  }
);

/*
==================================
ADMIN APPROVE FARM
==================================
*/

app.put(
  "/farmers/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const farmer =
        await Farmer.findByIdAndUpdate(
          req.params.id,
          {
            status:
              "approved"
          },
          {
            new: true
          }
        );

      if (
        farmer?.owner
      ) {

        await User.findByIdAndUpdate(
          farmer.owner,
          {
            approved:
              true
          }
        );
      }

      res.json(farmer);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  }
);

/*
==================================
ADMIN REJECT FARM
==================================
*/

app.put(
  "/farmers/:id/reject",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const farmer =
        await Farmer.findByIdAndUpdate(
          req.params.id,
          {
            status:
              "rejected"
          },
          {
            new: true
          }
        );

      res.json(farmer);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
  }
);

app.get(
  "/admin/pending-farms",
  authMiddleware,
  adminMiddleware, async (req, res) => {

  try {

    const farmers =
  await Farmer.find({
    status: "pending"
  }).populate(
    "owner",
    "name email username"
  );

    res.json(farmers);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (
      user.role === "farmer" &&
      !user.approved
    ) {
      return res.status(403).json({
        message:
          "Waiting for admin approval"
      });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.json({
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

app.post("/create-admin", async (req, res) => {

  try {

    const existingAdmin =
      await User.findOne({
        email:
          "admin@registry.com"
      });

    if (existingAdmin) {

      return res.json({
        message:
          "Admin already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        "admin123",
        10
      );

    const admin =
      await User.create({

        name: "Admin",

        username: "admin",

        email:
          "admin@registry.com",

        password:
          hashedPassword,

        role: "admin",

        approved: true

      });

    res.json(admin);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

app.listen(
  process.env.PORT || 3000,
  () => {
    console.log(
      "Server running on port 3000"
    );
  }
);