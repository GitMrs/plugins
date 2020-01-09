'use strict';
/**
 * @param {Egg.Application} app - egg application
 * 引入路由
 */
module.exports = app => {
  require("./router/admin")(app);
  require("./router/client")(app);
};
