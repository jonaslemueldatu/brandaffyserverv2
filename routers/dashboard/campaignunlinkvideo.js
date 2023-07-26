const express = require("express");
const router = express.Router();
const campaignTiktokVideoMap = require("../../models/campaignTiktokVideoMap");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");

router.post("/", async (req, res) => {
  try {
    await campaignTiktokVideoMap.deleteOne({
      campaign_id: req.body.campaign_id,
      video_id: req.body.video_id,
    });

    const affiliateCampaign = await affiliateCampaignMap.findOne({
      campaign_id: req.body.campaign_id,
      affiliate_id: req.body.affiliate_id,
    });
    if (affiliateCampaign) {
      await affiliateCampaign.video_list.splice(
        affiliateCampaign.video_list.indexOf(req.body.video_id),
        1
      );

      await affiliateCampaign.save();

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
