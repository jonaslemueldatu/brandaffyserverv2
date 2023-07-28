const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const creatorProfile = require("../../models/creatorProfile");
const campaigns = require("../../models/campaigns");
const creatorCampaignMap = require("../../models/creatorCampaignMap");

router.get("/", async (req, res) => {
  const data = await creatorCampaignMap.aggregate([
    {
      $match: { creator_id: { $eq: req.query.creator_id } },
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
