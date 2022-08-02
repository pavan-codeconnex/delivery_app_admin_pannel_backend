const mongoose = require("mongoose");

// orderstatus: 
const OrderSchema = new mongoose.Schema({
  orderStatus: { type: String ,enum:["1","2","3","4"]},
  StoreName: { type: String },
  paymentMode: { type: String },
  orderType: { type: String },
  orderPlacedtime: { type: Number },
  subTotal: { type: Number },
  deliveryCharge: { type: Number },
  totalamount: { type: Number },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: Number },
  deliveryAddress: { type: String },
  deliveryPincode: { type: Number },
  deliveryStatus: { type: Boolean },
  deliveryAgentId: { type: String },
  createdDate: { type: Number },
  updatedDate: { type: Number },
});

Orders = module.exports = mongoose.model("Order", OrderSchema);
