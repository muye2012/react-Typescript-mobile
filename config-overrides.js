const {override, fixBabelImports, addLessLoader, addPostcssPlugins, adjustStyleLoaders, addWebpackAlias} = require("customize-cra");
const path=require("path");
const env = process.env.NODE_ENV;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 配置项
let conf = require('./conf/projectConfig');
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}
const myPlugin = [
  new UglifyJsPlugin(
    {
      uglifyOptions: {
        warnings: false,
        compress: {
          drop_debugger: true,
          drop_console: true
        }
      }
    }
  )
]

module.exports = override(
  (config)=> {
    // 入口文件
    config.entry[1] = require.resolve(`./src/project/${conf.name}/index.tsx`);
    if (config.mode === 'production') {
      config.module.rules[2].oneOf[5].use[0].options.publicPath = '../';
      config.output.publicPath = conf.path + conf.version + '/';
      config.output.chunkFilename = `js/[name].${conf.version}.js`;
      config.output.filename = `js/[name].${conf.version}.js`;
      config.module.rules[2].oneOf.splice(3, 1,{
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: './'
            },
          },
          'css-loader',
          'sass-loader'
        ],
      });
      config.plugins.push( new MiniCssExtractPlugin({
        // 类似 webpackOptions.output里面的配置 可以忽略
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css',
      }));
      config.module.rules[2].oneOf.splice(0,1, {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [{
          loader: require.resolve('url-loader'),
          options: {
            esModule: false,
            limit: 20000,
            name: 'images/[name].[ext]'
          }
        }]
      });
      config.resolve.plugins.splice(1,1);
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
          },
        }
      };
      config.plugins = [...config.plugins,...myPlugin]
    }
    return config;
  },
  // do stuff with the webpack config...
  fixBabelImports("import", {libraryName: 'antd-mobile', libraryDirectory: 'es', style: 'css'}),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': 'red', "hd": "2px", "color-text-base": "#333"}//配置主题色
  }),
  addPostcssPlugins([require('postcss-px2rem-exclude')({
    rootValue: 16,
    propList: ['*'],
    // propList: ['*', '!border*', '!font-size*', '!letter-spacing'],
    // propWhiteList: []
    remUnit: 37.5
  })]),
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes("scss")) {
      rule.use.push({
        loader: require.resolve("sass-resources-loader"),
        options: {
          resources: "./src/style/mixin.scss" //这里是你自己放公共scss变量的路径
        }
      });
    }
  }),
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src"),
    // ["asset"]: require('path').resolve(__dirname, '')
  })
);