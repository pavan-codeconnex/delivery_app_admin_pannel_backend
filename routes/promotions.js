// importing  standard libararies
const router = require("express").Router();

// importing promotions schema
const Promotion = require("../schema/promotions");

// create promotion
router.post("/createPromo", async (req, res) => {
  try {
    let newPromo = new Promotion({
      couponName: req.body.couponName,
      couponDescription: req.body.couponDescription,
      couponCode: req.body.couponCode,
      discountType: req.body.discountType,
      maxDiscountAmount: req.body.maxDiscountAmount,
      couponDiscountPercentage: req.body.couponDiscountPercentage,
      expiryDate: req.body.expiryDate,
      couponUsedCount: req.body.couponUsedCount,
      minAmountForapplyingCoupon: req.body.minAmountForapplyingCoupon,
      isActive: req.body.isActive,
      createdDate: Date.now(),
      updatedDate: Date.now(),
    });

    await newPromo.save();
    res.status(200).json({ msg: "promotion created successful" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// get promotions
router.get("/getPromo", async (req, res) => {
  try {
    let promos;
    if (req.body?.promoId) {
      promos = await Promotion.findById({ _id: req.body?.promoId });
      console.log(promos)
      promos===null?res.status(200).json({msg:"no such promocode found"}):res.status(200).send(promos);
    } else {
      promos = await Promotion.find();
      res.status(200).send(promos);
    }
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// delete a promotion
router.delete("/deletePromo", async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.body.promoId);
    res.status(200).json({ msg: "promotion deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// update a promotion
router.put("/updatePromo", async (req, res) => {
  try {
    let updatedPromo = await Promotion.findByIdAndUpdate(
      req.body.promoId,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log(updatedPromo)
    res.status(200).json({updatedPromo:updatedPromo,msg:"promo updated success"})
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});
module.exports = router;
