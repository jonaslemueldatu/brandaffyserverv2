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
      "https://open.tiktokapis.com/v2/video/list/?fields=cover_image_url,id,title";

    console.log(credentials);
    console.log(`Bearer ${credentials.access_token}`);
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
    console.log(result);
    console.log(result.data);
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
