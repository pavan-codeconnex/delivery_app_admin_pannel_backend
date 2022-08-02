const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  couponName: { type: String },
  couponDescription: { type: String },
  couponCode: { type: String },
  discountType: { type: String ,enum:["percent","value"]},
  maxDiscountAmount: { type: Number },
  couponDiscountPercentage: { type: Number },
  expiryDate: { type: Number },
  couponUsedCount: { type: Number },
  minAmountForapplyingCoupon: { type: Number },
  isActive: { type: Boolean },
  createdDate: { type: Number },
  updatedDate: { type: Number },
});

Promotions = module.exports = mongoose.model("Promotions", PromotionSchema);
