const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
  const objectId = new mongoose.Types.ObjectId(req.body.box_id);
  const data = await brandBox.deleteOne({ _id: objectId });
  res.status(200);
  res.json({
    msg: "Successfully deleted box!",
  });
});

module.exports = router;
