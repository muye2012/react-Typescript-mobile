/*
 * Created by chenLiang 2020/4/20.
 */
const projectName = require('./project');
const env = process.env.NODE_ENV;

// 环境配置（通用配置，非通用配置请自定义函数）type 1 local 本地开发环境 2 test dev测试环境 3 simulator 仿真环境 4 production 生产环境
function projectConfig(path, version, name, baseUrl, sourcePath = '/usr/local/nginx/html/fd2020/') {
  return {
    // css 、js 、img资源地址
    path,
    // 项目版本号
    version,
    // 项目名称
    name,
    // 接口请求链接的baseurl
    baseUrl,
    sourcePath: sourcePath + name + '/'
  }
}

const config = {
  // 可转债机器人
  tac: projectConfig('/newBondRobot/', '1.0.2', 'tacticsRobot', 'robot')
};

const configObj = config[projectName.name];
module.exports = configObj;
