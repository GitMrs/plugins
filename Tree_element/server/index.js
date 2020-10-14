const http = require('http');
const path = require('path');
const server = http.createServer();
const Controller = require('./controller');
const UPLOAD_DIR = path.resolve(__dirname, "..", "target");

const ctrl = new Controller(UPLOAD_DIR);
server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.status = 200;
    res.end();
    return
  }
  if (req.method === 'POST') {
    if (req.url === '/upload') {
      await ctrl.handleUpload(req, res);
      return;
    } else if (req.url === '/merge') {
      await ctrl.handleMerge(req, res);
      return;
    } else if (req.url === '/verify') {
      await ctrl.handleVerify(req, res);
      return
    }
  }
})


server.listen(3000, () => console.log(`服务已经启动`));