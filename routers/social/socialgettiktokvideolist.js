const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("querystring");
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");

router.get("/", async (req, res) => {
  try {
    const params = req.query;

    //Get Tiktok Access Token
    const credentials = await socialTiktokCredentials.findOne(
      req.query,
      "access_token user_id"
    );
    if (!credentials) {
      return;
    }

    //Use tiktok end point to get video list - first 20
    const vidlistEndpoint =
      "https://open.tiktokapis.com/v2/video/list/?fields=id,title";
    const result = await axios.post(
      vidlistEndpoint,
      {
        max_count: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (result) {
      res.status(200);
      res.json({
        msg: "Successfully acquired video list",
        video_list: result.data.data,
      });
      return;
    }
    res.status(200);
    res.json({
      err: "Failed to get public video list",
    });
  } catch (error) {
    //Unlink tiktok in profile
    const ObjectId = new mongoose.Types.ObjectId(credentials.user_id);
    const profile = await creatorProfile.findOne({ _id: ObjectId });
    if (profile) {
      profile.social_tiktok = false;
      await profile.save();
    }

    //delete duplicate token already stored
    await socialTiktokCredentials.deleteMany({
      user_id: credentials.user_id,
    });
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
