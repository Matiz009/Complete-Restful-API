const express = require("express");
const router = express.Router();
const { Product } = require("../../models/product");
const validateProduct = require("../../middlewares/validateProduct");
//getting multiple records
router.get("/", async(req, res) => {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let products = await Product.find().skip(skipRecords).limit(perPage);
    return res.send(products);
});
//getting single records

router.get("/:id", async(req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).send("Record not present");
        }
        return res.send(product);
    } catch (err) {
        res.status(400).send("invalid id");
        console.log(err);
    }
});
//update
router.put("/:id", validateProduct, async(req, res) => {
    let product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    return res.send(product);
});

//delete
router.delete("/:id", async(req, res) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    return res.send(product);
});

//insert
router.post("/", validateProduct, async(req, res) => {
    try {
        let product = new Product();
        product.id = req.body.id;
        product.name = req.body.name;
        product.price = req.body.price;
        await product.save();
        return res.send(product);
    } catch (error) {
        res.status(400).send("invalid bad request!");
        console.log(error);
    }
});
module.exports = router;