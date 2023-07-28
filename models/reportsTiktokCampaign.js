const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dt = new Date();

const reportsTiktokCampaignSchema = new Schema({
  create_date: Date,
  campaign_id: String,
  video_id: String,
  creator_id: String,
  like_count: Number,
  comment_count: Number,
  share_count: Number,
  view_count: Number,
  like_count_diff: Number,
  comment_count_diff: Number,
  share_count_diff: Number,
  view_count_diff: Number,
});

const reportsTiktokCampaign = mongoose.model(
  "reportsTiktokCampaignSchema",
  reportsTiktokCampaignSchema
);

module.exports = reportsTiktokCampaign;
