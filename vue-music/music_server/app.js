const koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const router = new Router();
const app = new koa();
const cors = require('koa2-cors');
/**
 * post请求
 */
app.use(koaBody({multipart:true}))
//跨域
app.use(cors({
  origin:['http://localhost:9528'],
  credentials:true
}))
const playList = require('./controller/playlist');
const swiper = require('./controller/swiper');
const blog = require('./controller/blog');
router.use('/playlist',playList.routes())
router.use('/swiper',swiper.routes())
router.use('/blog',blog.routes())


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000,() => {
  console.log(`服务启动3000`)
})