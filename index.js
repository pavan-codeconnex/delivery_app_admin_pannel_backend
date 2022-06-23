// import required modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

// importing routes
const stores = require("./routes/stores");
const orders=require("./routes/orders")
const users=require("./routes/users")
// const promotions=require("./routes/promotions")
// setting up .env files
dotenv.config();
app.use(express.json());
app.use(cors());

// handle  unhandled exceptions and rejections

process.on("uncaughtException", (error, origin) => {
  console.log("----- Uncaught exception -----");
  console.log(error);
  console.log("----- Exception origin -----");
  console.log(origin);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("----- Unhandled Rejection at -----");
  console.log(promise);
  console.log("----- Reason -----");
  console.log(reason);
});

// serve static files from public folder
app.use("/public", express.static("public"));

// use routes imported
app.use("/app",stores)
app.use("/app",orders)
app.use("/app",users)
// app.use("/app",promotions)
// listening on port 5000
app.listen(process.env.PORT || 5005, (req, res) => {
  console.log("app is listening");
});

module.exports = function database() {
  return db;
};
