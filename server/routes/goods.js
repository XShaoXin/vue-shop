let express = require('express')
let router = express.Router(); // 拿到express框架的路由
let Goods = require('../models/goods')
let mongoose = require('mongoose')
// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_shop'); // 若是带账号密码的：'mongodb://root:123456@127.0.0.1:27017/dbName'

// 连接成功操作
mongoose.connection.on("connected", function () {
  console.log("连接成功.")
})

// 连接失败操作
mongoose.connection.on("error", function () {
  console.log("连接失败.")
})

// 连接断开操作
mongoose.connection.on("disconnected", function () {
  console.log("连接断开.")
})
//一级路由在app.js中已经定义了
router.get('/list', (req, res, next) => { //二级路由
  // express获取请求参数
  let page = parseInt(req.param("page")); //get请求获得的参数都是字符串
  let pageSize = parseInt(req.param("pageSize")); //默认8个
  let skip = (page - 1) * pageSize; //拿到所有goods时，需要跳过的条数
  let sort = parseInt(req.param("sort")); //sort为1为升序，为-1为降序
  let condition = {}; //mongoose的查询条件都是一个对象
  let priceGt = '',
    priceLte = ''
  let priceLevel = (req.param("priceLevel")) // 传过来的价格区间
  //价格区间过滤
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 20;
        break;
      case '1':
        priceGt = 20;
        priceLte = 50;
        break;
      case '2':
        priceGt = 50;
        priceLte = 100;
        break;
      case '3':
        priceGt = 100;
        priceLte = 500;
        break;
    }
    condition = {
      salePrice: {
        $gt: priceGt, //>priceGt
        $lte: priceLte //<=priceLte
      }
    }
  }
  // http://localhost:3000/goods/list?page=1&pageSize=8&priceLevel=all&sort=0
  // 先查询所有，skip(skip)跳过skip条数据，limit(pageSize)一页多少条数据.
  let goodsModel = Goods.find(condition).skip(skip).limit(pageSize);

  if (sort != 0) { //前端传过来的sort分别为-1，1，0
    goodsModel.sort({
      'salePrice': sort
    }) // 对价格排序
  }
  //子进程
  goodsModel.exec((err, docs) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: docs.length,
          list: docs
        }
      })
    }
  })
})

//加入购物车
router.post('/addCart', (req, res) => { //二级路由
  let userName = req.cookies.userName,
    productId = req.body.productId //get请求：res.param("productId")   post请求：req.body.productId
  let User = require('../models/user')
  User.findOne({
    userName: userName //查询条件
  }, (err1, userDoc) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message
      })
    } else {
      if (userDoc) {
        let goodsItem = ''
        userDoc.cartList.forEach(item => {
          if (item.productId == productId) { //判断cartList是否已经有了这个商品
            goodsItem = item //如果有就将item赋值给goodsItem
            item.productNum++ //数量加1
            userDoc.save((err4) => { //保存到数据库
              if (err4) {
                res.json({
                  status: '1',
                  msg: err4.message
                })
              } else {
                res.json({
                  status: '0',
                  msg: 'success'
                })
              }
            })
          }
        });
        if (goodsItem == '') { //如果goodsItem无值则代表cartList无该商品信息，执行下面的代码。如果有值则不用执行下面的代码了
          Goods.findOne({
            productId: productId
          }, (err2, goodsDoc) => {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              if (goodsDoc) {
                goodsDoc.productNum = 1
                goodsDoc.checked = 1
                userDoc.cartList.push(goodsDoc) // 添加信息到用户购物车列表中
                userDoc.save((err3) => { //保存到数据库
                  if (err3) {
                    res.json({
                      status: '1',
                      msg: err3.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

//admin的商品列表
router.get('/goodslist', (req, res, next) => {
  Goods.find({}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      })
    }
  })
})

//添加商品
router.post('/addGoods', (req, res) => {
  let param = {
    productId: req.body.productId,
    productName: req.body.productName,
    salePrice: parseInt(req.body.salePrice),
    productUrl: req.body.productUrl
  }
  Goods.findOne({
    "productId": param.productId
  }, (err1, doc) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message
      })
    } else if (doc) {
      res.json({
        status: '1',
        msg: '商品id重复'
      })
    } else {
      Goods.create(param, function (err2, doc) {
        if (err2) {
          res.json({
            status: '1',
            msg: err2.message
          })
        } else {
          res.json({
            status: '0',
            msg: 'success'
          })
        }
      })
    }
  })
})

//删除商品
router.post('/del', (req, res, next) => {
  let productId = req.body.productId
  //更新数据库
  Goods.remove({
    productId: productId
  }, (err, result) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    }else{
      res.json({
        status: '0',
        msg: 'success'
      })
    }
  })
})
module.exports = router