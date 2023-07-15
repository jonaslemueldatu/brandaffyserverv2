const dotEnv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../../models/affiliateProfile");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const data = await affiliateProfile.findOne({ email: req.body.email });
  if (data) {
    if (data.password == req.body.password) {
      const token = await jwt.sign(
        { email: data.email },
        process.env.JSON_WEB_TOKEN_KEY,
        { expiresIn: "1h" }
      );
      data.logged_in = true;
      await data.save();
      res.status(200),
        res.json({
          msg: "User has logged-in successfully",
          token: token,
          user_profile: {
            id: data._id,
            email: data.email,
            user_type: data.user_type,
          },
        });
    } else {
      res.status(200);
      res.json({
        err: "Incorrect password!",
      });
    }
  } else {
    res.status(200);
    res.json({
      err: "Email is not registered yet!",
    });
  }
});

module.exports = router;
