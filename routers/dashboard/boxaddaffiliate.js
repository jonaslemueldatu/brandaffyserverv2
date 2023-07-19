const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
  const objectId = new mongoose.Types.ObjectId(req.body.box_id);
  const data = await brandBox.findOne({ _id: objectId });
  if (data.affiliate_list.indexOf(req.body.id) >= 0) {
    res.status(200);
    res.json({
      err: "Influencer is already in the box!",
    });
  } else {
    await data.affiliate_list.push(req.body.id);
    await data.save();
    res.status(200);
    res.json({
      msg: "Successfully added affiliate into box!",
    });
  }
});

module.exports = router;
