// importing  standard libararies
const router = require("express").Router();
const db = require("../connection");

// create orders table
router.get("/createOrdersTable", (req, res) => {
  // orderStatus 1-order placed,2- pending, 3-accepted, 4-delivered ,5-cancelled
  // paymentMode 1-online payment, 2- COD , 3-card payment
  // orderType 1-delivery 2-self pick
  sqlQuery = `CREATE TABLE orders( 
            orderId INT AUTO_INCREMENT PRIMARY KEY,
            orderStatus ENUM("1","2","3","4") DEFAULT "1",
            storeName VARCHAR(500),
            paymentMode ENUM("1","2","3"),
            orderType ENUM("1","2"),
            orderPlacedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
            subTotal FLOAT,
            storeCharge FLOAT,
            deliveryCharge FLOAT,
            totalAmount FLOAT,
            customerName VARCHAR(200),
            customerEmail VARCHAR(2000),
            customerMobileNumber VARCHAR(15),
            customerDeliveryAddress TEXT,
            customerDeliveryPin INT,
            deliveryAgentAssigned BOOLEAN DEFAULT false,
            deliveryAgentId INT 
            ) AUTO_INCREMENT=4000`;
  db.query(sqlQuery,(err,result)=>{
    if(err) throw err;
    res.send(' table "orders" created successfully')
  });
});

router.post("/createNewOrder",(req,res)=>{
    sqlQuery=`INSERT INTO orders SET ?`
    db.query(sqlQuery,{
        storeName:req.body.storeName,
        paymentMode:req.body.paymentMode ,
        orderType:req.body.orderType ,
        subTotal:req.body.subTotal ,
        storeCharge:req.body.storeCharge ,
        deliveryCharge:req.body.deliveryCharge ,
        totalAmount:req.body.totalAmount ,
        customerName:req.body.customerName ,
        customerEmail:req.body.customerEmail ,
        customerMobileNumber:req.body.customerMobileNumber ,
        customerDeliveryAddress:req.body.customerDeliveryAddress,
        customerDeliveryPin:req.body.customerDeliveryPin , 
        orderStatus:req.body.orderStatus
    },(err,result)=>{
        if(err) throw err;
        res.status(200).json({msg:"order creation successful"})
    })
})

router.post("/cancelOrder",(req,res)=>{
    sqlQuery=`UPDATE orders SET ? WHERE orderId=${req.body.orderId}`
    db.query(sqlQuery,{
        orderStatus:5
    },(err, result) => {
        if (err) throw err;
        console.log(result);
        res.status(200).json({ status: "cancelled order" });
      })
})

router.get("/getAllOrders", (req, res) => {
  sqlQuery = `SELECT * FROM orders`;
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


module.exports=router