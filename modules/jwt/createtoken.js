const jwt = require("jsonwebtoken");

const createJWTToken = async (user_id) => {
  try {
    const token = await jwt.sign(
      { user_id: user_id },
      process.env.JSON_WEB_TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    console.log(`createtoken.js module ${error}`);
  }
};

exports.createJWTToken = createJWTToken;
