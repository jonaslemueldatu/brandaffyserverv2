const dotEnv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const BrandCreateBoxRoute = require("./routers/brand/brandcreatebox");
const BrandDeleteBoxRoute = require("./routers/brand/branddeletebox");
const GetboxRoute = require("./routers/brand/brandgetbox");
const BrandRemoveAffiliateRoute = require("./routers/brand/brandboxremoveaffiliate");
const BrandAddAffiliateRoute = require("./routers/brand/brandboxaddaffiliate");
const GetboxlistRoute = require("./routers/brand/getboxlist");

const CampaigncreateRoute = require("./routers/brand/campaigncreate")

const UpdateprofileRoute = require("./routers/updateprofile");
const GetprofileRoute = require("./routers/getprofile");
const GetaffiliatelistRoute = require("./routers/getaffiliatelist");

const AffiliateLoginRoute = require("./routers/affiliate/affiliatelogin");
const AffiliateregisterRoute = require("./routers/affiliate/affiliateregister");
const BrandloginRoute = require("./routers/brand/brandlogin");
const BrandregisterRoute = require("./routers/brand/brandregister");
const LogoutRoute = require("./routers/logout");

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

app.use("/api/brand/box/create", BrandCreateBoxRoute);
app.use("/api/brand/box/delete", BrandDeleteBoxRoute);
app.use("/api/brand/box/getbox", GetboxRoute);
app.use("/api/brand/box/removeaffiliate", BrandRemoveAffiliateRoute);
app.use("/api/brand/box/addaffiliate", BrandAddAffiliateRoute);
app.use("/api/brand/box/getlist", GetboxlistRoute);

app.use("/api/brand/campaign/create", CampaigncreateRoute)

app.use("/api/updateprofile", UpdateprofileRoute);
app.use("/api/getprofile", GetprofileRoute);
app.use("/api/affiliate/getlist", GetaffiliatelistRoute);

app.use("/api/affiliate/login", AffiliateLoginRoute);
app.use("/api/affiliate/register", AffiliateregisterRoute);
app.use("/api/brand/login", BrandloginRoute);
app.use("/api/brand/register", BrandregisterRoute);
app.use("/api/logout", LogoutRoute);

app.listen(process.env.SERVER_PORT, () =>
  console.log(`App is now running at ${process.env.SERVER_PORT}!`)
);
