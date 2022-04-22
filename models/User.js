const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null,required: true, unique: true},
    password: { type: String, required: true },
    avatar_url: {
      type: String,
      default: "https://pic.onlinewebfonts.com/svg/img_550783.png",
    },
    isUser: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
