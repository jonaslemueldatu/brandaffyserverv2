const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../models/affiliateProfile");

router.post("/", (req, res) => {
  affiliateProfile.findOne({ _id: req.body.id }).then((data) => {
    if (data && req.body.type == "affiliate") {
      data.logged_in = false;
      data.save().then(
        res.status(200),
        res.json({
          msg: "Successfully Logged-out!",
        })
      );
    } else {
      res.status(200);
      res.json({
        err: "Id cannot be found",
      });
    }
  });
});

module.exports = router;
