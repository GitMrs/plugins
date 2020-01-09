'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/home/index', controller.client.home.index);
  router.get('/home/getArticle', controller.client.home.getArticleList);
  router.get('/home/getArticleById/:id', controller.client.home.getArticleDetail);
  router.get('/home/getTypeInfo', controller.client.home.getTypeInfo);
  router.get('/home/getListById/:id', controller.client.home.getListById);
};