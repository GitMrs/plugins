'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 首页
  async index() {
    let result = await this.app.mysql.get("blog_content", {});
    console.log(result)
    const { ctx } = this;
    ctx.body = result;
  }
  //获取列表
  async getArticleList() {
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      "DATE_FORMAT(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      // "article.addTime as addTime,"+
      'article.view_count as view_count ,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.id'
    let result = await this.app.mysql.query(sql);
    this.ctx.body = {
      data: result
    }
  }
  //获取详情
  async getArticleDetail() {
    let id = this.ctx.params.id;
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      'article.article_content as article_content,' +
      "DATE_FORMAT(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      'article.view_count as view_count ,' +
      'type.typeName as typeName ,' +
      'type.id as id ' +
      'FROM article LEFT JOIN type ON article.type_id = type.id ' +
      'WHERE article.id=' + id
    let result = await this.app.mysql.query(sql);
    this.ctx.body = {
      data: result
    }
  }
  //得到类别名称和编号
  async getTypeInfo() {
    const result = await this.app.mysql.select('type');
    this.ctx.body = { data: result }
  }
  //获取不同列别的文章
  async getListById() {
    let id = this.ctx.params.id;
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      "DATE_FORMAT(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      'article.view_count as view_count,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.id ' +
      'WHERE type_id=' + id
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result }
  }
}

module.exports = HomeController;
