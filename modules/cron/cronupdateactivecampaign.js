const { CronJob } = require("cron");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");
const campaignTiktokVideoMap = require("../../models/campaignTiktokVideoMap");
const reportsTiktokCampaign = require("../../models/reportsTiktokCampaign");
const axios = require("axios");

const updateTiktokVideos = new CronJob("0 * * * *", async () => {
  console.log("Updating active Video listing, timestamp: ", new Date());

  const data = await affiliateCampaignMap.aggregate([
    {
      $match: { campaign_status: "Active" },
    },
    {
      $project: {
        affiliate_id: 1,
        campaign_id: 1,
        video_list: 1,
      },
    },
    {
      $match: {
        $expr: {
          $gte: [
            {
              $size: {
                $ifNull: ["$video_list", []],
              },
            },
            1,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "socialtiktokcredentials",
        let: {
          searchId: "$affiliate_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$user_id", "$$searchId"],
              },
            },
          },
          {
            $project: {
              access_token: 1,
            },
          },
        ],
        as: "access_token",
      },
    },
  ]);
  if (data.length > 0) {
    const vidqueryEndpoint =
      "https://open.tiktokapis.com/v2/video/query/?fields=id,like_count,comment_count,share_count,view_count";
    await data.map(async (affiliateCampaign) => {
      try {
        const access_token = `Bearer ${affiliateCampaign.access_token[0].access_token}`;
        const result = await axios.post(
          vidqueryEndpoint,
          {
            filters: {
              video_ids: affiliateCampaign.video_list,
            },
          },
          {
            headers: {
              Authorization: access_token,
              "Content-Type": "application/json",
            },
          }
        );
        if (result) {
          result.data.data.videos.map(async (videos) => {
            const campaignTiktok = await campaignTiktokVideoMap.findOne({
              campaign_id: affiliateCampaign.campaign_id,
              video_id: videos.id,
            });
            const newReportsTiktokCampaign = new reportsTiktokCampaign({
              campaign_id: affiliateCampaign.campaign_id,
              video_id: videos.id,
              like_count: videos.like_count,
              comment_count: videos.comment_count,
              share_count: videos.share_count,
              view_count: videos.view_count,
              like_count_diff: videos.like_count - campaignTiktok.like_count,
              comment_count_diff:
                videos.comment_count - campaignTiktok.comment_count,
              share_count_diff: videos.share_count - campaignTiktok.share_count,
              view_count_diff: videos.view_count - campaignTiktok.view_count,
              create_date: new Date(),
            });
            await newReportsTiktokCampaign.save();

            (campaignTiktok.like_count = videos.like_count),
              (campaignTiktok.comment_count = videos.comment_count),
              (campaignTiktok.share_count = videos.share_count),
              (campaignTiktok.view_count = videos.view_count),
              await campaignTiktok.save();
          });
        } else {
          console.log("Failed to get data");
        }
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    console.log("No data to update");
  }
});

module.exports = { updateTiktokVideos };
