const express = require("express");
const router = express.Router();

//Model Imports
const brandBox = require("../../models/brandBox");
const brandSubscription = require("../../models/brandSubscription");

router.post("/", async (req, res) => {
  try {
    //Check for Duplicate
    const brandBoxDuplicate = await brandBox.findOne({
      box_label: req.body.box_label,
      brand_owner_id: req.body.brand_owner_id,
    });
    if (brandBoxDuplicate) {
      res.status(200);
      res.json({
        err: "Label already exists!",
      });
      return;
    }

    //Create new BrandBox
    const newbrandBox = new brandBox({
      box_label: req.body.box_label,
      box_description: req.body.box_description,
      brand_owner_id: req.body.brand_owner_id,
    });

    //Update brandSubcription to add active box
    await brandSubscription.updateOne(
      {
        brand_profile_id: req.body.brand_owner_id,
      },
      { $inc: { plan_current_active_boxes: 1 } }
    );

    //Save Documents
    await newbrandBox.save();

    res.status(200);
    res.json({
      msg: "Box successfully created!",
    });
  } catch (error) {
    console.log(`boxcreate.js, ${error}`);
  }
});

module.exports = router;
