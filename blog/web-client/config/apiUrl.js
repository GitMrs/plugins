let ipUrl = "http://127.0.0.1:7001/home/"

let servicePath = {
  getArticleList:ipUrl + 'getArticle', // 首页文章列表接口
  getArticleById:ipUrl + 'getArticleById/', // 文章详细页内容，需要接收参数
  getTypeInfo: ipUrl + 'getTypeInfo', //获取博客类型
  getListById: ipUrl + 'getListById/', // 根据分类ID获取文章列表 
}
export default servicePath;