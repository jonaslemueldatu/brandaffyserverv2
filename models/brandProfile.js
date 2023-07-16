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
    about: String,
    company_address: String,
    country: String,
    industry: String,
    employee_size: Number,
    email: String,
    password: String,
    phone_number: String, 
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