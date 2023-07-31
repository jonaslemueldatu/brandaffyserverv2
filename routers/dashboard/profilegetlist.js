const express = require("express");
const router = express.Router();
const creatorProfile = require("../../models/creatorProfile");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    //Apply search on list of Creators
    const search = req.query.search;

    let matchStage = {
      $match: {
        $and: [
          {
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
        ],
      },
    };

    if (req.query.list && Array.isArray(req.query.list)) {
      const objectIdList = await req.query.list.map(function (id) {
        return new mongoose.Types.ObjectId(id);
      });

      matchStage.$match.$and.unshift({
        _id: {
          $in: objectIdList,
        },
      });
    }

    const data = await creatorProfile.aggregate([
      matchStage,
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
  } catch (error) {
    console.log(`profilegetlist.js, ${error}`);
  }
});

module.exports = router;
