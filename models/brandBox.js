const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const brandBoxSchema = new Schema({
  box_label: String,
  box_description: String,
  brand_owner_id: String,
  creator_list: Array,
  create_date: {
    type: Date,
    default: Date.now,
  },
});

const brandBox = mongoose.model("brandBox", brandBoxSchema);

module.exports = brandBox;
