'use strict';
/**
 * 每一个接口的方式，于其匹配的controller
 */
module.exports = app => {
  const { router, controller } = app;
  const adminauth = app.middleware.adminauth();
  router.get('/admin/index', controller.admin.index.index)
  router.post('/admin/checkOpenId', controller.admin.index.checkLogin);
  router.get('/admin/getTypeInfo', adminauth, controller.admin.index.getTypeInfo);
  router.post('/admin/addArticle', adminauth, controller.admin.index.addArticle);
  router.post('/admin/updateArticle', adminauth, controller.admin.index.updateArticle);
  router.get('/admin/getArticle', adminauth, controller.admin.index.getArticle);
  router.get('/admin/deleteArticle/:id', adminauth, controller.admin.index.deleteArticle);
  router.get('/admin/getArticleDetail/:id', adminauth, controller.admin.index.getArticleDetail);
}