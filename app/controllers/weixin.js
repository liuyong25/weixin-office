/*
 * 微信公众平台
 * http://agile_gz.cloudfoundry.com/weixin
 * @author TZ <atian25@qq.com>
 */
var _ = require('underscore')._;
var webot = require('weixin-robot');

/**
 * 微信公众平台消息接口处理
 */
module.exports = exports = function(app){
  //启动机器人,你在微信公众平台填写的token
  var token = app.get('config')['weixin_token'];
  webot.monitor(token, '/weixin', app);
  initRules(webot)
  return webot;
}

function initRules(webot){
  webot.set('help', 'no help');
}
