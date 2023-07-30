const express = require("express");
const router = express.Router();

//ModelImports
const brandProfile = require("../../models/brandProfile");
const brandSubscription = require("../../models/brandSubscription");

//Module Import
const { createXenditCustomer } = require("../../modules/xendit/customercreate");
const { createJWTToken } = require("../../modules/jwt/createtoken");

router.post("/", async (req, res) => {
  try {
    //Check for existing email
    const existingEmail = await brandProfile.findOne({ email: req.body.email });
    if (existingEmail) {
      res.status(200);
      res.json({
        err: "Email already exists!",
      });
      return;
    }

    //Create new brand profile
    const newbrandProfile = new brandProfile({
      business_name: req.body.business_name,
      brand_name: req.body.brand_name,
      business_type: req.body.business_type,
      email: req.body.email,
      password: req.body.password,
    });

    // Create new Xendit Customer
    const newXenditCustomer = await createXenditCustomer(
      req.body.user_type,
      req.body.email,
      req.body.business_name,
      newbrandProfile._id.toString(),
      req.body.business_type
    );

    //Create new brand subscription
    const newbrandSubscription = new brandSubscription({
      brand_email: req.body.email,
      brand_profile_id: newbrandProfile._id.toString(),
      xendit_reference_id: newXenditCustomer.id,
    });

    //Create new jwt login token
    const newJWTToken = await createJWTToken(newbrandProfile._id.toString);

    //Save documents
    await newbrandProfile.save();
    await newbrandSubscription.save();

    //Return back the data
    res.status(200);
    res.json({
      msg: "Registration successful!",
      token: newJWTToken,
      user_profile: {
        id: newbrandSubscription.brand_profile_id,
        email: newbrandProfile.email,
        user_type: "Brand",
        is_plan_active: true,
      },
    });
  } catch (error) {
    console.log(`brandregister.js router, ${error}`);
  }
});

module.exports = router;
