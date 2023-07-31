const express = require("express");
const router = express.Router();
const creatorProfile = require("../../models/creatorProfile");

router.get("/", async (req, res) => {
  //Apply search on list of Creators
  const search = req.query.search || "";
  const data = await creatorProfile.aggregate([
    {
      $match: {
        $or: [
          {
            first_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            last_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
          {
            occupation: {
              $regex: search,
              $options: "i",
            },
          },
          {
            niche: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
    },
    {
      $sort: {
        social_tiktok_follower_count: -1,
      },
    },
    {
      $skip: parseInt(req.query.page) * parseInt(req.query.limit),
    },
    {
      $limit: parseInt(req.query.limit),
    },
  ]);

  //Get total number for pagination
  const totalProfile = await creatorProfile.aggregate([
    {
      $match: {
        $or: [
          {
            first_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            last_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
          {
            occupation: {
              $regex: search,
              $options: "i",
            },
          },
          {
            niche: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
    },
    {
      $count: "Total",
    },
  ]);

  if (data) {
    res.status(200);
    res.json({
      msg: "Successfully pulled list of creators",
      creator_list: data,
      total: totalProfile.length > 0 ? totalProfile[0].Total : 0,
    });
  }
});

module.exports = router;
