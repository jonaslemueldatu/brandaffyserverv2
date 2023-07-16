const mongoose = require('mongoose')

let dt = new Date();
dt.setMonth(dt.getMonth() + 1)

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
           default: 3
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
