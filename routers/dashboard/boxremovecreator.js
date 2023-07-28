const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const brandBox = require("../../models/brandBox");

router.post("/", async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.body.box_Id);
    //Look for box with the creator ID
    const data = await brandBox.findOne({ _id: objectId });
    //Remove creator from the box' creator array
    await data.creator_list.splice(
      data.creator_list.indexOf(req.body.creator_to_remove),
      1
    );
    await data.save();
    res.status(200);
    res.json({
      msg: "Successfully deleted box!",
    });
  } catch (error) {
    console.log(`boxremovecreator.js, ${error}`);
  }
});

module.exports = router;
