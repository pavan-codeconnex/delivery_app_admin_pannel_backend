// importing  standard libararies
const router = require("express").Router();
const db = require("../connection");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment=require("moment")
// create a table 'Products'
router.get("/create_table_stores", (req, res) => {
  // deliveryType  1-self pickup ,2-both delivery and self
  // deliveryChargeType 1-fixed charge ,2- dynamic charge
  
  let sql_query = `CREATE TABLE Stores(
                      storeId INT AUTO_INCREMENT PRIMARY KEY,
                      storename VARCHAR(200),
                      storeDesc TEXT,
                      storeImg TEXT,
                      default_rating ENUM("1","2","3","4","5"),
                      approx_deliveryTime VARCHAR(500),
                      approx_price_for_two int,
                      full_address TEXT,
                      pincode VARCHAR(15),
                      landMark VARCHAR(500),
                      latitute FLOAT,
                      longitude FLOAT,
                      certificate_or_license_code VARCHAR(200),
                      storeCharge INT,
                      deliveryType ENUM("1","2"),
                      deliveryRadius int default 10,
                      deliveryChargeType ENUM("1","2"),
                      fixedCharge_deliveryCharge int,
                      dynamicCharge_baseDeliveryCharge int,
                      dynamicCharge_baseDeliveryDistance int,
                      dynamicCharge_extraDeliveryCharge int,
                      dynamicCharge_extraDeliveryDistance int,
                      isFeatured BOOLEAN default false,
                      minOrderPrice int,
                      commissionRate FLOAT,
                      live_status BOOLEAN DEFAULT false,
                      joined_date DATETIME 
                      ) AUTO_INCREMENT=30001`;

  db.query(sql_query, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(' table "stores" created successfully');
  });
});

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

router.post(
  "/create_store",
  upload.fields([
    {
      name: "storeImg",
    },
  ]),

  (req, res) => {
    try {
      let sql_query = `INSERT INTO Stores SET ?`;
        // console.log(req.body.storeData[0])
      db.query(
        sql_query,
        {
          storename: req.body.storename,
          storeDesc: req.body.description,
          storeImg: req.files.storeImg
            .map(function (ele) {
              return ele.path;
            })
            .join(","),
          default_rating: req.body.default_rating,
          approx_deliveryTime: req.body.approx_delivery_time,
          approx_price_for_two: req.body.approx_price_for_two,
          full_address: req.body.full_address,
          pincode: req.body.pincode,
          landMark: req.body.landMark,
          latitute: req.body.latitude,
          longitude: req.body.longitude,
          certificate_or_license_code: req.body.certificate_or_license_code,
          storeCharge: req.body.store_charge,
          deliveryType: req.body.delivery_type,
          deliveryRadius: req.body.delivery_radius,
          deliveryChargeType: req.body.delivery_charge_type ,
          fixedCharge_deliveryCharge: req.body.delivery_charge,
          dynamicCharge_baseDeliveryCharge: req.body.base_delivery_charge===""?null:req.body.base_delivery_charge,
          dynamicCharge_baseDeliveryDistance: req.body.base_delivery_distance===""?null:req.body.base_delivery_distance,
          dynamicCharge_extraDeliveryCharge: req.body.extra_delivery_charge===""?null:req.body.extra_delivery_charge,
          dynamicCharge_extraDeliveryDistance: req.body.extra_delivery_distance===""?null:req.body.extra_delivery_distance,
          isFeatured: req.body.is_featured==="true"?true:false,
          minOrderPrice: req.body.min_order_price,
          commissionRate: req.body.commission_rate,
          joined_date:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        },
        (err, result) => {
          if (err) throw err;
          console.log(result);
          res.status(200).json({ status: "inserted row" });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);

// edit the products
router.put("/edit_store", (req, res) => {
  let sql_query = `UPDATE Stores SET ? `;
  db.query(sql_query, req.body, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).json({ status: "updated row" });
  });
});

// delete product
router.delete("/delete_store", (req, res) => {
  let sql_query = `DELETE FROM Stores WHERE storeId=${req.body.storeId}`;
  db.query(sql_query, req.body, (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.status(200).json({ status: "deleted product" });
    } else {
      res.status(200).json({ status: "no product with that id found" });
    }
  });
});

// get all categories
router.post("/get_stores/all", (req, res) => {
  let sql_query = `SELECT * FROM Stores `;
  db.query(sql_query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
