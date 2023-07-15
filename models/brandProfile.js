const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const brandProfileSchema = new Schema({
    user_type: {
        type: String,
        default: "Brand"
    },
    profile_picture: {
        type: String,
        default: 'https://brandaffy.s3.ap-southeast-2.amazonaws.com/website+assets/profile+placeholder.jpeg'
    },
    brand_name: String,
    email: String,
    password: String,
    registerDate: {
        type: Date,
        default: Date.now
    },
    logged_in: {
        type: Boolean,
        default: true
    },
})

const brandProfile = mongoose.model('brandProfile', brandProfileSchema)

module.exports = brandProfile;