'use strict';
/**
 *  控制器使用
 *  函数操作
 *  页面所需要的数据挂载到ctx.body上
 */
const Controller = require('egg').Controller;
class AdminController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.returnBody(200, "获取数据成功", "aAdmin")
  }
  //登录
  async checkLogin() {
    let userName = this.ctx.request.body.userName;
    let password = this.ctx.request.body.password;
    const sql = "SELECT userName FROM admin_user WHERE userName = '" +
      userName + "'AND password = '" + password + "'";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      let openId = new Date().getTime();
      this.ctx.session.openId = { 'openId': openId };
      this.ctx.body = { data: '登录成功', openId: openId }
    } else {
      this.ctx.body = { data: '登录失败' }
    }
  }
  //获取类型
  async getTypeInfo() {
    const resType = await this.app.mysql.select('type');
    this.ctx.body = { data: resType };
  }
  //添加文章
  async addArticle() {
    let tmpArticile = this.ctx.request.body;
    const result = await this.app.mysql.insert('article', tmpArticile);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      isSuccess: insertSuccess,
      insertId: insertId
    }
  }
  //更新文章
  async updateArticle() {
    let tmpArticile = this.ctx.request.body;
    console.log(tmpArticile)
    const result = await this.app.mysql.update('article', tmpArticile);
    console.log(result);
    const updateSuccess = result.affectedRows = 1;
    this.ctx.body = {
      isSuccess: updateSuccess
    }
  }
  //获取文章列表
  async getArticle() {
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      'article.view_count as view_count,' +
      // "DATE_FORMAT(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
      // 'article.addTime as addTime,'+
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.id ' +
      'ORDER BY article.id DESC '
    let articleList = await this.app.mysql.query(sql);
    this.ctx.body = {
      data: articleList
    }

  }
  // 文章删除
  async deleteArticle() {
    const { id } = this.ctx.params;
    let res = await this.app.mysql.delete('article', { 'id': id });
    this.ctx.returnBody(200, '获取成功', res)
  }
  // 文章详情
  async getArticleDetail() {
    const { id } = this.ctx.params;
    let res = await this.app.mysql.get('article', { 'id': id });
    this.ctx.returnBody(200, '获取成功', res);
  }
}
module.exports = AdminController;
