const express = require("express");
const router = express.Router();
const brandBox = require("../../models/brandBox");

router.get("/", async (req, res) => {
  try {
    //Get box list
    const data = await brandBox.find(req.query);
    if (data.length !== 0) {
      res.status(200);
      res.json({
        msg: "Successfully pulled list of boxes",
        brandbox_list: data,
      });
    } else {
      res.status(200);
      res.json({
        err: "No Boxes created for this user",
      });
    }
  } catch (error) {
    console.log(`boxgetlist.js, ${error}`);
  }
});

module.exports = router;
