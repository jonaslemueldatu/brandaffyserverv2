const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");
const campaignTiktokVideoMap = require("../../models/campaignTiktokVideoMap");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");

router.post("/", async (req, res) => {
  try {
    const duplicateCheck = await campaignTiktokVideoMap.find({
      $and: [
        { campaign_id: req.body.campaign_id },
        { video_id: req.body.video_id },
      ],
    });

    if (duplicateCheck.length > 0) {
      res.status(200);
      res.json({
        err: "Video is already linked in this campaign",
      });
      return;
    }

    const credentials = await socialTiktokCredentials.findOne(
      {
        user_id: req.body.affiliate_id,
      },
      "access_token"
    );
    if (!credentials) {
      return;
    }
    const vidqueryEndpoint =
      "https://open.tiktokapis.com/v2/video/query/?fields=id,create_time,cover_image_url,share_url,video_description,duration,title,like_count,comment_count,share_count,view_count";
    const result = await axios.post(
      vidqueryEndpoint,
      {
        filters: {
          video_ids: [req.body.video_id],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (result) {
      const newCampaignTiktokVideoMap = new campaignTiktokVideoMap({
        brand_owner_id: req.body.brand_owner_id,
        campaign_id: req.body.campaign_id,
        video_id: req.body.video_id,
        affiliate_id: req.body.affiliate_id,
        share_url: result.data.data.videos[0].share_url,
        video_description: result.data.data.videos[0].video_description,
        duration: result.data.data.videos[0].duration,
        title: result.data.data.videos[0].title,
        cover_image_url: result.data.data.videos[0].cover_image_url,
        like_count: result.data.data.videos[0].like_count,
        comment_count: result.data.data.videos[0].comment_count,
        share_count: result.data.data.videos[0].share_count,
        view_count: result.data.data.videos[0].view_count,
        create_time: new Date(result.data.data.videos[0].create_time * 1000),
      });

      await newCampaignTiktokVideoMap.save();

      const affiliateCampaign = await affiliateCampaignMap.findOne({
        campaign_id: req.body.campaign_id,
        affiliate_id: req.body.affiliate_id,
      });

      if (affiliateCampaign) {
        affiliateCampaign.video_list.push(req.body.video_id);
        await affiliateCampaign.save();
      }
      res.status(200);
      res.json({
        msg: "Successfully linked tiktok video",
      });
    }
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
