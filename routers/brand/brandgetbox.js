const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.get("/", async (req, res) => {
  const objectId = new mongoose.Types.ObjectId(req.query.id);
  console.log(objectId)
  const data = await brandBox.findOne({
    _id: objectId,
  });
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of affiliates",
      box_details: data,
    });
  } else {
    res.status(200);
    res.json({
      err: "Cannot find box!",
    });
  }
});

module.exports = router;
