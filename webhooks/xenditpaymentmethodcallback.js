const express = require("express");
const router = express.Router();

//Model Imports
const brandSubscription = require("../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const ObjectId = new mongoose.Types.ObjectId(req.body.business_id);
    const subscriptionData = await brandSubscription.findOne({
      _id: ObjectId,
    });
    subscriptionData.plan_payment_methods.push(
      req.body.data.ewallet.channel_code
    );
    subscriptionData.plan_payment_methods_object.push(req.body);
  } catch (error) {
    console.log(`xenditpaymentmethodcallback.js, ${error.message}`);
  }
});

module.exports = router;
