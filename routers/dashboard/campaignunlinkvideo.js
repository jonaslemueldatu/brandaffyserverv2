const express = require("express");
const router = express.Router();
const campaignTiktokVideoMap = require("../../models/campaignTiktokVideoMap");
const creatorCampaignMap = require("../../models/creatorCampaignMap");

router.post("/", async (req, res) => {
  try {
    await campaignTiktokVideoMap.deleteOne({
      campaign_id: req.body.campaign_id,
      video_id: req.body.video_id,
    });

    const creatorCampaign = await creatorCampaignMap.findOne({
      campaign_id: req.body.campaign_id,
      creator_id: req.body.creator_id,
    });
    if (creatorCampaign) {
      await creatorCampaign.video_list.splice(
        creatorCampaign.video_list.indexOf(req.body.video_id),
        1
      );

      await creatorCampaign.save();

      res.status(200);
      res.json({
        msg: "Successfully unlinked tiktok video",
      });
    } else {
      res.status(200);
      res.json({
        err: "Failed to update mapping",
      });
    }
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
