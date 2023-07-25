const mongoose = require('mongoose')

let now = new Date();
let dt = new Date(now);
dt.setDate(now.getDate() + 30);

const Schema = mongoose.Schema;
const affiliateSubscriptionSchema = new Schema({
    email: String,
    plan: {
        type: String,
        default: "Free"
    },
    plan_active: {
        type: Boolean,
        default: true
    },
    influencer_active_campaigns: {
           type: Number,
           default: 5
    },
    influencer_current_active_campaigns: {
        type: Number,
        default: 0
    }, 
    expirationDate: {
        type: Date,
        default: dt
    }
})

const affiliateSubscription = mongoose.model('affiliateSubscription', affiliateSubscriptionSchema)

module.exports = affiliateSubscription;
