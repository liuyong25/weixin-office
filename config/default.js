/**
 * 默认配置
 */
exports = module.exports = {
  config: {
    name: 'OfficeHelper',
    title: 'OfficeHelper',
    description: 'OfficeHelper - 微订饭',
    version: '0.0.1',
    db_url: '127.0.0.1:27017/office-helper',
    cookie_secret: 'cookie-office-helper-2012',
    session_secret: 'session-office-helper-2012',
    auth_cookie_name: 'auth-office-helper-2012',
    port: 3000,
    watch_interval: 1000 * 60 * 5,
    weixin_token: 'etonetech_tz'
  }
}