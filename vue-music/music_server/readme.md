## koa-小程序 后台
  1. npm init -y 
  2. yarn add koa
  3. yarn add koa-router 
  4. yarn add koa-body 
  5. yarn add koa2-cors 
  6. yarn add request 
  7. yarn add request-promise 
  8. 
  9. 创建app.js 作为入口文件
    ```
      const koa = require('koa');
      const koaBody = require('koa-body');
      const cors = require('koa-cors');
      const app = new koa();
      app.use(koaBody({multipart:true})) //获取post请求数据
      app.use(cors({ // 跨域
        origin:['http://localhost:9528'],
        credentials:true
      }))

    ```