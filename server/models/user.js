let mongoose = require('mongoose')
let Schema = mongoose.Schema
let UserSchema = new Schema({
    "userName":String,
    "userPwd":String,
    "cartList":[
       {
        "productId":String,
        "productName":String,
        "salePrice":String,
        "productUrl":String,
        "checked":String,
        "productNum":String
       }
    ],
})
module.exports = mongoose.model("User",UserSchema)