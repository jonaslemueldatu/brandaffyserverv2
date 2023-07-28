const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const axios = require("axios");

//Model Imports
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");
const creatorProfile = require("../../models/creatorProfile");

router.post("/", async (req, res) => {
  try {
    //Check if profile has a linked access token
    const authToken = await socialTiktokCredentials.findOne({
      user_id: req.body.viewed_profile_id,
    });
    if (!authToken) {
      const ObjectId = new mongoose.Types.ObjectId(req.body.viewed_profile_id);
      const profile = await creatorProfile.findOne({ _id: ObjectId });
      if (profile) {
        profile.social_tiktok = false;
        await profile.save();
      }
      return;
    }

    //Use token to get tiktok profile details
    let tokenEndpoint = "https://open.tiktokapis.com/v2/user/info/";
    tokenEndpoint +=
      "?fields=avatar_url_100,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count";
    const result = await axios.get(tokenEndpoint, {
      headers: {
        Authorization: `Bearer ${authToken.access_token}`,
      },
    });
    if (result) {
      //Save information in creator Profile
      const ObjectId = new mongoose.Types.ObjectId(req.body.viewed_profile_id);
      const data = await creatorProfile.findOne({
        _id: ObjectId,
      });

      data.social_tiktok_avatar_url_100 = result.data.data.user.avatar_url_100;
      data.social_tiktok_display_name = result.data.data.user.display_name;
      data.social_tiktok_bio_description =
        result.data.data.user.bio_description;
      data.social_tiktok_profile_deep_link =
        result.data.data.user.profile_deep_link;
      data.social_tiktok_is_verified = result.data.data.user.is_verified;
      data.social_tiktok_follower_count = result.data.data.user.follower_count;
      data.social_tiktok_following_count =
        result.data.data.user.following_count;
      data.social_tiktok_likes_count = result.data.data.user.likes_count;
      data.social_tiktok_video_count = result.data.data.user.video_count;

      await data.save();

      res.status(200);
      res.json({
        msg: "Successfully pulled Tiktok profile",
        tiktok_profile: result.data.data.user,
      });
    }
  } catch (error) {
    //Unlink tiktok in profile
    const ObjectId = new mongoose.Types.ObjectId(req.body.viewed_profile_id);
    const profile = await creatorProfile.findOne({ _id: ObjectId });
    if (profile) {
      profile.social_tiktok = false;
      await profile.save();
    }

    //delete duplicate token already stored
    await socialTiktokCredentials.deleteMany({
      user_id: req.body.viewed_profile_id,
    });
    console.error("Error during callback:", error.message);
  }
});
module.exports = router;
