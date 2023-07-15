const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const affiliateProfile = require("../models/affiliateProfile");
const fs = require("fs");
const util = require("util");
const router = express.Router();

const unlinkFile = util.promisify(fs.unlink);
const upload = multer({ dest: "uploads/" });

const { uploadFile } = require("../modules/s3");

router.post("/", upload.single("profile_picture"), async (req, res) => {
  console.log(req.body);
  let result = "";
  if (req.file) {
    const file = req.file;
    req.file.filename = req.body.id.toString();
    result = await uploadFile(file, "ugc_affiliate_profilepictures");
    await unlinkFile(file.path);
  }

  affiliateProfile.findOne({ _id: req.body.id }).then((data) => {
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
      data.save().then(
        res.status(200),
        res.json({
          msg: "Update successful",
          user_profile: data,
        })
      );
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
      data.save().then(
        res.status(200),
        res.json({
          msg: "Update successful",
          user_profile: data,
        })
      );
    } else {
      res.status(200);
      res.json({
        err: "Failed to update",
      });
    }
  });
});

module.exports = router;
