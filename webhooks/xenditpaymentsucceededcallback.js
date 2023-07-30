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
  } catch (error) {
    console.log(`xenditpaymentsucceededcallback.js, ${error.message}`);
  }
});

module.exports = router;
