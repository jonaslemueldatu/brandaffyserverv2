//TEST

const express = require("express");
const router = express.Router();
const dotEnv = require("dotenv").config();
const axios = require("axios");
const Buffer = require("buffer");

router.post("/", async (req, res) => {
  try {
    //Build parameters for post request
    let apiKey = process.env.XENDIT_API_KEY;
    let returnUrl =
      "http://brandaffy.com/dashboard/settings?subsettings=Payment";
    let reqBody;

    switch (req.body.payment_type) {
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

    console.log(paymentMethodObject.data.actions[0].url);

    res.status(200);
    res.json({
      msg: "Successfully generated a payment method",
      actionLink: paymentMethodObject.data.actions[0].url,
    });
  } catch (error) {
    console.log(`router, ${error.message}`);
  }
});

module.exports = router;
