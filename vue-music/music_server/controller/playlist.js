const Router = require('koa-router');
const router = new Router();
const callCloudFn = require('../utils/callCloudFn');
const callCloudDB = require('../utils/callCloudDB')
/**
 * 调用小程序云方法
 */
router.get('/list', async (ctx, next) => {
  //查询歌单列表
  const query = ctx.request.query
  const parmas = {
    $url: "playlist",
    start: parseInt(query.start),
    count: parseInt(query.count)
  }
  const data = await callCloudFn(ctx, 'music', parmas)
  ctx.body = {
    data:JSON.parse(data).data,
    code: 20000
  }
})
router.get('/getById', async (ctx, next) => {
  //查询歌单详情
  const { id } = ctx.request.query
  const query = `db.collection('playlist').doc('${id}').get()`;
  const res = await callCloudDB(ctx, 'databasequery', query)
  ctx.body = {
    code: 20000,
    data: JSON.parse(res.data)
  }
})
router.post('/updatePlaylist', async (ctx, next) => {
  //查询歌单详情
  const parmas = ctx.request.body;
  const query = `db.collection('playlist').doc('${parmas._id}').update({data:{
    name:'${parmas.name}',
    copywriter:'${parmas.copywriter}'
  }})`;
  const res = await callCloudDB(ctx, 'databaseupdate', query)
  ctx.body = {
    code: 20000,
    data: res
  }
})
router.get('/delete', async (ctx, next) => {
  const { id } = ctx.request.query;
  const query = `db.collection('playlist').doc('${id}').remove()`;
  const res = await callCloudDB(ctx, 'databasedelete', query);
  ctx.body = {
    code: 20000,
    data: res
  }
})
module.exports = router;