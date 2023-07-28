//Model Imports
const brandSubscription = require("../../models/brandSubscription");
const creatorSubscription = require("../../models/creatorSubscription");

const checkPlanActive = async (user_type, user_id) => {
  try {
    console.log(user_type, user_id)
    let isPlanActive;
    switch (user_type) {
      case "Brand":
        isPlanActive = await brandSubscription.findOne(
          {
            brand_profile_id: user_id,
          },
          "plan_active plan_expiration_date"
        );
        break;
      case "Creator":
        isPlanActive = await creatorSubscription.findOne(
          {
            creator_profile_id: user_id,
          },
          "plan_active plan_expiration_date"
        );
        break;
      default:
        break;
    }
    // Check if expiration date has lapsed then update planActive status
    if (isPlanActive.plan_expiration_date != null && isPlanActive.plan_expiration_date <= new Date()) {
      isPlanActive.plan_active = false;
      isPlanActive.save();
    }

    return isPlanActive.plan_active;
  } catch (error) {
    console.log(`checkplanactive.js module, ${error}`);
  }
};

exports.checkPlanActive = checkPlanActive;
