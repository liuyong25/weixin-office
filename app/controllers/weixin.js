/*
 * 微信公众平台
 * http://agile_gz.cloudfoundry.com/weixin
 * @author TZ <atian25@qq.com>
 */
var _ = require('underscore')._;
var webot = require('weixin-robot');
var rules = require('./rules');
var robot = webot.robot(rules.router, rules.waiter);

var messages = {
  '400': '呃,我比较笨,听不懂你在说什么哦',
  '503': '服务器临时出了一点问题，您稍后再来好吗'
};

/**
 * 微信公众平台消息接口处理
 */
module.exports = exports = function(app){
  exports.config = app.get('config');

  //微信接入,GET请求
  var token = app.get('config')['weixin_token'];
  var auth = webot.checkSig(token);
  app.get('/weixin',auth); 

  //消息请求处理
  app.post('/weixin',[auth, webot.bodyParser(),process]);
  return exports;
}

/**
 * 读取配置
 */
function getCfg(key){
  return exports.config && exports.config[key];
}

/**
 * 业务逻辑
 */
function process(req, res, next){
  var info = req.wx_data;

  //返回给微信的，必须是一个 xml
  res.type('xml');

  //返回消息
  function end() {
    res.send(webot.makeMessage(info));
  }

  //解析微信发送的消息失败
  if(!info){
    info = {
      reply: messages['400']
    };
    return end();
  }

  //机器人根据请求提供回复,具体回复规则由 router 和 waiter 提供
  robot.reply(info, function(err, result) {
    if (err || !result) {
      // 出错之后，提示一下
      //res.statusCode = (typeof err === 'number' ? err : 500);
      info.reply = result || messages[String(err)] || messages['503'];
      // 如果标记 flag == true ，可以在微信后台的星标消息里面看到
      //info.flag = true;
    } else if (result instanceof Array) {
      // 在 app 层决定如何处理 robot 返回的内容
      // 如果 info.items 为一个数组，则发送图文消息
      // 否则按 info.reply 发送文字消息
      info.items = result;
    } else if (typeof result == 'string') {
      info.reply = result;
    } else {
      info.reply = messages['400'];
    }
    end();
  });
}