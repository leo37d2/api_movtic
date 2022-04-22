const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    name_vi: { type: String, required: true, unique: true },
    name_en: { type: String },
    img: { type: String, required: true },
    point: [Number],
    language: [String],
    ticket_price: [
      {
        experience: String,
        price: Number,
      },
    ],
    genre: [String],
    year: Number,
    date: [Date],
    city: [String],
    state: String,
    description: String,
    singer_actor_id: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
