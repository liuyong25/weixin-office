/**
 * 默认配置
 */
var meta = require('../package.json')

exports = module.exports = {
  config: {
    name: meta.name,
    title: meta.name,
    description: meta.description,
    version: meta.version,
    db_url: '127.0.0.1:27017/' + meta.name,
    cookie_secret: 'cookie_' + meta.name,
    session_secret: 'session_' + meta.name,
    auth_cookie_name: 'auth_' + meta.name,
    port: 3000,
    watch_interval: 1000 * 60 * 5,
    weixin_token: 'token_node_' + meta.name
  }
}