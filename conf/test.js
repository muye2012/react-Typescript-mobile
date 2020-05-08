/*
 * Created by chenLiang 2020/4/20.
 */
process.env.NODE_ENV = 'development';
let fs = require('fs');
let client = require('scp2');
let projectName = process.argv[2];
fs.writeFileSync('./conf/project.js', `exports.name = '${projectName}'`);
let conf = require('./projectConfig');
let exec = require('child_process').execSync;
// let str2 = 'scp ./dist/index.html root@192.168.40.62:/data/m/ng/new/'
// exec('svn up', {shell: process.env.ComSpec})
// 执行svn 更新命令
if (!svnOrder()) {
  return false;
}
exec('npm run build', {stdio: 'inherit'});
scpUp();
// 执行svn 相关命令并做相应操作
function svnOrder() {
  execOrder('svn up');
  let str = execOrder(`svn commit -m "打包${projectName}项目到dev, version：${conf.version}"`);
  if (str.indexOf('Committed') > -1) {
    console.log('svn 代码提交成功！')
    return true;
  } else if (str.indexOf('in conflict') > -1) {
    console.log('svn 提交时代码有冲突， 请手动解决');
  } else if (!str) {
    console.log('svn 暂无可提交代码');
    return true;
  } else {
    console.log('svn 提交时出现问题， 请手动解决');
  }
  return false;
}
// 执行系统命令
function execOrder(order) {
  let log = exec(order);
  let buffer = Buffer.from(log);
  console.log(buffer.toString());
  return buffer.toString();
}
// 打包代码到dev
function scpUp() {
// 这个地方是否需要做成可以动态配置的
  client.scp('./build/', {
    host: conf.host || '10.0.29.181',
    username: 'root',
    password: '888888',
    path: conf.sourcePath + conf.version + '/'
  }, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('资源上传到测试服务器成功,' + (conf.sourcePath + conf.version))
      console.log('上传到测试服务器成功,' + conf.proxyUrl)
      console.log('上传时间：', new Date());
    }
  });
  client.scp('./build/index.html', {
    host: conf.host,
    username: '****',
    password: '****',
    path: conf.sourcePath
  }, (err) => {
    if (err) {
      console.log(err)
    }
  });
}
