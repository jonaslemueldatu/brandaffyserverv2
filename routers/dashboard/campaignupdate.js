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
    case "Ended":
      if (data) {
        data.status = req.body.change_to_status;
        data.end_date = Date.now();
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
    case "Invited":
      if (data) {
        if (
          data.affiliate_list_invited.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User is already invited on this campaign!",
          });
        } else if (
          data.affiliate_list_accepted.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has already accepted this campaign!",
          });
        } else if (
          data.affiliate_list_declined.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has previously declined this campaign!",
          });
        } else if (
          data.affiliate_list_applied.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has a pending application to this campaign!",
          });
        } else {
          data.affiliate_list_invited.push(req.body.invited_influencer);
          await data.save();
          let newaffiliateCampaignMap = new affiliateCampaignMap({
            brand_owner_id: req.body.brand_owner_id,
            campaign_id: data._id.toString(),
            affiliate_id: req.body.invited_influencer,
            platform: "Tiktok",
            relationship_status: "Invited",
            campaign_status: req.body.change_to_status,
            invite_date: Date.now(),
          });
          await newaffiliateCampaignMap.save();
          res.status(200);
          res.json({
            msg: "Successfully invited influencer to campaign",
          });
        }
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
