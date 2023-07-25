const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../../models/affiliateProfile");
const brandProfile = require("../../models/brandProfile");

router.get("/", async (req, res) => {
  let data = {};
  switch (req.query.option_type) {
    case "Affiliate":
      delete req.query.option_type;
      data = await affiliateProfile.findOne(req.query);
      if (data) {
        data.birthdate
          ? (date = new Date(data.birthdate).toLocaleDateString("en-CA"))
          : (date = "");
        res.status(200),
          res.json({
            user_profile: {
              profile_picture: data.profile_picture,
              firstname: data.first_name,
              lastname: data.last_name,
              birthdate: date,
              age: data.age,
              gender: data.gender,
              email: data.email,
              phone_number: data.phone_number,
              country: data.country,
              province: data.province,
              social_tiktok: data.social_tiktok,
            },
            msg: "Profile found!",
          });
      } else {
        res.status(200);
        res.json({
          err: "Profile cannot be found!",
        });
      }
      break;
    case "Brand":
      delete req.query.option_type;
      data = await brandProfile.findOne(req.query);
      if (data) {
        res.status(200),
          res.json({
            user_profile: {
              profile_picture: data.profile_picture,
              brand_name: data.brand_name,
              about: data.about,
              industry: data.industry,
              employee_size: data.employee_size,
              company_address: data.company_address,
              country: data.country,
              phone_number: data.phone_number,
              email: data.email,
            },
            msg: "Profile found!",
          });
      } else {
        res.status(200);
        res.json({
          err: "Profile cannot be found!",
        });
      }
      break;
    default:
      break;
  }
});

module.exports = router;
