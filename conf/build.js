/*
 * Created by chenLiang 2020/5/8.
 */
process.env.NODE_ENV = 'production';
let fs = require('fs');
let projectName = process.argv[2];
fs.writeFileSync('./conf/project.js', `exports.name = '${projectName}'`);
let exec = require('child_process').execSync;
exec('npm run build', {stdio: 'inherit'});