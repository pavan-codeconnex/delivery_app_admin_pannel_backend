const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
  password: { type: String },
  role: { type: String ,enum:["store_owner","staff","delivery_guy"]},
  createdDate: { type: Number },
  updatedDate: { type: Number },
});

User = module.exports = mongoose.model("User", userSchema);
