// importing  standard libararies
const router = require("express").Router();

// importing order schema
const Order = require("../schema/order");

// creating new order
router.post("/createNewOrder", async (req, res) => {
  try {
    const newOrder = new Order({
      orderStatus: req.body.orderStatus,
      StoreName: req.body.storeName,
      paymentMode: req.body.paymentMode,
      orderType: req.body.orderType,
      orderPlacedtime: Date.now(),
      subTotal: req.body.subTotal,
      deliveryCharge: req.body.deliveryCharge,
      totalamount: req.body.totalAmount,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerMobileNumber,
      deliveryAddress: req.body.customerDeliveryAddress,
      deliveryPincode: req.body.customerDeliveryPin,
      deliveryStatus: false,
      deliveryAgentId: null,
      createdDate: Date.now(),
      updatedDate: Date.now(),
    });
    await newOrder.save();
    res.status(200).json({ msg: "order created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// get all orders
router.get("/getAllOrders", async (req, res) => {
  let orders;
  try {
    if (req.body?.orderId) {
      orders = await Order.findById(req.body.orderId);
    } else {
      orders = await Order.find();
    }
    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// update order
router.put("/updateOrder", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(
      req.body.orderId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ msg: "order updated success" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

module.exports = router;
