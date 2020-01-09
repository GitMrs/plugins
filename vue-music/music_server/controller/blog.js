const Router = require('koa-router');
const callCloudFn = require('../utils/callCloudFn');
const callCloudDB = require('../utils/callCloudDB');
const router = new Router();
router.get('/list', async (ctx, next) => {
  const parmas = ctx.request.query;
  const query = `db.collection('blog').skip(${parmas.start}).limit(${parmas.count}).orderBy('createTime','desc').get()`;
  const res = await callCloudDB(ctx, 'databasequery', query);
  ctx.body = {
    code: 20000,
    data: res.data
  }
  // const params = {
  //   $url: 'list',
  //   start: parseInt(ctx.request.query.start),
  //   count: parseInt(ctx.request.query.count),
  //   keyword:''
  // }
  // const data = await callCloudFn(ctx, 'blog', params)
  // ctx.body = {
  //   data:JSON.parse(data),
  //   code: 20000
  // }
})
router.get('/delete', async (ctx, next) => {
  const { id } = ctx.request.query;
  const query = `db.collection('blog').doc('${id}').remove()`;
  const res = await callCloudDB(ctx, 'databasedelete', query);

  ctx.body = {
    code: 20000,
    data: res
  }
})
module.exports = router;