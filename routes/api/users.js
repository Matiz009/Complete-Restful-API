const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var _ = require("lodash");
const { User } = require("../../models/user");
router.post("/register", async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send("Email already exist");
    }
    user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    return res.send(_.pick(user, ["name", "email"]));
});

router.post("/login", async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send("Email not registered");
    }
    let isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
        return res.status(401).send("invalid Password");
    }
    res.send("Login Successfully!");
});
module.exports = router;