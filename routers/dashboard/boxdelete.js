const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");
const brandSubscription = require("../../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.body.box_id);
    await brandBox.deleteOne({ _id: objectId });
    await brandSubscription.updateOne(
      {
        brand_profile_id: req.body.brand_owner,
      },
      { $inc: { plan_current_active_boxes: -1 } }
    );
    res.status(200);
    res.json({
      msg: "Successfully deleted box!",
    });
  } catch (error) {
    console.log(`boxdelete.js, ${error}`);
  }
});

module.exports = router;
