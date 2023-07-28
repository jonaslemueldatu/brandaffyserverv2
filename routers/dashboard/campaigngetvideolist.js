const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const campaignTiktokVideoMap = require("../../models/campaignTiktokVideoMap");

router.get("/", async (req, res) => {
  try {
    const user_type =
      req.query.user_type === "Brand" ? "brand_owner_id" : "creator_id";
    const data = await campaignTiktokVideoMap.find({
      campaign_id: req.query.campaign_id,
      [user_type]: req.query.user_id,
    });
    if (data) {
      res.status(200);
      res.json({
        msg: "Successfully pulled list of videos",
        video_list: data,
      });
    } else {
      res.status(200);
      res.json({
        err: "Failed to get list of videos",
      });
    }
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
