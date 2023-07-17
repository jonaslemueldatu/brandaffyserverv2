const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const campaigns = require("../../models/campaigns");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
  let list;
  if (req.body.invitation_box) {
    const objectId = new mongoose.Types.ObjectId(req.body.invitation_box);
    const Data = await brandBox.findOne({ _id: objectId });
    if (Data.affiliate_list.length > 0) {
      list = Data.affiliate_list;
    }
  }

  console.log(list)
  const newcampaigns = new campaigns({
    brand_owner_id: req.body.brand_owner_id,
    status: "Ready to Start",
    campaign_name: req.body.campaign_name,
    campaign_product: req.body.product,
    campaign_objectives: req.body.objectives,
    campaign_target_market: req.body.market,
    campaign_proposed_payment: req.body.payment_type,
    campaign_terms: req.body.terms_conditions,
    affiliate_list_invited: list,
  });

  console.log(newcampaigns)

//   await newcampaigns.save();
  res.status(200);
  res.json({
    msg: "Box successfully created!",
  });
});

module.exports = router;
