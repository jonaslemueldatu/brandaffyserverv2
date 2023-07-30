const express = require("express");
const router = express.Router();
const creatorProfile = require("../../models/creatorProfile");

router.get("/", async (req, res) => {
  const data = await creatorProfile.find(
    req.query,
    "_id profile_picture first_name last_name occupation niche email gender age province logged_in province social_tiktok social_tiktok_follower_count"
  );
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of creators",
      creator_list: data,
    });
  }
});

module.exports = router;
