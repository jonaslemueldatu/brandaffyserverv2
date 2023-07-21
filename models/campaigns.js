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
  start_date: Date,
  cancelled_date: Date,
  end_date: Date,
  affiliate_list_accepted: Array,
  affiliate_list_invited: Array,
  affiliate_list_declined: Array,
  affiliate_list_applied: Array,
});

const campaigns = mongoose.model("campaigns", campaignsSchema);

module.exports = campaigns;
