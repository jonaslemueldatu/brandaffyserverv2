const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const campaigns = require("../../models/campaigns");

router.get("/", async (req, res) => {
  let params = req.query;
  const newLocal = new mongoose.Types.ObjectId(req.query._id);
  const ObjectId = newLocal;
  params._id = ObjectId;
  const data = await campaigns.findOne(params);
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully retreived Campaign Details",
      campaign_details: data,
    });
  } else {
    res.status(200);
    res.json({
      err: "Failed to get campaign details",
    });
  }
});

module.exports = router;
