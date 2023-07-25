const express = require("express");
const router = express.Router();
const axios = require("axios");
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");
const affiliateProfile = require("../../models/affiliateProfile");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const authToken = await socialTiktokCredentials.findOne({
      user_id: req.body.viewed_profile_id,
    });
    if (!authToken) {
      return;
    }
    let tokenEndpoint = "https://open.tiktokapis.com/v2/user/info/";
    tokenEndpoint +=
      "?fields=avatar_url_100,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count";
    const result = await axios.get(tokenEndpoint, {
      headers: {
        Authorization: `Bearer ${authToken.access_token}`,
      },
    });
    if (result) {
      const ObjectId = new mongoose.Types.ObjectId(req.body.viewed_profile_id);
      const data = await affiliateProfile.findOne({
        _id: ObjectId,
      });

      data.avatar_url_100 = result.data.data.user.avatar_url_100;
      data.display_name = result.data.data.user.display_name;
      data.bio_description = result.data.data.user.bio_description;
      data.profile_deep_link = result.data.data.user.profile_deep_link;
      data.is_verified = result.data.data.user.is_verified;
      data.follower_count = result.data.data.user.follower_count;
      data.following_count = result.data.data.user.following_count;
      data.likes_count = result.data.data.user.likes_count;
      data.video_count = result.data.data.user.video_count;

      await data.save();

      res.status(200);
      res.json({
        msg: "Successfully pulled Tiktok profile",
        tiktok_profile: result.data.data.user,
      });
    }
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});
module.exports = router;
