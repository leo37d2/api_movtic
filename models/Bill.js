const mongoose = require("mongoose");

const BillBookedSchema = new mongoose.Schema({
  user_id: { type: String, required: true},
  type: String,
  product_id: String,
  price: Number,
  ticket_quantity: Number,
  seat: [String],
  food_id: String,
  food_quantity: Number,
  total: Number,
},
  { timestamps: true}
);

module.exports = mongoose.model("Bill", BillBookedSchema);
