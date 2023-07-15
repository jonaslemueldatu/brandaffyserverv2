const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../models/affiliateProfile");

router.post("/", async (req, res) => {
  const data = await affiliateProfile.findOne({ _id: req.body.id });
  if (data && req.body.type == "affiliate") {
    data.logged_in = false;
    await data.save();
    res.status(200),
      res.json({
        msg: "Successfully Logged-out!",
      });
  } else {
    res.status(200);
    res.json({
      err: "Id cannot be found",
    });
  }
});

module.exports = router;
