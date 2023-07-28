const mongoose = require("mongoose");

let dt = new Date();
dt.setDate(dt.getDate() + 30);

const Schema = mongoose.Schema;
const brandSubscriptionSchema = new Schema({
  brand_profile_id: String,
  brand_email: String,
  plan_active: {
    type: Boolean,
    default: true,
  },
  plan_active_boxes: {
    type: Number,
    default: 5,
  },
  plan_active_campaigns: {
    type: Number,
    default: 3,
  },
  plan_charge_amount: {
    type: Number,
    default: 149900,
  },
  plan_current_active_boxes: {
    type: Number,
    default: 0,
  },
  plan_current_active_campaigns: {
    type: Number,
    default: 0,
  },
  plan_expiration_date: {
    type: Date,
    default: dt,
  },
  plan_title: {
    type: String,
    default: "Starter",
  },
  xendit_referrence_id: String,
});

const brandSubscription = mongoose.model(
  "brandSubscription",
  brandSubscriptionSchema
);

module.exports = brandSubscription;
