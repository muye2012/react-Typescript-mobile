/*
 * Created by chenLiang 2020/3/24.
 * 反向代理处理跨域
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
const conf = require('../conf/projectConfig');

module.exports = function ( app ) {
  // 配置反向代理
  const options = {
    target: 'http://m.dev.hbec.com/' + conf.baseUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/'
    }
  };
  // app.use('/api', createProxyMiddleware(options));
  // app.use(proxy( 标识符，反向代理配置项))
  app.use('/api', createProxyMiddleware(options));
  // app.listen(80)
  // app.use(proxy('/index.php',{
  //   target: 'http://qinqin.net',
  //   changeOrigin: true
  // }))
};