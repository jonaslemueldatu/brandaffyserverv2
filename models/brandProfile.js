const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const brandProfileSchema = new Schema({
  about: String,
  brand_name: String,
  business_name: String,
  business_type: String,
  company_address: String,
  country: String,
  email: String,
  employee_size: Number,
  industry: String,
  logged_in: {
    type: Boolean,
    default: true,
  },

  password: String,
  phone_number: String,
  profile_picture: {
    type: String,
    default:
      "https://brandaffy.s3.ap-southeast-2.amazonaws.com/website+assets/profile+placeholder.jpeg",
  },
  register_date: {
    type: Date,
    default: Date.now,
  },

  user_type: {
    type: String,
    default: "Brand",
  },
});

const brandProfile = mongoose.model("brandProfile", brandProfileSchema);

module.exports = brandProfile;
