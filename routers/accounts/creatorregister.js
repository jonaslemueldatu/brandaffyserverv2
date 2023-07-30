const express = require("express");
const router = express.Router();

//Models import
const creatorProfile = require("../../models/creatorProfile");
const creatorSubscription = require("../../models/creatorSubscription");

//Module Import
const { createXenditCustomer } = require("../../modules/xendit/customercreate");
const { createJWTToken } = require("../../modules/jwt/createtoken");

router.post("/", async (req, res) => {
  try {
    const profileExists = await creatorProfile.findOne({
      email: req.body.email,
    });
    if (profileExists) {
      res.status(200);
      res.json({
        err: "Email already exists!",
      });
      return;
    }

    //Create new profile
    const newcreatorProfile = new creatorProfile({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    // Create new Xendit Customer
    const newXenditCustomer = await createXenditCustomer(
      req.body.user_type,
      req.body.email,
      "",
      newcreatorProfile._id.toString(),
      "",
      req.body.first_name,
      req.body.last_name
    );

    //Create new subscription
    const newcreatorSubscription = new creatorSubscription({
      email: req.body.email,
      creator_profile_id: newcreatorProfile._id.toString(),
      xendit_reference_id: newXenditCustomer.id,
    });

    //Create new jwt login token
    const newJWTToken = await createJWTToken(newcreatorProfile._id.toString);

    console.log(newcreatorProfile);
    console.log(newcreatorSubscription);

    //Save documents
    await newcreatorProfile.save();
    await newcreatorSubscription.save();

    res.status(200);
    res.json({
      msg: "Registration successful!",
      token: newJWTToken,
      user_profile: {
        id: newcreatorSubscription.creator_profile_id,
        email: newcreatorProfile.email,
        user_type: "Creator",
        is_plan_active: true,
      },
    });
  } catch (error) {
    console.log(`creatorregister.js, ${error}`);
  }
});

module.exports = router;
