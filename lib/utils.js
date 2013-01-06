/**
 * 提供常用辅助方法
 * @author TZ <atian25@qq.com>
 */
"use strict";

/**
 * format date.
 * @param {Date/Number} obj date to format, support Date or timestamp
 * @example 
 *   formatDate(new Date(),"yyyy-MM-dd hh:mm:ss")
 *   formatDate(new Date().setHours(0,0,0,0),"yyyy-MM-dd hh:mm:ss")
 */
function formatDate(obj,format){
  var date = obj || new Date();
  if(obj && toString.call(obj) !== '[object Date]'){
    date = new Date();
    date.setTime(obj);
  }
  format = format || "yyyy-MM-dd hh:mm:ss";

  var o = { 
    "M+" : date.getMonth()+1, //month 
    "d+" : date.getDate(),    //day 
    "h+" : date.getHours(),   //hour 
    "m+" : date.getMinutes(), //minute 
    "s+" : date.getSeconds(), //second 
    "q+" : Math.floor((date.getMonth()+3)/3),  //quarter 
    "S" : date.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)){
    format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
    }
  }
  return format; 
} 



/**
 * 格式化HTML
 */
function formatHTML(html){
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 去除HTML中的无用字符
 */
function stripHTML(html){
  return html.replace(/(?:&nbsp;|<br>)/g,'');
}

/**
 * 格式化字符串模版,支持2种格式:
 * formatStr("i can speak {language} since i was {age}",{language:'javascript',age:10});
 * formatStr("i can speak {0} since i was {1}",'javascript',10});
 */
function formatStr(tpl,obj){
  obj = typeof obj === 'object' ? obj : Array.prototype.slice.call(arguments, 1);
  return tpl.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
      if (m == "{{") { return "{"; }
      if (m == "}}") { return "}"; }
      return obj[n];
  });
};


//同时支持前后端使用
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports = module.exports = {
    formatDate: formatDate,
    formatHTML: formatHTML,
    formatStr: formatStr,
    stripHTML: stripHTML
  }
}