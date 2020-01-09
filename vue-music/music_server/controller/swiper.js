const Router = require('koa-router');
const router = new Router();
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorege');
router.get('/list', async (ctx, next) => {
  //默认10条数据
  const query = `db.collection('swiper').get()`
  const res = await callCloudDB(ctx, 'databasequery', query);
  //文件下载链接
  let fileList = [];
  const data = res.data;
  for (let i = 0, len = data.length; i < len; i++) {
    fileList.push({
      fileid: JSON.parse(data[i]).fileId,
      max_age: 7200
    })
  }
  const dlRes = await cloudStorage.download(ctx, fileList)
  let returnData = []
  for (let i = 0, len = dlRes.file_list.length; i < len; i++) {
    returnData.push({
      download_url: dlRes.file_list[i].download_url,
      fileid: dlRes.file_list[i].fileid,
      _id: JSON.parse(data[i])._id
    })
  }
  ctx.body = {
    code: 20000,
    data: returnData
  }
})

router.post('/upload', async (ctx, next) => {
  //上传
  const file_id = await cloudStorage.upload(ctx)
  //写入数据库
  const query = `db.collection('swiper').add({
    data:{
      fileId:'${file_id}'
    }
  })`
  const res = await callCloudDB(ctx, 'databaseadd', query)
  ctx.body = {
    code: 20000,
    data: res.file_list
  }
})
//删除
router.get('/delete', async (ctx, next) => {
  const { _id, fileid } = ctx.request.query;
  const query = `db.collection('swiper').doc('${_id}').remove()`
  const res = await callCloudDB(ctx, 'databasedelete', query);
  await cloudStorage.delete([fileid])
  ctx.body = {
    code: 20000,
    data: res
  }
})
module.exports = router;