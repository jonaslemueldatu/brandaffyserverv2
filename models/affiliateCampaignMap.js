const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const affiliateCampaignMapSchema = new Schema({
  brand_owner_id: String,
  campaign_id: String,
  affiliate_id: String,
  relationship_status: String,
  platform: String,
  campaign_status: String,
  invite_date: Date,
  accept_date: Date,
  applied_date: Date,
  declined_date: Date,
});

const affiliateCampaignMap = mongoose.model(
  "affiliateCampaignMap",
  affiliateCampaignMapSchema
);

module.exports = affiliateCampaignMap;
