//TEST

const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    // let apiKey =
    //   "xnd_development_NZvxlmIGcBTUDPt65l4IJlj6ZosrwEISS3chz4eS2KXXNojRnIiRTxGMyq47ll:";
    // const reusability = await axios.get(
    //   req.query.link,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Basic ${btoa(apiKey + ":")}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // console.log(reusability.data);
    // res.status(200);
    // res.json({
    //   data: reusability.data,
    // });
    res.send("Hello World")
  } catch (error) {
    console.log(`router, ${error.message}`);
  }
});

module.exports = router;
