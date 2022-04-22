const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  price: { type: Number },
  sale: { type: Number },
});

module.exports = mongoose.model("Food", FoodSchema);
