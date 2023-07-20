const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../../models/affiliateProfile");
const campaigns = require("../../models/campaigns");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");

router.get("/", async (req, res) => {
  console.log(req.query);
  const data = await affiliateCampaignMap.aggregate([
    {
      $match: { affiliate_id: { $eq: req.query.affiliate_id } },
    },
    {
      $match: { relationship_status: { $eq: req.query.relationship_status } },
    },
    {
      $lookup: {
        from: "campaigns",
        let: { searchId: { $toObjectId: "$campaign_id" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$searchId"],
              },
            },
          },
        ],
        as: "campaign_details",
      },
    },
  ]);
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of campaigns",
      campaign_list: data,
    });
  }
});

module.exports = router;
