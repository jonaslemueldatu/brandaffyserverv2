const dotEnv = require("dotenv").config();
const axios = require("axios");

const createXenditCustomer = async (type, email, brandName, profile_id) => {
  try {
    let apiKey = process.env.XENDIT_API_KEY;
    let url = "https://api.xendit.co/customers";

    let reqBody;

    switch (type) {
      case "Brand":
        reqBody = JSON.stringify({
          reference_id: profile_id,
          type: "BUSINESS",
          business_detail: {
            business_name: brandName,
            business_type: "CORPORATION",
          },
          email: email,
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
    console.log(`customercreate.js ${error}`);
  }
};

exports.createXenditCustomer = createXenditCustomer;
