const getAccessToken = require('./getAccessToken');
const rp = require('request-promise');
const ENV = "music-8s0w6";
const fs = require('fs');
const cloudStorage = {
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken();
    const options = {
      method: 'post',
      uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
      body: {
        env: ENV,
        file_list: fileList
      },
      json: true
    }
    return await rp(options)
      .then(res => {
        return res
      }).catch(err => {
        console.log(err)
      })
  },
  async upload(ctx) {
    const ACCESS_TOKEN = await getAccessToken()
    const file = ctx.request.files.file
    const path = `swiper/${Date.now()}-${Math.random() * 1000}-${file.name}`;
    const options = {
      method: 'post',
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
      body: {
        env: ENV,
        path
      },
      json:true
    }
    const info = await rp(options).then(res => {
      return res;
    }).catch(err => {
      console.log(err)
    })
    const parmas = {
      method:'post',
      headers:{
        'content-type':'multipart/form-data'
      },
      uri:info.url,
      formData:{
        key:path,
        Signature:info.authorization,
        'x-cos-security-token':info.token,
        'x-cos-meta-fileid':info.cos_file_id,
        'file':fs.createReadStream(file.path)
      },
      json:true
    }
    await rp(parmas)
    return info.file_id;
  },
  async delete(file_list){
    const ACCESS_TOKEN = await getAccessToken();
    const options = {
      method:'post',
      uri:`https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
      body:{
        env:ENV,
        fileid_list:file_list
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
}
module.exports = cloudStorage;