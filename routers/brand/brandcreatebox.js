const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
  const data = await brandBox.findOne({
    box_label: req.body.box_label,
    brand_owner_id: req.body.brand_owner_id,
  });
  if (data) {
    res.status(200);
    res.json({
      err: "Label already exists!",
    });
  } else {
    const newbrandBox = new brandBox({
      box_label: req.body.box_label,
      box_description: req.body.box_description,
      brand_owner_id: req.body.brand_owner_id,
    });

    await newbrandBox.save();
    res.status(200);
    res.json({
      msg: "Box successfully created!",
    });
  }
});

module.exports = router;
