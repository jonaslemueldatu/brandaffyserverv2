const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.body.box_id);
    const data = await brandBox.findOne({ _id: objectId });
    //Check if creator is already in the box
    if (data.creator_list.indexOf(req.body.id) >= 0) {
      res.status(200);
      res.json({
        err: "Creator is already in the box!",
      });
      return;
    }
    //Add creator in the box array
    await data.creator_list.push(req.body.id);
    await data.save();
    res.status(200);
    res.json({
      msg: "Successfully added creator into box!",
    });
  } catch (error) {
    console.log(`boxaddcreator.js, ${error}`);
  }
});

module.exports = router;
