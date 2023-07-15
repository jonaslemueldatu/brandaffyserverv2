const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const socialTiktokSchema = new Schema({
    user_id: String,
    access_token: String,
    connectDate: {
        type: Date,
        default: Date.now
    },
    total_followers: Number,
    total_views: Number,
    total_posts: Number, 
    total_following: Number,
    account_handle: String,
    linked: {
        type: Boolean,
        default: false
    }
})

const socialTiktok = mongoose.model('socialTiktok', socialTiktokSchema)

module.exports = socialTiktok;