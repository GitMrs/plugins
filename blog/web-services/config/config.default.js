/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1570868254140_5455';
  //取消post csrf
  config.security = { csrf: { enable: false }, domainWhiteList: ["*"] }
  //跨域
  //通用
  //  config.cors = {
  //    origin:"*",
  //    allowMethods:'GET,HEAD,PUT,POST,DELETE,OPTION,PATCH'
  //  }
  //指定
  config.cors = {
    origin: "http://localhost:3000",
    credentials: true, // 允许Cook跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,OPTION,PATCH'
  }
  // add your middleware config here
  config.middleware = [];
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'root',
      database: 'blog'
    },
    app: true,
    agent: false
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

