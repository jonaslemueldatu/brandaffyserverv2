const mongoose = require("mongoose");

let now = new Date();
let dt = new Date(now);
dt.setDate(now.getDate() + 30);

const Schema = mongoose.Schema;
const brandSubscriptionSchema = new Schema({
  email: String,
  profile_id: String,
  plan: {
    type: String,
    default: "Starter",
  },
  brand_active_campaigns: {
    type: Number,
    default: 3,
  },
  plan_active: {
    type: Boolean,
    default: true,
  },
  brand_active_boxes: {
    type: Number,
    default: 5,
  },
  brand_current_active_boxes: {
    type: Number,
    default: 0,
  },
  brand_current_active_campaigns: {
    type: Number,
    default: 0,
  },
  expirationDate: {
    type: Date,
    default: dt,
  },
  charge_amount: {
    type: Number,
    default: 149900,
  },
});

const brandSubscription = mongoose.model(
  "brandSubscription",
  brandSubscriptionSchema
);

module.exports = brandSubscription;
