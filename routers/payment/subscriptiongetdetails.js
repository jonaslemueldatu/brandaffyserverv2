const express = require("express");
const router = express.Router();
const brandSubscription = require("../../models/brandSubscription");

router.get("/", async (req, res) => {
  try {
    switch (req.query.user_type) {
      case "Brand":
        const brandSubs= await brandSubscription.aggregate([
          {
            $match: {
              profile_id: req.query.profile_id,
            },
          },
        ]);
        if (brandSubs) {
          res.status(200);
          res.json({
            msg: "Successfully got subscription details",
            subscription_data: brandSubs,
          });
        } else {
          res.status(200);
          res.json({
            err: "Failed to get subscription data",
          });
        }
        break;
      case "Affiliate":
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
