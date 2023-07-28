const mongoose = require("mongoose");

let dt = new Date();
let dtDay = dt.setDate(dt.getDate() + 1);
let dtYear = dt.setDate(dt.getDate() + 365);

const Schema = mongoose.Schema;
const socialTiktokCredentialsSchema = new Schema({
  user_id: String,
  open_id: String,
  access_token: String,
  access_expires_in: {
    type: Date,
    default: dtDay,
  },
  refresh_token: String,
  refresh_expires_in: {
    type: Date,
    default: dtYear,
  },
  access_last_refresh: Date,
  linked_date: {
    type: Date,
    default: Date.now,
  },
  token_type: {
    type: String,
    default: "Bearer",
  },
});

const socialTiktokCredentials = mongoose.model('socialTiktokCredentials', socialTiktokCredentialsSchema)

module.exports = socialTiktokCredentials;
