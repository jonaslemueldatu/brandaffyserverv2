const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const campaignTiktokVideoMapSchema = new Schema({
  brand_owner_id: String,
  campaign_id: String,
  video_id: String,
  affiliate_id: String,
  share_url: String,
  video_description: String,
  duration: String,
  title: String,
  cover_image_url: String,
  like_count: Number,
  comment_count: Number,
  share_count: Number,
  view_count: Number,
  create_time: Date,
  linked_time: {
    type: Date,
    default: new Date(),
  },
});

const campaignTiktokVideoMap = mongoose.model(
  "campaignTiktokVideoMap",
  campaignTiktokVideoMapSchema
);

module.exports = campaignTiktokVideoMap;
