const express = require("express");
const router = express.Router();
const brandProfile = require("../../models/brandProfile");
const mongoose = require("mongoose");
const brandSubscription = require("../../models/brandSubscription");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const data = await brandProfile.findOne({ email: req.body.email });
  if (data) {
    res.status(200);
    res.json({
      err: "Email already exists!",
    });
  } else {
    const newbrandProfile = new brandProfile({
      brand_name: req.body.brand_name,
      email: req.body.email,
      password: req.body.password,
    });
    await newbrandProfile.save();

    const profile = await brandProfile.findOne({
      email: req.body.email,
    });

    const newbrandSubscription = new brandSubscription({
      email: req.body.email,
      profile_id: profile._id.toString(),
    });

    await newbrandSubscription.save();

    const brandData = await brandProfile.findOne(
      { email: req.body.email },
      "_id"
    );
    if (brandData) {
      const token = await jwt.sign(
        { email: req.body.email },
        process.env.JSON_WEB_TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200);
      res.json({
        msg: "Registration successful!",
        token: token,
        user_profile: {
          id: brandData.id,
          email: brandData.email,
          user_type: "Brand",
        },
      });
    }
  }
});

module.exports = router;
