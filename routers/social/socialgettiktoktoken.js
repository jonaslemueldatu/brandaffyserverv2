const dotEnv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const querystring = require("querystring");
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");
const creatorProfile = require("../../models/creatorProfile");

router.post("/", async (req, res) => {
  try {
    const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
    const params = {
      client_key: process.env.TTK_CLIENT_ID,
      client_secret: process.env.TTK_CLIENT_SECRET,
      code: req.body.code,
      grant_type: "authorization_code",
      redirect_uri: "https://www.brandaffy.com/dashboard/profile/",
    };
    const result = await axios.post(
      tokenEndpoint,
      querystring.stringify(params),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      }
    );
    if (result.data.access_token) {
      const newSocialTiktokCredentials = new socialTiktokCredentials({
        user_id: req.body.user_id,
        open_id: result.data.open_id,
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      });

      await newSocialTiktokCredentials.save();
      const ObjectId = new mongoose.Types.ObjectId(req.body.user_id);
      const profile = await creatorProfile.findOne({ _id: ObjectId });
      if (profile) {
        profile.social_tiktok = true;
        await profile.save();
      }
    }
    res.status(200);
    res.json({
      msg: "Successfully connected Tiktok account",
    });
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
