/**
 * web主入口
 * @author TZ <atian25@qq.com>
 */

//import Module dependencies.
var express = require('express');
var http = require('http');
var path = require('path');

var config = require('config').config;

/**
 * 启动前台界面
 */
exports.start = function(){
  //set up express & configure && middleware 
  var app = express();

  app.set('config',config);
  app.enable('trust proxy');
  app.set('port', process.env.PORT || config['port'] || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());

  //params
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  //session & cookie
  var sessionStore = new express.session.MemoryStore({reapInterval: 60000 * 10});
  app.use(express.cookieParser());
  app.use(express.session({
    store: sessionStore,
    key: 'sid',
    secret: config['session_secret']
  }));

  //app.use(express.csrf());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/lib',express.static(path.join(__dirname,'..','lib')));
  app.use('/js', express.static(path.join(__dirname,'..','lib')));

  //provide helper functions/variable to views
  app.use(function(req, res, next){
    res.locals.title = config['title'];
    res.locals.csrf = req.session ? req.session._csrf : '';
    res.locals.req = req;
    res.locals.session = req.session;
    next();
  });
  
  //app.use(require('./controllers/auth').checkLogin);
  app.use(express.logger('dev'));
  app.use(app.router); //note: this must before errorHandler & after session.

  //special env configure. (start node with "set NODE_ENV=production")
  switch(app.get('env')){
    case 'production':
      app.use(express.errorHandler());
      break;
    case 'development':
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
      app.locals({
        pretty: true 
      });
      break;
  }

  //routes & url mapping
  require('./routes')(app);

  //start http server && socket.io
  var server = http.createServer(app);

  server.listen(app.get('port'), function(){
    console.log("%s listening on port %d in %s mode", config.name, app.get('port'), app.settings.env);
    console.log("God bless love....");
    console.log("You can visit your app with http://localhost:%d", app.get('port'));  
  });

  exports.app = app;
  exports.server = server;
}

//若单独执行该文件,则启动
if(require.main === module){
  exports.start();
}