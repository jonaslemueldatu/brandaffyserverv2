const dotEnv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { refreshTiktokToken } = require("./modules/cron/cronrefreshtiktoktoken");
const {
  updateTiktokVideos,
} = require("./modules/cron/cronupdateactivecampaign");

const app = express();

const BrandCreateBoxRoute = require("./routers/dashboard/boxcreate");
const BrandDeleteBoxRoute = require("./routers/dashboard/boxdelete");
const GetboxRoute = require("./routers/dashboard/boxgetdetails");
const BrandRemoveCreatorRoute = require("./routers/dashboard/boxremovecreator");
const BrandAddCreatorRoute = require("./routers/dashboard/boxaddcreator");
const GetboxlistRoute = require("./routers/dashboard/boxgetlist");

const CampaigncreateRoute = require("./routers/dashboard/campaigncreate");
const CampaigngetlistRoute = require("./routers/dashboard/campaigngetlist");
const CampaigngetlistaggregateRoute = require("./routers/dashboard/campaigngetcreatorlist");
const CampaignupdateRoute = require("./routers/dashboard/campaignupdate");
const CampaigngetdetailsRoute = require("./routers/dashboard/campaigngetdetails");
const CampaignlinkvideoRoute = require("./routers/dashboard/campaignlinkvideo");
const CampaignunlinkvideoRoute = require("./routers/dashboard/campaignunlinkvideo");
const CampaigngetvideolistRoute = require("./routers/dashboard/campaigngetvideolist");

const CampaigngetreportRoute = require("./routers/dashboard/campaigngetreport");

const UpdateprofileRoute = require("./routers/dashboard/profileupdate");
const GetprofileRoute = require("./routers/dashboard/profilegetdetails");
const GetcreatorlistRoute = require("./routers/dashboard/profilegetlist");

const CreatorLoginRoute = require("./routers/accounts/creatorlogin");
const CreatorregisterRoute = require("./routers/accounts/creatorregister");
const BrandloginRoute = require("./routers/accounts/brandlogin");
const BrandregisterRoute = require("./routers/accounts/brandregister");
const LogoutRoute = require("./routers/accounts/logout");

const GettiktoktokenRoute = require("./routers/social/socialgettiktoktoken");
const GettiktokprofileRoute = require("./routers/social/socialgettiktokdata");
const GettiktokvideolistRoute = require("./routers/social/socialgettiktokvideolist");

const SubscriptiongetdetailsRouter = require("./routers/payment/subscriptiongetdetails");
const Subscriptionpaymentcreatemethod = require("./routers/payment/subscriptioncreatepaymentmethod");

// Webhook
const CallbackpaymentmethodRouter = require("./webhooks/xenditpaymentmethodcallback");


mongoose.connect(
  process.env.MONGO_DB_URI,
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB has been connected");
});

function logger(req, res, next) {
  console.log(`[${Date.now()}] ${req.method} ${req.url} `);
  next();
}

app.use(logger);
app.use(
  cors({
    origin: `${process.env.CORS_ACCESS_HEADER_ORIGIN}`,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/box/create", BrandCreateBoxRoute);
app.use("/api/box/delete", BrandDeleteBoxRoute);
app.use("/api/box/getbox", GetboxRoute);
app.use("/api/box/removecreator", BrandRemoveCreatorRoute);
app.use("/api/box/addcreator", BrandAddCreatorRoute);
app.use("/api/box/getlist", GetboxlistRoute);

app.use("/api/campaign/create", CampaigncreateRoute);
app.use("/api/campaign/getlist", CampaigngetlistRoute);
app.use("/api/campaign/getlistaggregate", CampaigngetlistaggregateRoute);
app.use("/api/campaign/update", CampaignupdateRoute);
app.use("/api/campaign/getdetails", CampaigngetdetailsRoute);
app.use("/api/campaign/linkvideo", CampaignlinkvideoRoute);
app.use("/api/campaign/unlinkvideo", CampaignunlinkvideoRoute);
app.use("/api/campaign/getvideolist", CampaigngetvideolistRoute);

app.use("/api/campaign/getreport", CampaigngetreportRoute);

app.use("/api/profile/update", UpdateprofileRoute);
app.use("/api/profile/get", GetprofileRoute);
app.use("/api/profile/getlist", GetcreatorlistRoute);

app.use("/api/creator/login", CreatorLoginRoute);
app.use("/api/creator/register", CreatorregisterRoute);
app.use("/api/brand/login", BrandloginRoute);
app.use("/api/brand/register", BrandregisterRoute);
app.use("/api/logout", LogoutRoute);

app.use("/api/tiktokaccesstoken", GettiktoktokenRoute);
app.use("/api/tiktok/profile", GettiktokprofileRoute);
app.use("/api/tiktok/getvideolist", GettiktokvideolistRoute);

app.use("/api/subscription/getdetails", SubscriptiongetdetailsRouter);
app.use("/api/subscription/createmethod", Subscriptionpaymentcreatemethod)

// Webhooks
app.use(
  "/api/callback/paymentmethod",
  CallbackpaymentmethodRouter
);

app.listen(process.env.SERVER_PORT, () =>
  console.log(`App is now running at ${process.env.SERVER_PORT}!`)
);

//Cron Jobs
refreshTiktokToken.start();
updateTiktokVideos.start();
