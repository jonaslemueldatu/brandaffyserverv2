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
            campaign_id: req.query.campaign_id,
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$create_date",
              },
            },
          },
        },
        {
          $sort: {
            create_date: -1,
          },
        },
        {
          $group: {
            _id: {
              date: "$date",
              uniqueId: "$video_id",
            },
            document: {
              $first: "$$ROOT",
            },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            views: {
              $sum: "$document.view_count",
            },
            likes: {
              $sum: "$document.like_count",
            },
            comments: {
              $sum: "$document.comment_count",
            },
            shares: {
              $sum: "$document.share_count",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: 15,
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
        msg: "Successfully generated report",
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
