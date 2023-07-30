const express = require("express");
const router = express.Router();
const dotEnv = require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const { Buffer } = require("buffer");

//Model Imports
const brandSubscription = require("../../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    //Build parameters for post request
    let apiKey = process.env.XENDIT_API_KEY;
    let returnUrl =
      "http://brandaffy.com/dashboard/settings?subsettings=Payment";
    let reqBody;
    const ObjectId = new mongoose.Types.ObjectId(req.body.reference_id);

    switch (req.body.payment_type) {
      //Case the user unlinks a payment method
      case "EXPIRE":
        const reqUrl = `https://api.xendit.co/v2/payment_methods/${req.body.payment_id}/expire?success_return_url=${returnUrl}&failure_return_url=${returnUrl}`;
        //Use Xendit endpoint to expire method
        const expireMethod = await axios.post(
          reqUrl,
          {},
          {
            headers: {
              Authorization: `Basic ${Buffer.from(apiKey + ":").toString(
                "base64"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        //Check for subscription object
        const brandSubs = await brandSubscription.findOne({
          _id: ObjectId,
        });
        
        //Remove payment method 
        brandSubs.plan_payment_methods.splice(
          brandSubs.plan_payment_methods.indexOf(
            expireMethod.data.ewallet.channel_code
          ),
          1
        );

        //Remove payment method object
        brandSubs.plan_payment_methods_object.splice(
          brandSubs.plan_payment_methods_object.findIndex((object) => {
            return object.id === expireMethod.data.id;
          })
        );

        //Save new subscription object
        await brandSubs.save();
        res.status(200);
        res.json({
          msg: "Successfully unLinked payment method",
        });
        return;
        
      case "PAYMAYA":
        reqBody = {
          type: "EWALLET",
          reusability: "MULTIPLE_USE",
          reference_id: req.body.reference_id,
          customer_id: req.body.customer_id,
          country: "PH",
          ewallet: {
            channel_code: "PAYMAYA",
            channel_properties: {
              success_return_url: returnUrl,
              failure_return_url: returnUrl,
              cancel_return_url: returnUrl,
            },
          },
        };
        break;
      default:
        break;
    }

    // Post Request
    const paymentMethodObject = await axios.post(
      `https://api.xendit.co/v2/payment_methods`,
      reqBody,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200);
    res.json({
      msg: "Successfully generated a payment method",
      actionLink: paymentMethodObject.data.actions[0].url,
    });
  } catch (error) {
    console.log(`router, ${error}`);
  }
});

module.exports = router;
