const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    event_name: { type: String, required: true },
    categories: String,
    date: [Date],
    city: [String],
    state: String,
    singer_actor_id: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
