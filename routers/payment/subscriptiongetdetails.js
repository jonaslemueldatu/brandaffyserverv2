const express = require("express");
const router = express.Router();

//Model Imports
const brandSubscription = require("../../models/brandSubscription");

//Module Imports
const { checkPlanActive } = require("../../modules/mongoose/checkplanactive");

router.get("/", async (req, res) => {
  try {
    //Check if plan is still Active
    const isPlanActive = await checkPlanActive(
      req.query.user_type,
      req.query.brand_profile_id
    );

    //Can be Brand or Affiliate
    switch (req.query.user_type) {
      case "Brand":
        const brandSubs = await brandSubscription.findOne({
          brand_profile_id: req.query.brand_profile_id,
        });
        if (brandSubs) {
          res.status(200);
          res.json({
            msg: "Successfully got subscription details",
            subscription_data: brandSubs,
            is_plan_active: isPlanActive,
          });
        } else {
          res.status(200);
          res.json({
            err: "Failed to get subscription data",
            is_plan_active: isPlanActive,
          });
        }
        break;
      case "Creator":
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(`subscriptiongetdetails.js router, ${error}`);
  }
});

module.exports = router;
