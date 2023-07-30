const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const campaignsSchema = new Schema({
  brand_owner_id: String,
  brand_name: String,
  platform: String,
  status: {
    type: String,
    default: "Ready to Start",
  },
  campaign_name: String,
  campaign_product: String,
  campaign_objectives: String,
  campaign_target_market: String,
  campaign_proposed_payment: String,
  campaign_terms: String,
  create_date: {
    type: Date,
    default: Date.now,
  },
  social_total_views: {
    type: Number,
    default: 0,
  },
  social_total_likes: {
    type: Number,
    default: 0,
  },
  social_total_comments: {
    type: Number,
    default: 0,
  },
  social_total_shares: {
    type: Number,
    default: 0,
  },
  start_date: Date,
  cancelled_date: Date,
  end_date: Date,
  creator_list_accepted: Array,
  creator_list_invited: Array,
  creator_list_declined: Array,
  creator_list_applied: Array,
});

const campaigns = mongoose.model("campaigns", campaignsSchema);

module.exports = campaigns;
