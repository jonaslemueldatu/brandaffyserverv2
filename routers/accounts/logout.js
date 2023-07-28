const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Model Imports
const creatorProfile = require("../../models/creatorProfile");

router.post("/", async (req, res) => {
  try {
    const ObjectId = new mongoose.Types.ObjectId(req.body._id);
    const data = await creatorProfile.findOne({ _id: ObjectId });
    if (data && req.body.viewer_user_type == "creator") {
      data.logged_in = false;
      await data.save();
      res.status(200),
        res.json({
          msg: "Successfully Logged-out!",
        });
    } else if (req.body.viewer_user_type == "brand") {
      res.status(200);
      res.json({
        msg: "Successfully logged-out!",
      });
    } else {
      res.status(200);
      res.json({
        err: "Failed to log out!",
      });
    }
  } catch (error) {
    console.log(`logout.js, ${error}`);
  }
});

module.exports = router;
