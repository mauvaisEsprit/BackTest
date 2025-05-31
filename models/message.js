const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  locale: { type: String, default: "fr" },
  name: String,
  email: String,
  phone: String,
  message: String,
  replied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema, "messages");
