const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");
const brandSubscription = require("../../models/brandSubscription");

router.post("/", async (req, res) => {
  const objectId = new mongoose.Types.ObjectId(req.body.box_id);
  const data = await brandBox.deleteOne({ _id: objectId });
  await brandSubscription.updateOne(
    {
      profile_id: req.body.brand_owner,
    },
    { $inc: { brand_current_active_boxes: -1 } }
  );
  res.status(200);
  res.json({
    msg: "Successfully deleted box!",
  });
});

module.exports = router;
