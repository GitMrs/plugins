const getAccessToken = require('./getAccessToken');
const rp = require('request-promise');
const ENV = "music-8s0w6";
const callCloudDB = async (ctx, fnName, query) => {
  const ACCESS_TOKEN = await getAccessToken();
  const options = {
    method: 'post',
    uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
    body: {
      query,
      env:ENV
    },
    json:true
  }
  const res = await rp(options).then(res => {
    return res
  }).catch(err => {
    console.log(err)
  })
  return res;
}
module.exports = callCloudDB;