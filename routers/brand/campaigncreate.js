const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const campaigns = require("../../models/campaigns");
const brandBox = require("../../models/brandBox");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");

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
    if (Data.affiliate_list.length > 0) {
      list = Data.affiliate_list;
    }
  }

  const newcampaigns = new campaigns({
    brand_owner_id: req.body.brand_owner_id,
    platform: "Tiktok",
    status: "Ready to Start",
    campaign_name: req.body.campaign_name,
    campaign_product: req.body.campaign_product,
    campaign_objectives: req.body.campaign_objectives,
    campaign_target_market: req.body.campaign_market,
    campaign_proposed_payment: req.body.payment_type,
    campaign_terms: req.body.terms_conditions,
    affiliate_list_invited: list,
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
    list.map(async (affiliateId) => {
      let newaffiliateCampaignMap = new affiliateCampaignMap({
        brand_owner_id: req.body.brand_owner_id,
        campaign_id: Data3._id.toString(),
        affiliate_id: affiliateId,
        status: "Invited",
        invite_date: Date.now(),
      });
      await newaffiliateCampaignMap.save()
    });
  }

  res.status(200);
  res.json({
    msg: "Box successfully created!",
  });
});

module.exports = router;
