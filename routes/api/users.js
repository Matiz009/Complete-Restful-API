const express = require("express");
const router = express.Router();
var _ = require("lodash");
var jwt = require("jsonwebtoken");
var config = require("config");
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
    await user.generateHashedPassword();
    await user.save();
    console.log(req.body);
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
    let token = jwt.sign({ _id: user._id, name: user.name },
        config.get("jwtPrivateKey")
    );
    res.send(token);
});
module.exports = router;