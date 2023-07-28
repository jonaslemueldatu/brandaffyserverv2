const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const campaigns = require("../../models/campaigns");
const creatorCampaignMap = require("../../models/creatorCampaignMap");
const creatorSubscription = require("../../models/creatorSubscription");
const brandSubscription = require("../../models/brandSubscription");

router.post("/", async (req, res) => {
  const ObjectId = new mongoose.Types.ObjectId(req.body.campaign_id);
  const data = await campaigns.findOne({ _id: ObjectId });
  switch (req.body.change_to_status) {
    case "Active":
      if (data) {
        const brandSubs = await brandSubscription.findOne({
          profile_id: req.body.brand_owner_id,
        });
        if (
          brandSubs.brand_current_active_campaigns >=
          brandSubs.brand_active_campaigns
        ) {
          res.status(200);
          res.json({
            err: "Plan limit reached! Upgrade plan or wait for campaigns to end",
          });
          return;
        }
        data.status = req.body.change_to_status;
        data.start_date = Date.now();
        await data.save();
        data.creator_list_declined = data.creator_list_declined.concat(
          data.creator_list_invited
        );
        data.creator_list_declined = data.creator_list_declined.concat(
          data.creator_list_applied
        );
        data.creator_list_invited = [];
        data.affilaite_list_applied = [];
        await data.save();
        await creatorCampaignMap.deleteMany({
          $and: [
            { campaign_id: req.body.campaign_id },
            {
              $or: [
                { relationship_status: "Invited" },
                { relationship_status: "Applied" },
              ],
            },
          ],
        });
        const usersLinkedCampaign = await creatorCampaignMap.find({
          campaign_id: req.body.campaign_id,
          relationship_status: "Accepted",
        });
        usersLinkedCampaign.map(async (data) => {
          data.campaign_status = req.body.change_to_status;
          await data.save();
        });
        await brandSubscription.updateOne(
          {
            profile_id: req.body.brand_owner_id,
          },
          { $inc: { brand_current_active_campaigns: 1 } }
        );
        res.status(200);
        res.json({
          msg: "Successfully updated campaign",
        });
      }
      break;
    case "Cancelled":
      if (data) {
        data.status = req.body.change_to_status;
        data.cancelled_date = Date.now();
        await data.save();
        await creatorCampaignMap.deleteMany({
          $and: [
            { campaign_id: req.body.campaign_id },
            {
              $or: [
                { relationship_status: "Invited" },
                { relationship_status: "Applied" },
                { relationship_status: "Accepted" },
              ],
            },
          ],
        });
        res.status(200);
        res.json({
          msg: "Successfully updated campaign",
        });
      }
      break;
    case "Ended":
      if (data) {
        data.status = req.body.change_to_status;
        data.end_date = Date.now();
        await data.save();
        const usersLinkedCampaign = await creatorCampaignMap.find({
          campaign_id: req.body.campaign_id,
        });
        usersLinkedCampaign.map(async (data) => {
          data.campaign_status = req.body.change_to_status;
          await data.save();
        });
        await brandSubscription.updateOne(
          {
            profile_id: req.body.brand_owner_id,
          },
          { $inc: { brand_current_active_campaigns: -1 } }
        );
        res.status(200);
        res.json({
          msg: "Successfully updated campaign",
        });
      }
      break;
    case "Invited":
      if (data) {
        if (data.creator_list_invited.indexOf(req.body.invited_creator) >= 0) {
          res.status(200);
          res.json({
            err: "User is already invited on this campaign!",
          });
        } else if (
          data.creator_list_accepted.indexOf(req.body.invited_creator) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has already accepted this campaign!",
          });
        } else if (
          data.creator_list_declined.indexOf(req.body.invited_creator) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has previously declined this campaign!",
          });
        } else if (
          data.creator_list_applied.indexOf(req.body.invited_creator) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has a pending application to this campaign!",
          });
        } else {
          data.creator_list_invited.push(req.body.invited_creator);
          await data.save();
          let newcreatorCampaignMap = new creatorCampaignMap({
            brand_owner_id: req.body.brand_owner_id,
            campaign_id: data._id.toString(),
            creator_id: req.body.invited_creator,
            platform: "Tiktok",
            relationship_status: req.body.change_to_status,
            invite_date: Date.now(),
          });
          await newcreatorCampaignMap.save();
          res.status(200);
          res.json({
            msg: "Successfully invited creator to campaign",
          });
        }
      }
      break;
    case "Accepted":
      const isLimit = await creatorSubscription.findOne({
        profile_id: req.body.accepted_creator,
      });

      if (data) {
        data.creator_list_invited.splice(
          data.creator_list_invited.indexOf(req.body.accepted_creator, 1)
        );
        data.creator_list_accepted.push(req.body.accepted_creator);
        await data.save();

        const data2 = await creatorCampaignMap.findOne({
          campaign_id: req.body.campaign_id,
          creator_id: req.body.accepted_creator,
        });
        if (data2) {
          data2.accept_date = Date.now();
          data2.relationship_status = "Accepted";
          await data2.save();
          res.status(200);
          res.json({
            msg: "Successfully Accepted the invitation",
          });
        }
      }
      break;
    case "Declined":
      if (data) {
        data.creator_list_invited.splice(
          data.creator_list_invited.indexOf(req.body.declined_creator, 1)
        );
        data.creator_list_declined.push(req.body.declined_creator);
        await data.save();
        await creatorCampaignMap.deleteOne({
          campaign_id: req.body.campaign_id,
          creator_id: req.body.declined_creator,
        });
        res.status(200);
        res.json({
          msg: "Successfully Declined the invitation",
        });
      }
      break;
    default:
      res.status(200);
      res.json({
        err: "Failed to update campaign",
      });
      break;
  }
});

module.exports = router;
