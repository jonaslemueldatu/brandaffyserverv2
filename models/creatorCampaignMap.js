const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const creatorCampaignMapSchema = new Schema({
  brand_owner_id: String,
  campaign_id: String,
  affiliate_id: String,
  relationship_status: String,
  platform: String,
  campaign_status: {
    type: String,
    default: "Ready to Start",
  },
  invite_date: Date,
  accept_date: Date,
  applied_date: Date,
  declined_date: Date,
  video_list: Array,
});

const creatorCampaignMap = mongoose.model(
  "creatorCampaignMap",
  creatorCampaignMapSchema
);

module.exports = creatorCampaignMap;
