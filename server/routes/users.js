let express = require('express');
let router = express.Router();
let User = require('../models/user')

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post('/login', (req, res) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) { //如果doc有值，则证明user存在
        res.cookie('userName', doc.userName, { //将userId放入cookie
          path: '/',
          maxAge: 1000 * 60 * 60 //cookie存在的时间，毫秒为单位
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.json({
          status: '0',
          msg: '',
          result: { //这里要返回userName，前台页面需要用到
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: '1',
          msg: '用户名或密码错误',
        })
      }
    }
  })
})
//注册
router.post('/register', (req, res) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne({
    "userName": param.userName
  }, (err1, doc) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message
      })
    } else if (doc) {
      res.json({
        status: '1',
        msg: '用户名已被注册'
      })
    } else {
      User.create(param, function (err2, doc) {
        if (err2) {
          res.json({
            status: '1',
            msg: err2.message
          })
        } else {
          console.log('注册成功');
          res.json({
            status: '0',
            msg: 'success'
          })
        }
      })
    }
  })
})
//登出
router.post('/logout', (req, res) => {
  res.cookie('userName', '', { //将cookie中userId的值设为空，时间设为-1，使其生效
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: 'success',
    result: ''
  })
})
// 校验是否登录
router.get('/checkLogin', (req, res) => {
  if (req.cookies.userName) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName //如果cookies里有userId,证明用户登录过,并在一定时间内有效，所以将userName返回过去
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

//查询用户名下的购物车数据
router.get('/cartList', (req, res, next) => {
  //req.cookies用来读，res.cookies()用来写
  let userName = req.cookies.userName;
  User.findOne({
    "userName": userName
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})
//删除购物车项
router.post('/cart/del', (req, res, next) => {
  let userName = req.cookies.userName
  let productId = req.body.productId
  //更新数据库
  User.update({
    userName: userName
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
})
//编辑购物车
router.post('/cart/edit', (req, res, next) => {
  let userName = req.cookies.userName
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked
  //更新子文档使用update()
  User.update({
      "userName": userName,
      "cartList.productId": productId
    }, {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked
    },
    (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'success'
        })
      }
    })
})
//全选中购物车项
router.post('/cart/checkAll', (req, res, next) => {
  let userName = req.cookies.userName
  let checkAllFlag = req.body.checkAllFlag ? '1' : '0'
  User.findOne({
    'userName': userName
  }, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAllFlag
        })
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      }

    }
  })
})

//结算
router.get('/cart/pay', (req, res, next) => {
  let userName = req.cookies.userName
  User.findOne({
    userName: userName,
  }, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else if (user) {
      if (user.cartList.length == 0) {
        return
      }
      user.cartList = user.cartList.filter((item) => {
        if (item.checked == '0') {
          return true
        }
      })
      // console.log('user11111',user)
      
      user.save((err1, doc) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: 'suc'
          })
        }
      })
    }
  })

})
module.exports = router;
