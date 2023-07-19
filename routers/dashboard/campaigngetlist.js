const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../../models/affiliateProfile");
const campaigns = require("../../models/campaigns");

router.get("/", async (req, res) => {
  const data = await campaigns.find(req.query);
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of campaigns",
      campaign_list: data,
    });
  }
});

module.exports = router;
