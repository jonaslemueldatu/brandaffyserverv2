const express = require("express");
const router = express.Router();
const reportsTiktokCampaign = require("../../models/reportsTiktokCampaign");

router.get("/", async (req, res) => {
  let params;
  switch (req.query.report_type) {
    case "daily-data-general":
      params = [
        {
          $match: {
            campaign_id: "64c01434c30d039a01e28087",
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: {
                format: "%m/%d, %H am",
                date: "$create_date",
              },
            },
          },
        },
        {
          $sort: {
            create_date: 1,
          },
        },
        {
          $group: {
            _id: "$date",
            document: {
              $last: "$$ROOT",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: "$document",
          },
        },
        {
          $project: {
            date: 1,
            like_count: 1,
            comment_count: 1,
            share_count: 1,
            view_count: 1,
          },
        },
      ];
      break;
    default:
      break;
  }

  try {
    const data = await reportsTiktokCampaign.aggregate(params);
    if (data) {
      res.status(200);
      res.json({
        msg: "Successfully generater report",
        report_array: data,
      });
    } else {
      res.status(200);
      res.json({
        err: "Cannot get reports",
      });
    }
  } catch (error) {
    console.error("Error during callback:", error.message);
  }
});

module.exports = router;
