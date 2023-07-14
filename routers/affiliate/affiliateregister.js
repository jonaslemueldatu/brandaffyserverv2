const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const affiliateProfile = require("../../models/affiliateProfile")
const affiliateSubscription = require("../../models/affiliateSubscription");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  affiliateProfile.findOne({ email: req.body.email }).then((data) => {
    if (data) {
      res.status(200);
      res.json({
        err: "Email already exists!",
      });
    } else {
      const newaffiliateProfile = new affiliateProfile({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
      });

      const newaffiliateSubscription = new affiliateSubscription({
        email: req.body.email,
      });

      newaffiliateSubscription.save();
      newaffiliateProfile.save();

      affiliateProfile
        .findOne({ email: req.body.email }, "_id")
        .then((data) => {
          if (data) {
            const token = jwt.sign(
              { email: req.body.email },
              process.env.JSON_WEB_TOKEN_KEY,
              {
                expiresIn: "1h",
              }
            );
            res.status(200);
            res.json({
              msg: "Registration successful!",
              token: token,
              user_profile: {
                id: data.id,
                email: data.email,
                user_type: "Affiliate",
              },
            });
          }
        });
    }
  });
});

module.exports = router;
