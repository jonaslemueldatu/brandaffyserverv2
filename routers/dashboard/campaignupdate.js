const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const campaigns = require("../../models/campaigns");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");

router.post("/", async (req, res) => {
  const ObjectId = new mongoose.Types.ObjectId(req.body.campaign_id);
  const data = await campaigns.findOne({ _id: ObjectId });
  switch (req.body.change_to_status) {
    case "Active":
      if (data) {
        data.status = req.body.change_to_status;
        data.start_date = Date.now();
        await data.save();
        const usersLinkedCampaign = await affiliateCampaignMap.find({
          campaign_id: req.body.campaign_id,
        });
        usersLinkedCampaign.map(async (data) => {
          data.campaign_status = req.body.change_to_status;
          await data.save();
        });
        res.status(200);
        res.json({
          msg: "Successfully updated campaign",
        });
      }
      break;
    case "Cancelled":
      if (data) {
        data.status = req.body.change_to_status;
        data.cancelled_date = Date.now();
        await data.save();
        const usersLinkedCampaign = await affiliateCampaignMap.find({
          campaign_id: req.body.campaign_id,
        });
        usersLinkedCampaign.map(async (data) => {
          data.campaign_status = req.body.change_to_status;
          await data.save();
        });
        res.status(200);
        res.json({
          msg: "Successfully updated campaign",
        });
      }
      break;
    default:
      res.status(200);
      res.json({
        err: "Failed to update campaign",
      });
      break;
  }
});

module.exports = router;
