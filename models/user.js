var mongoose = require("mongoose");
("use strict");
const Joi = require("@hapi/joi");
var bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
userSchema.methods.generateHashedPassword = async function() {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
};

function validateUser(data) {
    const Schema = Joi.object({
        email: Joi.string().email().min(0).required(),
        name: Joi.string().min(4).max(20).required(),
        password: Joi.string().min(4).max(20).required(),
    });
    return Schema.validate(data, { abortEarly: false });
}

function validateUserLogin(data) {
    const Schema = Joi.object({
        email: Joi.string().email().min(0).required(),
        password: Joi.string().min(4).max(20).required(),
    });
    return Schema.validate(data, { abortEarly: false });
}
var User = mongoose.model("users", userSchema);
module.exports.User = User;
module.exports.validate = validateUser; //for signup
module.exports.validate = validateUserLogin; //for login