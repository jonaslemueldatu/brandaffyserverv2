const dotEnv = require("dotenv").config();
const axios = require("axios");

const createXenditCustomer = async (
  user_type,
  user_email,
  business_name,
  profile_id,
  business_type,
  first_name,
  last_name
) => {
  try {
    let apiKey = process.env.XENDIT_API_KEY;
    let url = "https://api.xendit.co/customers";
    let reqBody;

    switch (user_type) {
      case "Brand":
        reqBody = JSON.stringify({
          reference_id: profile_id,
          type: "BUSINESS",
          business_detail: {
            business_name: business_name,
            business_type: business_type,
          },
          email: user_email,
        });
        break;
      case "Creator":
        reqBody = JSON.stringify({
          reference_id: profile_id,
          type: "INDIVIDUAL",
          individual_detail: {
            given_names: first_name,
            surname: last_name,
          },
          email: user_email,
        });
        break;
      default:
    }
    const xenditCustomer = await axios.post(url, reqBody, {
      headers: {
        Authorization: `Basic ${btoa(apiKey + ":")}`,
        "Content-Type": "application/json",
      },
    });

    return xenditCustomer.data;
  } catch (error) {
    console.log(`customercreate.js module ${error}`);
  }
};

exports.createXenditCustomer = createXenditCustomer;
