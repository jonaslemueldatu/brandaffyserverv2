const express = require("express");
const dotEnv = require("dotenv").config();
const router = express.Router();

//Models import
const creatorProfile = require("../../models/creatorProfile");

//Module Imports
const { checkPlanActive } = require("../../modules/mongoose/checkplanactive");
const { createJWTToken } = require("../../modules/jwt/createtoken");

router.post("/", async (req, res) => {
  try {
    //Check if account exists
    const profileExist = await creatorProfile.findOne({
      email: req.body.email,
    });
    if (profileExist) {
      //Check if password is correct
      if (profileExist.password == req.body.password) {
        //Check if plan is still Active
        const isPlanActive = await checkPlanActive(
          "Creator",
          profileExist._id.toString()
        );

        //Create new jwt login token
        const newJWTToken = await createJWTToken(profileExist._id.toString());

        //Change log-in state of user
        profileExist.logged_in = true;
        await profileExist.save();

        res.status(200),
          res.json({
            msg: "User has logged-in successfully",
            token: newJWTToken,
            user_profile: {
              id: profileExist._id,
              email: profileExist.email,
              user_type: profileExist.user_type,
              is_plan_active: isPlanActive,
            },
          });
      } else {
        res.status(200);
        res.json({
          err: "Incorrect password!",
        });
      }
    } else {
      res.status(200);
      res.json({
        err: "Email is not registered yet!",
      });
    }
  } catch (error) {
    console.log(`creatorlogin.js, ${error}`);
  }
});

module.exports = router;
