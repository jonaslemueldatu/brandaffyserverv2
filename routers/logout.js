const express = require("express");
const router = express.Router();
const affiliateProfile = require("../models/affiliateProfile");

router.post("/", async (req, res) => {
  const data = await affiliateProfile.findOne({ _id: req.body._id });
  if (data && req.body.viewer_user_type == "affiliate") {
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
      err: "Failed to log out!"
    })
  }
});

module.exports = router;
