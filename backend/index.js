const express = require("express");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// SCHEMA
const { user, auto } = require("./schema.config");

// MONGODB CONNECTION
mongoose
  .connect("mongodb://localhost:27017/mern")
  .then(() => app.listen(8000, () => console.log("Running on port 8000")))
  .catch((e) => console.log(e.message));

// MIDDLEWARE
const app = express();
app.use(cors());
app.use(bodyParse.json());

// GET
app.get("/api/data", (req, res) => {
  user
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// POST
app.post("/api/data/create", (req, res) => {
  const { name, age, address } = req.body;
  user
    .create({
      name: name,
      age: age,
      address: address,
    })
    .then(() => {
      res.status(200).send("Created Successfully");
    })
    .catch((err) => console.log(err));
});

// DELETE
app.delete("/api/data/:id", (req, res) => {
  user
    .findByIdAndDelete(req.params.id)
    .then(() => res.send("ok"))
    .catch((err) => console.log(err));
});

// PUT
app.put("/api/data/:name", (req, res) => {
  user
    .updateOne({ name: req.params.name }, { $set: { name: "asus" } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// === FOR AUTHENTICATION === //
// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    // const hashPass = await bcrypt.hash(req.body.password, 10);
    await auto.create({
      email: req.body.email,
      password: req.body.password,
      // password: hashPass,
    });
    res.json({ status: "okay" });
  } catch (error) {
    res.json({ status: "error", message: "duplication", error: error });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const authentication = await auto.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (authentication) {
    const token = jwt.sign(
      {
        email: req.body.email,
        password: req.body.password,
      },
      "secret1234"
    );
    res.json({ status: "ok", userStatus: token });
  } else {
    res.json({ status: "invalid", userStatus: false });
  }
});
