This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##说明
```
本工程下可配置多个不同项目（配置在projectConfig.js文件中），
旨在同工程下多个项目可共用相同的配置，
公共的组件以及公共的方法,
打包或运行不同项目时可加项目名加以区分
同时使用scp2进行文件上传操作，
实现了一行命令完成打包上传项目的目的，节省了开发测试时间
```

In the project directory, you can run:

## 本地运行项目(local)
```
npm run d 项目名    如 npm run d tac
```
（项目名指在conf/projectConfig内配置的项目简称）
## 打包项目至dev环境(development)
```
npm run t 项目名
```
## 打包项目(production)
####只打包，打包后可直接作为生产仿真包
```
npm run b 项目名
```