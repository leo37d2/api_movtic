const mongoose = require("mongoose");

const SportSchema = new mongoose.Schema(
  {
    sport_name: { type: String, required: true },
    date: Date,
    categories: String,
    city: String,
    state: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sport", SportSchema);
