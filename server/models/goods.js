// 商品数据模型
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var productSchema = new Schema({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productUrl":String,
    "checked":String,
    "productNum":String
})

module.exports = mongoose.model('Goods',productSchema)