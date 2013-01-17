/**
 * log domain
 * @author TZ <atian25@qq.com>
 */
"use strict";

var db = require('./index.js');

var Log = db.collection('log')

function insert(data, cb){
  return Log.insert(data,null,cb)
}


exports.insert = insert