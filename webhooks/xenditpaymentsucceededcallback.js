const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Model Imports
const brandSubscription = require("../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    res.status(200);
    res.json({
      msg: "Successfully received webhook",
    });
    console.log(req.body);
    switch (req.body.data.status) {
      case "SUCCEEDED":
        const ObjectId = new mongoose.Types.ObjectId(
          req.body.data.reference_id
        );
        const planUpdate = await brandSubscription.findOne({
          _id: ObjectId,
        });

        // Update subscription data
        let dt;
        if (planUpdate.plan_title === req.body.metadata.new_plan) {
          dt = new Date(planUpdate.plan_expiration_date);
          dt.setDate(dt.getDate() + 30);
          planUpdate.plan_expiration_date = dt;
        } else {
          dt = new Date();
          dt.setDate(dt.getDate() + 30);
          planUpdate.plan_expiration_date = dt;
        }
        planUpdate.plan_active = true;
        planUpdate.plan_charge_amount = req.body.data.amount;
        planUpdate.plan_active_boxes = req.body.data.metadata.plan_active_boxes;
        planUpdate.plan_active_campaigns =
          req.body.data.metadata.plan_active_campaigns;
        planUpdate.plan_title = req.body.data.metadata.new_plan;
        await planUpdate.save();
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(`xenditpaymentsucceededcallback.js, ${error.message}`);
  }
});

module.exports = router;
