const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("querystring");
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");

router.get("/", async (req, res) => {
  const params = req.query;
  try {
    const credentials = await socialTiktokCredentials.findOne(
      req.query,
      "access_token"
    );
    if (!credentials) {
      return;
    }
    const vidlistEndpoint =
      "https://open.tiktokapis.com/v2/video/list/?fields=id,title";
    const result = await axios.post(
      vidlistEndpoint,
      {
        max_count: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (result) {
      res.status(200);
      res.json({
        msg: "Successfully acquired video list",
        video_list: result.data.data,
      });
    } else {
      res.status(200);
      res.json({
        err: "Failed to get public video list",
      });
    }
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
