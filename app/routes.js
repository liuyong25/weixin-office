/**
 * 路径映射类,UrlMapping
 * @author TZ <atian25@qq.com>
 */
exports = module.exports = function(app) {
  //homepage
  app.get("/", function(req, res){
    res.render('index');
  });

  // 微信公众平台
  require('./controllers/weixin.js')(app);
};
