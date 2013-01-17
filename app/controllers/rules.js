/**
 * 微信消息处理规则
 * @author TZ <atian25@qq.com>
 */
"use strict";

var logger = require('debug')('weixin:robot');

var weibot = require('weixin-robot');
var router = weibot.router();
var waiter = weibot.waiter();

var db = require('../models/')

//日志
router.set('log', {
  'pattern': /.*/,
  'handler': function(info, next){
    console.log("[%s]: %s", info.from, info.text)
    db.log.insert(info, function(){
      next()
    })
  }
});

//鉴权
router.set('auth', {
  'pattern': /.*/,
  'handler': function auth(info, next){
    //根据uid查找用户
    var uid = info.from;
    var text = info.text || '';
    db.user.findOne({uid:uid}, function(err, user){
      //出错
      if(err){
        info.ended = true;
        return next(err);
      }
      //不存在
      if(!user){
        console.log('in router')
        var tip = waiter.reserve(uid, 'register'); 
        return next(null, tip);
        // var tmp = text.match(/(.*?)[\+:]?(\d+)/);
        // if(tmp&&tmp.length>=2){
        //   db.user.insert({
        //     uid: uid,
        //     status: 'normal'
        //   }, function(err, user){
        //     info.ended = true;
        //     next(null, '已收到您的注册消息,请耐心等待管理员审核.');
        //   })
        // }else{
        //   info.ended = true;
        //   return next(null, '您还未注册,请按以下格式回复:\n  姓名+工号');
        // }
      } 
      next(null,null,'a')
    })
  }
});

//消息处理
router.set('msg', {
  'pattern': /.*/,
  'handler': function handler(info, next){
    var uid = info.from;
    db.user.findOne({uid:uid}, function(err, user){
      info.ended = true;
      switch(user.status){
        case 'normal':
          
          var tip = waiter.reserve(uid, 'help', {info:info}); 
          return next(null, tip);
        default:
          console.log(user.status)
      }
      next(null, '欢迎你:' + user.uid);
    })
    }
});

function order(uid, info, next) {
  userStore[uid].status = 'order'
  return next(null,'订饭')
}

function stat(uid, info, next) {
  return next(null,'趣味统计')
}

waiter.set('register', {
  tip: '您还未注册,请按以下格式回复:\n  姓名+工号',
  replies: function(uid, info, next){
    //检查格式是否正确
    var tmp = info.text && info.text.match(/(.*?)[\+:]?(\d+)/);
    console.log(info.text,tmp)
    if(tmp&&tmp.length>=2){
      db.user.insert({
        uid: uid,
        status: 'normal'
      }, function(err, user){
        info.ended = true;
        next(null, '已收到您的注册消息,请耐心等待管理员审核.');
      })
    }else{
      //console.log('aaa')
      //var tip = waiter.reserve(uid, 'register'); 
      return next(null);
    }
  }
})

waiter.set('help', {
  //pattern: /^(帮助|help|h|\?)$/i,
  tip: function(uid,data){
    return '你好,' + uid + '\n欢迎使用宜通-微办公系统.\n回复序号使用对应的功能:\n1.订饭\n2.查看订饭趣味统计\n3.调戏'
  },
  replies: {
    '1': order,
    '2': stat
  }
});


module.exports = exports = {
  router: router,
  waiter: waiter
};