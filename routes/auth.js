// import required modules
const router = require("express").Router();
const cryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// use environment variables
dotenv.config();

// import Credential schema
const Credential = require("../schema/credential");

// register vendor using credentials
router.post("/registerAdmin", async (req, res) => {
  // let sql_query_check_username=`SELECT * FROM vendors_username_password WHERE username="${req.body.username}"`
  let sql_query_register = `INSERT INTO vendors_username_password SET ?`;
  let sql_query_create_vendor_profile_info = `INSERT INTO vendor_profile_info SET vendor_id=(SELECT vendor_id from vendors_username_password where email="${req.body.email}"), ?`;
  try {
    // check if the email or username already exists in the database

    if (req.body.email && req.body.password) {
      let adminCredential = await Credential.find({
        adminEmail: req.body.email,
      });
      if (adminCredential && adminCredential.length !== 0) {
        res.status(200).json({
          msg: "you have already registered with the email, please login ",
        });
      } else if (adminCredential && adminCredential.length === 0) {
        let salt = crypto.randomBytes(16).toString("hex");
        req.body.password = cryptoJS.AES.encrypt(
          req.body.password,
          salt
        ).toString();
        const newCredential = new Credential({
          adminEmail: req.body.email,
          passwordHash: req.body.password,
          salt: salt,
        });

        await newCredential.save();
        res.status(200).json({ msg: "vendor registration complete" });
      }
    } else {
      res
        .status(500)
        .json({ msg: "invalid credentials, input all the required fields" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// login vendor using credentials
router.post("/loginAdmin", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      let adminCredential = await Credential.findOne({
        adminEmail: req.body.email,
      });
      if (adminCredential && adminCredential.length !== 0) {
        if (
          cryptoJS.AES.decrypt(
            adminCredential.passwordHash,
            adminCredential.salt
          ).toString(cryptoJS.enc.Utf8) === req.body.password.toString()
        ) {
          const accessToken = jwt.sign(
            {
              adminEmail:adminCredential.email,
            },
            process.env.JWT_secret_key
          );
          res.status(200).json({ msg: "password verified" ,jwt:accessToken});
        }
        else{
            res.status(200).json({msg:"invaid admin credentials"})
        }
      }
    } else {
      res
        .status(500)
        .json({
          msg: "invalid credentials, enter all the required credentials",
        });
    }
  } catch (err) {
    console.log(err);
  }
});



// convert tst_login_jwt to json and send response
router.post("/convertJwtToJson", (req, res) => {
  const authHeader = req.headers.jwt;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_secret_key, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      else {
        console.log(user);
        res.status(200).json({ email: user.email });
      }
    });
  } else {
    return res.status(401).json("you are not authenticated");
  }
});

module.exports = router;
