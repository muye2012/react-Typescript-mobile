/*
 * Created by chenLiang 2020/4/20.
 */
let projectName = process.argv[2];
let fs = require('fs');
process.env.NODE_ENV = 'local';
fs.writeFileSync('./conf/project.js', `exports.name = '${projectName}'`);
let exec = require('child_process').execSync;
exec('npm start', {stdio: 'inherit'});