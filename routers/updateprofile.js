const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const affiliateProfile = require("../models/affiliateProfile");
const brandProfile = require("../models/brandProfile");
const fs = require("fs");
const util = require("util");
const router = express.Router();

const unlinkFile = util.promisify(fs.unlink);
const upload = multer({ dest: "uploads/" });

const { uploadFile } = require("../modules/s3");

router.post("/", upload.single("profile_picture"), async (req, res) => {
  let result = "";
  if (req.file) {
    const fileFolder =
      req.body.user_type === "Affiliate"
        ? "ugc_affiliate_profilepictures"
        : "ugc_brand_profilepictures";
    const file = req.file;
    req.file.filename = req.body.id.toString();
    result = await uploadFile(file, fileFolder);
    await unlinkFile(file.path);
  }
  let data = {};
  switch (req.body.user_type) {
    case "Affiliate":
      data = await affiliateProfile.findOne({ _id: req.body.id });
      if (data && req.body.type === "profile") {
        if (data.profile_picture.includes("placeholder") && req.file) {
          data.profile_picture = result.Location;
        }
        if (data.birthdate != req.body.birthdate) {
          data.birthdate = req.body.birthdate;
        }
        if (data.first_name != req.body.firstname) {
          data.first_name = req.body.firstname;
        }
        if (data.last_name != req.body.lastname) {
          data.last_name = req.body.lastname;
        }
        if (data.age != req.body.age) {
          data.age = req.body.age;
        }
        if (data.gender != req.body.gender) {
          data.gender = req.body.gender;
        }
        await data.save();
        res.status(200),
          res.json({
            msg: "Update successful",
            user_profile: data,
          });
      } else if (data && req.body.type === "contact") {
        if (data.phone_number != req.body.phone_number) {
          data.phone_number = req.body.phone_number;
        }
        if (data.province != req.body.province) {
          data.province = req.body.province;
        }
        if (data.country != req.body.country) {
          data.country = req.body.country;
        }
        await data.save();
        res.status(200),
          res.json({
            msg: "Update successful",
            user_profile: data,
          });
      } else {
        res.status(200);
        res.json({
          err: "Failed to update",
        });
      }
      break;
    case "Brand":
      data = await brandProfile.findOne({ _id: req.body.id });
      if (data && req.body.type === "profile") {
        if (data.profile_picture.includes("placeholder") && req.file) {
          data.profile_picture = result.Location;
        }
        if (data.brand_name != req.body.brand_name) {
          data.brand_name = req.body.brand_name;
        }
        if (data.about != req.body.about) {
          data.about = req.body.about;
        }
        if (data.industry != req.body.industry) {
          data.industry = req.body.industry;
        }
        if (data.employee_size != req.body.employee_size) {
          data.employee_size = req.body.employee_size;
        }
        await data.save();
        res.status(200),
          res.json({
            msg: "Update successful",
            user_profile: data,
          });
      } else if (data && req.body.type === "contact") {
        if (data.phone_number != req.body.phone_number) {
          data.phone_number = req.body.phone_number;
        }
        if (data.address != req.body.address) {
          data.address = req.body.address;
        }
        if (data.country != req.body.country) {
          data.country = req.body.country;
        }
        await data.save();
        res.status(200),
          res.json({
            msg: "Update successful",
            user_profile: data,
          });
      } else {
        res.status(200);
        res.json({
          err: "Failed to update",
        });
      }
      break;
  }
});

module.exports = router;
