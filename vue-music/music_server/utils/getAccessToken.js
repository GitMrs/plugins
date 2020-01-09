const rp = require('request-promise');
const path = require('path');
const fileName = path.resolve(__dirname, "./access_token.json");
const APPID = 'xxxxx';
const APPSECRET = 'xxxxxx';
const fs = require('fs');
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const updateAccessToken = async () => {
  const resStr = await rp(URL);
  const res = JSON.parse(resStr);
  if (res.access_token) {
    fs.writeFileSync(fileName, JSON.stringify({
      access_token: res.access_token,
      createTime: new Date()
    }))
  } else {
    await updateAccessToken()
  }
}

const getAccessToken = async () => {
  try {
    const readRes = fs.readFileSync(fileName, 'utf8')
    const readObj = JSON.parse(readRes);
    const ceateTime = new Date(readObj.createTime);
    const nowTime = new Date().getTime();
    if ((nowTime - ceateTime) / 1000 / 60 / 60 >= 2) {
      await updateAccessToken()
      await getAccessToken()
    }
    return readObj.access_token;
  } catch (error) {
    await updateAccessToken()
    await getAccessToken()
  }
}
setInterval(async () => {
  await updateAccessToken();
}, (7200 - 300) * 1000)
module.exports = getAccessToken;