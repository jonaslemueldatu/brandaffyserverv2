const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const campaigns = require("../../models/campaigns");
const affiliateCampaignMap = require("../../models/affiliateCampaignMap");
const affiliateSubscription = require("../../models/affiliateSubscription");

router.post("/", async (req, res) => {
  const ObjectId = new mongoose.Types.ObjectId(req.body.campaign_id);
  const data = await campaigns.findOne({ _id: ObjectId });
  switch (req.body.change_to_status) {
    case "Active":
      if (data) {
        data.status = req.body.change_to_status;
        data.start_date = Date.now();
        await data.save();
        data.affiliate_list_declined = data.affiliate_list_declined.concat(
          data.affiliate_list_invited
        );
        data.affiliate_list_declined = data.affiliate_list_declined.concat(
          data.affiliate_list_applied
        );
        data.affiliate_list_invited = [];
        data.affilaite_list_applied = [];
        await data.save();
        await affiliateCampaignMap.deleteMany({
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
        const usersLinkedCampaign = await affiliateCampaignMap.find({
          campaign_id: req.body.campaign_id,
          relationship_status: "Accepted",
        });
        usersLinkedCampaign.map(async (data) => {
          data.campaign_status = req.body.change_to_status;
          await data.save();
        });
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
        await affiliateCampaignMap.deleteMany({
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
        await affiliateSubscription.updateMany(
          { profile_id: { $in: data.affiliate_list_accepted } },
          {
            $inc: {
              influencer_current_active_campaigns: -1,
            },
          }
        );
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
        const usersLinkedCampaign = await affiliateCampaignMap.find({
          campaign_id: req.body.campaign_id,
        });
        usersLinkedCampaign.map(async (data) => {
          data.campaign_status = req.body.change_to_status;
          await data.save();
        });
        await affiliateSubscription.updateMany(
          { profile_id: { $in: data.affiliate_list_accepted } },
          {
            $inc: {
              influencer_current_active_campaigns: -1,
            },
          }
        );

        res.status(200);
        res.json({
          msg: "Successfully updated campaign",
        });
      }
      break;
    case "Invited":
      if (data) {
        if (
          data.affiliate_list_invited.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User is already invited on this campaign!",
          });
        } else if (
          data.affiliate_list_accepted.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has already accepted this campaign!",
          });
        } else if (
          data.affiliate_list_declined.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has previously declined this campaign!",
          });
        } else if (
          data.affiliate_list_applied.indexOf(req.body.invited_influencer) >= 0
        ) {
          res.status(200);
          res.json({
            err: "User has a pending application to this campaign!",
          });
        } else {
          data.affiliate_list_invited.push(req.body.invited_influencer);
          await data.save();
          let newaffiliateCampaignMap = new affiliateCampaignMap({
            brand_owner_id: req.body.brand_owner_id,
            campaign_id: data._id.toString(),
            affiliate_id: req.body.invited_influencer,
            platform: "Tiktok",
            relationship_status: req.body.change_to_status,
            invite_date: Date.now(),
          });
          await newaffiliateCampaignMap.save();
          res.status(200);
          res.json({
            msg: "Successfully invited influencer to campaign",
          });
        }
      }
      break;
    case "Accepted":
      const isLimit = await affiliateSubscription.findOne({
        profile_id: req.body.accepted_affiliate,
      });

      if (
        isLimit.influencer_current_active_campaigns >=
        isLimit.influencer_active_campaigns
      ) {
        res.status(200);
        res.json({
          err: "Failed to accept campaign. Max accepted campaigns reached",
        });
        return;
      }

      if (data) {
        data.affiliate_list_invited.splice(
          data.affiliate_list_invited.indexOf(req.body.accepted_affiliate, 1)
        );
        data.affiliate_list_accepted.push(req.body.accepted_affiliate);
        await data.save();

        const subLimit = await affiliateSubscription.findOne({
          profile_id: req.body.accepted_affiliate,
        });
        subLimit.influencer_current_active_campaigns++;
        await subLimit.save();

        const data2 = await affiliateCampaignMap.findOne({
          campaign_id: req.body.campaign_id,
          affiliate_id: req.body.accepted_affiliate,
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
        data.affiliate_list_invited.splice(
          data.affiliate_list_invited.indexOf(req.body.declined_affiliate, 1)
        );
        data.affiliate_list_declined.push(req.body.declined_affiliate);
        await data.save();
        await affiliateCampaignMap.deleteOne({
          campaign_id: req.body.campaign_id,
          affiliate_id: req.body.declined_affiliate,
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
