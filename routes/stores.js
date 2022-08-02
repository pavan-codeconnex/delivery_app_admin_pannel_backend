// importing  standard libararies
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

// import mongodb schema of store
const Store = require("../schema/store");


// create new store row

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/stores")) {
      fs.mkdirSync("public/stores");
    }

    cb(null, "public/stores");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.replaceAll(" ", ""));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("only pictures are allowed"));
    }
    cb(null, true);
  },
});

// deliveryType  1-self pickup ,2-both delivery and self
// deliveryChargeType 1-fixed charge ,2- dynamic charge
router.post(
  "/create_store",
  upload.fields([
    {
      name: "storeImg",
    },
  ]),
  async (req, res) => {
    const newStore = new Store({
      name: req.body.storename,
      description: req.body.description,
      storeImage: req.files?.storeImg
        .map(function (ele) {
          return ele.path;
        })
        .join(","),
      defaultRating: req.body.default_rating,
      address: req.body.full_address,
      pincode: req.body.pincode,
      landmark: req.body.landMark,
      loc: {
        type: "Point",
        coordinates: [req.body.latitude, req.body.longitude],
      },
      licenseCode: req.body.certificate_or_license_code,
      storeCharge: req.body.store_charge,
      deliveryType: req.body.delivery_type,
      deliveryRadius: req.body.delivery_radius,
      deliveryChargeType: req.body.delivery_charge_type,
      fixedCharge: req.body.delivery_charge,
      dynamicBaseCharge:
        req.body.base_delivery_charge === ""
          ? null
          : req.body.base_delivery_charge,
      dynamicBaseDistance:
        req.body.base_delivery_distance === ""
          ? null
          : req.body.base_delivery_distance,
      dynamicExtraCharge:
        req.body.extra_delivery_charge === ""
          ? null
          : req.body.extra_delivery_charge,
      dynamicExtraDistance:
        req.body.extra_delivery_distance === ""
          ? null
          : req.body.extra_delivery_distance,
      minOrderValue: req.body.min_order_price,
      createdDate: Date.now(),
      updatedDate: Date.now(),
    });
    await newStore.save();
    res.status(200).json({ msg: "store created successfully" });
  }
);

// edit the store
router.put("/edit_store", async (req, res) => {
  try {
    let updatedStore = await Store.findByIdAndUpdate(
      req.body.storeId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ msg: "store updated success" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// delete store
router.delete("/delete_store", async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.body.storeId);
    res.status(200).json({ status: "deleted product" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// get all stores
router.get("/get_stores/all", async (req, res) => {
  let stores = await Store.find();
  res.send(stores);
});

module.exports = router;
