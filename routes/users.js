// importing  standard libararies
const router = require("express").Router();
const moment = require("moment");

// import user schema
const User = require("../schema/user");

// create user
router.post("/addUser", async (req, res) => {
  try {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role,
      createdDate: Date.now(),
      updatedDate: Date.now(),
    });
    await newUser.save();
    res.status(200).json({ msg: "user created successful" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// get specific users
//      or
// get all users
router.get("/getUsers", async (req, res) => {
  try {
    let users;
    if (req.body.role) {
      users = await User.find({ role: req.body?.role });
    } else {
      users = await User.find();
    }
    res.status(200).send(users);
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// delete user
router.delete("/deleteUser", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.status(200).json({ msg: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

// edit user
router.put("/editUser", async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {...req.body, updatedDate:Date.now()},
      },
      { new: true }
    );
    res.status(200).json({updatedUser:updatedUser, msg:"user updated success"})
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
});
module.exports = router;
