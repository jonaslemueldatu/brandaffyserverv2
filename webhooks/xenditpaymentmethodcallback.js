const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Model Imports
const brandSubscription = require("../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    res.status(200);
    res.json({
      msg: "Successfully received callback"
    })
    console.log(req.body.data.reference_id);
    const ObjectId = new mongoose.Types.ObjectId(req.body.data.reference_id);
    const subscriptionData = await brandSubscription.findOne({
      _id: ObjectId,
    });
    subscriptionData.plan_payment_methods.push(
      req.body.data.ewallet.channel_code
    );
    subscriptionData.plan_payment_methods_object.push(req.body);
    await subscriptionData.save();
  } catch (error) {
    console.log(`xenditpaymentmethodcallback.js, ${error.message}`);
  }
});

module.exports = router;
