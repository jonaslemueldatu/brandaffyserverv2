const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../models/affiliateProfile");
const campaigns = require("../models/campaigns");

router.post("/", async (req, res) => {
  const ObjectId = new mongoose.Types.ObjectId(req.body.campaign_id);
  const data = await campaigns.findOne({ _id: ObjectId });
  if (data) {
    data.status = req.body.status;
    data.start_date = Date.now();
    await data.save();
    res.status(200);
    res.json({
      msg: "Successfully updated campaign",
    });
  }
});

module.exports = router;
