// importing  standard libararies
const router = require("express").Router();
const db = require("../connection");
const moment=require("moment")

// create users table
router.get("/createUserTable", (req, res) => {
  sqlQuery = `CREATE TABLE users( 
            userId INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(500),
            email VARCHAR(2000),
            phone VARCHAR(15),
            password VARCHAR(2000),
            role ENUM("store_owner","staff","delivery_guy"),
            createdDate DATETIME
            ) AUTO_INCREMENT=4000`;
  try {
    db.query(sqlQuery, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json({ msg: "users table created successful" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// post route to collect user data
router.post("/addUser", (req, res) => {
  sqlQuery = `INSERT INTO users SET ?`;
  db.query(sqlQuery, {...req.body,createdDate:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.status(200).json({ msg: "added user successfully" });
    }
  });
});

// get all users
router.post("/getUsers", (req, res) => {
    console.log(req.body)
  sqlQuery = req.body.role
    ? `SELECT * FROM users WHERE role="${req.body.role}"`
    : `SELECT * FROM users`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

// get specific users

// delete user

// edit user

module.exports = router;
