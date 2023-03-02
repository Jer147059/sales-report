// create model

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const salesSchema = new Schema({
    saleDate: Date, 
    items: [{
        name: String,
        tags: [String],
        price: Number,
        quantity: Number
    }],
    storeLocation: String,
    customer: {
        gender: String,
        age: Number,
        email: String,
        satisfaction: Number
    },
    couponUsed: Boolean,
    purchaseMethod: String
});

const Sales = mongoose.model("Sales", salesSchema)

module.exports = Sales;