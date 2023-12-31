const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const campaigns = require("../../models/campaigns");
const brandBox = require("../../models/brandBox");
const brandProfile = require("../../models/brandProfile");
const creatorCampaignMap = require("../../models/creatorCampaignMap");

router.post("/", async (req, res) => {
  const Data2 = await campaigns.findOne({
    campaign_name: req.body.campaign_name,
    brand_owner_id: req.body.brand_owner_id,
  });
  if (Data2) {
    res.status(200);
    res.json({
      err: "Campaign Name is already taken",
    });
    return;
  }

  let list = [];
  if (req.body.invitation_box) {
    const objectId = new mongoose.Types.ObjectId(req.body.invitation_box);
    const Data = await brandBox.findOne({ _id: objectId });
    if (Data.creator_list.length > 0) {
      list = Data.creator_list;
    }
  }
  const objectId2 = new mongoose.Types.ObjectId(req.body.brand_owner_id);
  const Data = await brandProfile.findOne({
    _id: objectId2,
  });
  const newcampaigns = new campaigns({
    brand_owner_id: req.body.brand_owner_id,
    brand_name: Data.brand_name,
    platform: "Tiktok",
    status: "Ready to Start",
    campaign_name: req.body.campaign_name,
    campaign_product: req.body.campaign_product,
    campaign_objectives: req.body.campaign_objectives,
    campaign_target_market: req.body.campaign_market,
    campaign_proposed_payment: req.body.payment_type,
    campaign_terms: req.body.terms_conditions,
    creator_list_invited: list,
  });
  await newcampaigns.save();
  const Data3 = await campaigns.findOne(
    {
      campaign_name: req.body.campaign_name,
      brand_owner_id: req.body.brand_owner_id,
    },
    "_id"
  );
  if (Data3 && list.length > 0) {
    list.map(async (creatorId) => {
      let newcreatorCampaignMap = new creatorCampaignMap({
        brand_owner_id: req.body.brand_owner_id,
        campaign_id: Data3._id.toString(),
        creator_id: creatorId,
        platform: "Tiktok",
        relationship_status: "Invited",
        campaign_status: "Ready To Start",
        invite_date: Date.now(),
      });
      await newcreatorCampaignMap.save();
    });
  }

  res.status(200);
  res.json({
    msg: "Box successfully created!",
  });
});

module.exports = router;
