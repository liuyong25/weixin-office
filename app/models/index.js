/**
 * 提供数据库辅助类
 * @author TZ <atian25@qq.com>
 */
"use strict";

var node_utils = require('node-utils');
var config = node_utils.getConfig();
var mongoskin = node_utils.getModule('mongoskin');

if(config.db_url){
  var db = mongoskin.db(config.db_url,{safe: true,auto_reconnect: true});
  exports.db = db;
}
