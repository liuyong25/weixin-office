/**
 * 提供数据库辅助类
 * @author TZ <atian25@qq.com>
 */
"use strict";

var config = require('config').config;
var mongoskin = require('mongoskin');

var db = mongoskin.db(config.db_url,{safe: true,auto_reconnect: true});

db.log = db.collection('log')
db.user = db.collection('user')

module.exports = exports = db;


