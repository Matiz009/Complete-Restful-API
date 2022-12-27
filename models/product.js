var mongoose = require("mongoose");
"use strict";
const Joi = require("@hapi/joi");

var productSchema = mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
});

function validateProduct(data) {
    const Schema = Joi.object({
        id: Joi.number().min(0).required(),
        name: Joi.string().min(4).max(20).required(),
        price: Joi.number().min(100).required(),
    });
    return Schema.validate(data, { abortEarly: false });
}
var Product = mongoose.model("cruds", productSchema);
module.exports.Product = Product;
module.exports.validate = validateProduct;