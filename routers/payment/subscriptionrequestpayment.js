const express = require("express");
const router = express.Router();
const dotEnv = require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const { Buffer } = require("buffer");

const brandSubscription = require("../../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    //Build parameters for post request
    let apiKey = process.env.XENDIT_API_KEY;
    let returnUrl =
      "http://brandaffy.com/dashboard/settings?subsettings=Payment";
    let reqBody = {
      currency: "PHP",
      amount: req.body.amount,
      reference_id: req.body.reference_id,
      customer_id: req.body.customer_id,
      country: "PH",
      payment_method_id: req.body.payment_method_id,
      channel_properties: {
        success_return_url: returnUrl,
        failure_return_url: returnUrl,
        cancel_return_url: returnUrl,
      },
      metadata: req.body.metadata,
    };
    const paymentMethodObject = await axios.post(
      `https://api.xendit.co/payment_requests`,
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
    console.log(paymentMethodObject);
    res.status(200);
    res.json({
      msg: "Successfully sent payment request",
    });
  } catch (error) {
    console.log(`router, ${error}`);
  }
});

module.exports = router;
