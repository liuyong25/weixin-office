/**
 * 微信处理规则
 */

var weibot = require('weixin-robot');
var log = require('debug')('weixin:robot');
var router = weibot.router();
var waiter = weibot.waiter();

function help(){

}

function order(uid, info, next) {
  return next(null,'订饭')
}

function stat(uid, info, next) {
  return next(null,'趣味统计')
}

waiter.set('help', {
  //pattern: /^(帮助|help|h|\?)$/i,
  tip: function(uid,data){
    console.log(data)
    return '你好,' + uid + '\n欢迎使用宜通-微办公系统.\n回复序号使用对应的功能:\n1.订饭\n2.查看订饭趣味统计\n3.调戏'
  },
  replies: {
    '1': order,
    '2': stat
  }
});

var userStore = {}
router.set('msg', {
  'pattern': /.*/,
  'handler': function(info, next) {
    var uid = info.from
    var user = userStore[uid];
    //首次访问
    if(!user){
      console.log('new user')
      user = userStore[uid] = {
        status: 'normal'
      }
    }

    switch(user.status){
      case 'normal':
      console.log('normal')
        var tip = waiter.reserve(uid, 'help', {info:info}); 
        return next(null, tip);
        break;
      default:
        console.log(user.status)
    }
    // 如果给传入的 request info 标记 ended，
    // 则不会进去下一个route（如果有的话）
    info.ended = true;
    next(null, '这是router');
  }
});

module.exports = exports = {
  router: router,
  waiter: waiter
};