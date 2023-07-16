const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.get("/", async (req, res) => {
  const data = await brandBox.find({
    brand_owner_id: req.query.brand_owner_id,
  });
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of affiliates",
      brandbox_list: data,
    });
  }
});

module.exports = router;
