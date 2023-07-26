const { CronJob } = require("cron");
const axios = require("axios");
const socialTiktokCredentials = require("../models/socialTiktokCredentials");
const querystring = require("querystring");

const refreshTiktokToken = new CronJob("0 * * * *", async () => {
  console.log("Fetching nearly expired tokens, timestamp: ", new Date());

  let now = new Date();
  let dt = new Date(now);

  const tokensToRefresh = await socialTiktokCredentials.aggregate([
    {
      $project: {
        refreshToken: "$refresh_token",
        differenceMilli: {
          $subtract: ["$access_expires_in", new Date()],
        },
      },
    },
    {
      $project: {
        refreshToken: 1,
        differenceinhours: {
          $divide: ["$differenceMilli", 1000 * 60 * 60],
        },
      },
    },
    {
      $match: {
        differenceinhours: { $lte: 2 },
      },
    },
  ]);
  if (tokensToRefresh.length > 0) {
    tokensToRefresh.map(async (token) => {
      try {
        console.log("starting");
        const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
        const params = {
          client_key: "aw1wx231u89y4wq3",
          client_secret: "220b6aa55075674137b7a4ab24d9932b",
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
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
        const updateData = await socialTiktokCredentials.findOne({
          _id: token._id,
        });
        if (updateData) {
          updateData.access_token = result.data.access_token;
          updateData.access_expires_in = dt.setDate(now.getDate() + 1);
          updateData.refresh_token = result.data.refresh_token;
          updateData.save();
        }
        console.log("Done");
      } catch (error) {
        console.error("Error during callback:", error.message);
      }
    });
  }
});
module.exports = { refreshTiktokToken };
