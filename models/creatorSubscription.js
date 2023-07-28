const mongoose = require("mongoose");

let dt = new Date();
dt.setDate(dt.getDate() + 60);

const Schema = mongoose.Schema;
const creatorSubscriptionSchema = new Schema({
  email: String,
  creator_profile_id: String,
  plan_title: {
    type: String,
    default: "Free",
  },
  plan_active: {
    type: Boolean,
    default: true,
  },
  plan_active_campaigns: {
    type: Number,
    default: 5,
  },
  plan_current_active_campaigns: {
    type: Number,
    default: 0,
  },
  plan_expiration_date: Date,
  plan_amount: {
    type: Number,
    default: 0,
  },
  xendit_referrence_id: String,
});

const creatorSubscription = mongoose.model(
  "creatorSubscription",
  creatorSubscriptionSchema
);

module.exports = creatorSubscription;
