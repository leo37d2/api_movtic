const mongoose = require("mongoose");

const SingerActorSchema = new mongoose.Schema({
  sa_name: { type: String, required: true, unique: true },
  about: { type: String },
  avatar: { type: String, required: true },
});

module.exports = mongoose.model("Singer_actor", SingerActorSchema);
