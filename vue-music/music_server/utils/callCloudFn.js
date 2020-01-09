const getAccessToken = require('./getAccessToken');
const rp = require('request-promise');
const ENV = "music-8s0w6"

const callCloudFn = async (ctx, fnName, params) => {
  const ACCESS_TOKEN = await getAccessToken();
  const URL = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ENV}&name=${fnName}`
  const options = {
    method: "post",
    uri: URL,
    body: {
      ...params
    },
    json: true
  }
 
  const data = await rp(options).then(res => {
    return res.resp_data
  }).catch(res => {
    return res
  })
  return data;
}
module.exports = callCloudFn;

