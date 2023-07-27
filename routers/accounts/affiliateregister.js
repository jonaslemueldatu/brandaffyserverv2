const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../../models/affiliateProfile");
const affiliateSubscription = require("../../models/affiliateSubscription");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const data = await affiliateProfile.findOne({ email: req.body.email });
  if (data) {
    res.status(200);
    res.json({
      err: "Email already exists!",
    });
  } else {
    const newaffiliateProfile = new affiliateProfile({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    await newaffiliateProfile.save();

    const profile = await affiliateProfile.findOne({
      email: req.body.email,
    });

    const newaffiliateSubscription = new affiliateSubscription({
      email: req.body.email,
      profile_id: profile._id.toString(),
    });

    await newaffiliateSubscription.save();

    const affiliateData = await affiliateProfile.findOne(
      { email: req.body.email },
      "_id"
    );
    if (affiliateData) {
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
          id: affiliateData.id,
          email: affiliateData.email,
          user_type: "Affiliate",
        },
      });
    }
  }
});

module.exports = router;
