const dotEnv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { refreshTiktokToken } = require("./modules/cronrefreshtiktoktoken");
const { updateTiktokVideos } = require("./modules/cronupdateactivecampaign");

const app = express();

const BrandCreateBoxRoute = require("./routers/dashboard/boxcreate");
const BrandDeleteBoxRoute = require("./routers/dashboard/boxdelete");
const GetboxRoute = require("./routers/dashboard/boxgetdetails");
const BrandRemoveAffiliateRoute = require("./routers/dashboard/boxremoveaffiliate");
const BrandAddAffiliateRoute = require("./routers/dashboard/boxaddaffiliate");
const GetboxlistRoute = require("./routers/dashboard/boxgetlist");

const CampaigncreateRoute = require("./routers/dashboard/campaigncreate");
const CampaigngetlistRoute = require("./routers/dashboard/campaigngetlist");
const CampaigngetlistaggregateRoute = require("./routers/dashboard/campaigngetaffiliatelist");
const CampaignupdateRoute = require("./routers/dashboard/campaignupdate");
const CampaigngetdetailsRoute = require("./routers/dashboard/campaigngetdetails");
const CampaignlinkvideoRoute = require("./routers/dashboard/campaignlinkvideo");
const CampaignunlinkvideoRoute = require("./routers/dashboard/campaignunlinkvideo");
const CampaigngetvideolistRoute = require("./routers/dashboard/campaigngetvideolist");

const CampaigngetreportRoute = require("./routers/dashboard/campaigngetreport")

const UpdateprofileRoute = require("./routers/dashboard/profileupdate");
const GetprofileRoute = require("./routers/dashboard/profilegetdetails");
const GetaffiliatelistRoute = require("./routers/dashboard/profilegetlist");

const AffiliateLoginRoute = require("./routers/accounts/affiliatelogin");
const AffiliateregisterRoute = require("./routers/accounts/affiliateregister");
const BrandloginRoute = require("./routers/accounts/brandlogin");
const BrandregisterRoute = require("./routers/accounts/brandregister");
const LogoutRoute = require("./routers/accounts/logout");

const GettiktoktokenRoute = require("./routers/social/socialgettiktoktoken");
const GettiktokprofileRoute = require("./routers/social/socialgettiktokdata");
const GettiktokvideolistRoute = require("./routers/social/socialgettiktokvideolist");

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
app.use("/api/box/removeaffiliate", BrandRemoveAffiliateRoute);
app.use("/api/box/addaffiliate", BrandAddAffiliateRoute);
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
app.use("/api/profile/getlist", GetaffiliatelistRoute);

app.use("/api/affiliate/login", AffiliateLoginRoute);
app.use("/api/affiliate/register", AffiliateregisterRoute);
app.use("/api/brand/login", BrandloginRoute);
app.use("/api/brand/register", BrandregisterRoute);
app.use("/api/logout", LogoutRoute);

app.use("/api/tiktokaccesstoken", GettiktoktokenRoute);
app.use("/api/tiktok/profile", GettiktokprofileRoute);
app.use("/api/tiktok/getvideolist", GettiktokvideolistRoute);

app.listen(process.env.SERVER_PORT, () =>
  console.log(`App is now running at ${process.env.SERVER_PORT}!`)
);

//Cron Jobs
refreshTiktokToken.start();
updateTiktokVideos.start();
