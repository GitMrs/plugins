const ipUrl = 'http://127.0.0.1:7001/admin/';

const servicePath = {
  checkLogin:ipUrl + 'checkOpenId', // 检查用户名密码是否正确
  getTypeInfo: ipUrl + 'getTypeInfo', //获取文章类型
  addArticle:ipUrl + 'addArticle', // 新增文章
  updateArticle:ipUrl + 'updateArticle', // 文章更新 
  getArticle: ipUrl + 'getArticle', // 获取文章列表
  deleteArticle: ipUrl + 'deleteArticle/', //删除文章
  getArticleDetail: ipUrl + 'getArticleDetail/', // 文章详情
}
export default servicePath;