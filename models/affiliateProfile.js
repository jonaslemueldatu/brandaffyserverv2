const mongoose = require("mongoose");

let now = new Date();
let dt = new Date(now);
dt.setDate(now.getDate() + 30);

const Schema = mongoose.Schema;
const affiliateProfileSchema = new Schema({
  user_type: {
    type: String,
    default: "Affiliate",
  },
  profile_picture: {
    type: String,
    default:
      "https://brandaffy.s3.ap-southeast-2.amazonaws.com/website+assets/profile+placeholder.jpeg",
  },
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  birthdate: Date,
  age: Number,
  gender: String,
  phone_number: String,
  province: String,
  country: String,
  social_tiktok: {
    type: Boolean,
    default: false,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  logged_in: {
    type: Boolean,
    default: true,
  },
  avatar_url_100: String,
  display_name: String,
  bio_description: String,
  profile_deep_link: String,
  is_verified: Boolean,
  follower_count: Number,
  following_count: Number,
  likes_count: Number,
  video_count: Number,
});

const affiliateProfile = mongoose.model(
  "affiliateProfile",
  affiliateProfileSchema
);

module.exports = affiliateProfile;
