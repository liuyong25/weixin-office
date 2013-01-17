/**
 * 用户domain
 * @author TZ <atian25@qq.com>
 */
"use strict";

var db = require('./index.js');

var User = db.collection('user')

function get(uid, cb){
  User.findOne({uid:uid},function(err, user){
    if(err) return cb(err)
    if(!user){
      user = {
        uid: uid,
        status:'normal'
      }
      //User.insert(user)
      return cb(null,user)
    }
  })
  //User.findAndModify({uid:uid},{},{uid:uid,status:'normal'},{upsert:true, new:true},cb)
}


function create(uid, info){
  //User.findAndModify
}

exports.get = get