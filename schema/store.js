const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  storeId: { type: String },
  name: { type: String },
  description: { type: String },
  storeImage: { type: Array },
  defaultRating: { type: Number, default: 0 },
  address: { type: String },
  pincode: { type: Number },
  landmark: { type: String },
  loc: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  licenseCode: { type: String },
  storeCharge: { type: Number },
  deliveryType: { type: String },
  deliveryRadius: { type: Number },
  deliveryChargeType: { type: Number },
  fixedCharge: { type: Number },
  dynamicBaseCharge: { type: Number },
  dynamicBaseDistance: { type: Number },
  dynamicExtraCharge: { type: Number },
  dynamicExtraDistance: { type: Number },
  mimOrderValue: { type: Number },
  storeLiveStatus: { type: Boolean ,default:false},
  createdDate: { type: Number },
  updatedDate: { type: Number },
});

Store = module.exports = mongoose.model("Store", StoreSchema);
