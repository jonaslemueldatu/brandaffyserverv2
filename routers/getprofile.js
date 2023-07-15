const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../models/affiliateProfile");

router.get("/", async (req, res) => {
  const data = await affiliateProfile.findOne({ _id: req.query.id });
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
        },
        msg: "Profile found!",
      });
  } else {
    res.status(200);
    res.json({
      err: "Profile cannot be found!",
    });
  }
});

module.exports = router;
