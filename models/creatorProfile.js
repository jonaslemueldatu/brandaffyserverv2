const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const creatorProfileSchema = new Schema({
  user_type: {
    type: String,
    default: "Creator",
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
  register_date: {
    type: Date,
    default: Date.now,
  },
  logged_in: {
    type: Boolean,
    default: true,
  },
  social_tiktok_avatar_url_100: String,
  social_tiktok_display_name: String,
  social_tiktok_bio_description: String,
  social_tiktok_profile_deep_link: String,
  social_tiktok_is_verified: Boolean,
  social_tiktok_follower_count: Number,
  social_tiktok_following_count: Number,
  social_tiktok_likes_count: Number,
  social_tiktok_video_count: Number,
});

const creatorProfile = mongoose.model("creatorProfile", creatorProfileSchema);

module.exports = creatorProfile;
