const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.get("/", async (req, res) => {
  //Get box details
  const objectId = new mongoose.Types.ObjectId(req.query.box_id);
  const data = await brandBox.findOne({
    _id: objectId,
  });
  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully got Box info",
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
