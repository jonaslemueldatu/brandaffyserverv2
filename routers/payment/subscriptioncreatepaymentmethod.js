//TEST

const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    console.log(req.query.link);
    let apiKey =
      "xnd_development_NZvxlmIGcBTUDPt65l4IJlj6ZosrwEISS3chz4eS2KXXNojRnIiRTxGMyq47ll:";
    const reusability = await axios.get(
      req.query.link,
      {},
      {
        headers: {
          Authorization: `Basic ${btoa(apiKey + ":")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(reusability.data);
    res.status(200);
    res.json({
      data: reusability.data,
    });
  } catch (error) {
    console.log(`router, ${error.message}`);
  }
});

module.exports = router;
