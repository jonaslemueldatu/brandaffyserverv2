const express = require("express");
const router = express.Router();
const affiliateProfile = require("../../models/affiliateProfile");

router.get("/", async (req, res) => {
  console.log(req.query)
  const data = await affiliateProfile.find(
    req.query,
    "_id profile_picture first_name last_name email gender age province logged_in province social_tiktok"
  );
  console.log(data)
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of affiliates",
      affiliate_list: data,
    });
  }
});

module.exports = router;
