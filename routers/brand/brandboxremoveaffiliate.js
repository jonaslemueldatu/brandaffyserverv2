const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
    console.log(req.body.id)
  const objectId = new mongoose.Types.ObjectId(req.body.boxId);
  const data = await brandBox.findOne({ _id: objectId });
  await data.affiliate_list.splice(
    data.affiliate_list.indexOf(req.body.id),
    1
  );
  await data.save();
  res.status(200);
  res.json({
    msg: "Successfully deleted box!",
  });
});

module.exports = router;
