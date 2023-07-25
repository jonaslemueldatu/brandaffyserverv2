const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("querystring");
const socialTiktokCredentials = require("../../models/socialTiktokCredentials");

router.post("/", async (req, res) => {
  try {
    console.log(req.body.code)
    console.log(req.body.user_id)
    const { code } = req.body.code;
    const decode = decodeURI(code);
    const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
    const params = {
      client_key: "aw1wx231u89y4wq3",
      client_secret: "220b6aa55075674137b7a4ab24d9932b",
      code: decode,
      grant_type: "authorization_code",
      redirect_uri: "https://www.brandaffy.com/dashboard/profile/",
    };
    const result = await axios.post(
      tokenEndpoint,
      querystring.stringify(params),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      }
    );
    if (result.data.access_token) {
      const newSocialTiktokCredentials = new socialTiktokCredentials({
        user_id: req.body.user_id,
        open_id: result.data.open_id,
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
      });

      await newSocialTiktokCredentials.save();
    }

    console.log(result.data);
    res.status(200);
    res.json({
      msg: "Successfully connected Tiktok account",
    });
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
