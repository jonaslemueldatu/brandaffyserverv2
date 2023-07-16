const mongoose = require('mongoose')

let dt = new Date();
dt.setMonth(dt.getMonth() + 1)

const Schema = mongoose.Schema;
const brandSubscriptionSchema = new Schema({
    email: String,
    plan: {
        type: String,
        default: "Free"
    },
    brand_active_campaigns: {
           type: Number,
           default: 5
    },
    plan_active: {
        type: Boolean,
        default: true
    },
    brand_current_active_campaigns: {
        type: Number,
        default: 0
    }, 
    expirationDate: {
        type: Date,
        default: dt
    }
})

const brandSubscription = mongoose.model('brandSubscription', brandSubscriptionSchema)

module.exports = brandSubscription;
