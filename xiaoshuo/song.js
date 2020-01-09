var charset = require('superagent-charset');
const sp = charset(require("superagent"));
const { writeFileSync, appendFileSync } = require("fs");
// const sp = require("superagent-charset");
const cheerio = require("cheerio");
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const start = async (page = 1) => {
  let BASE_URL = `http://wawa.fm/app/v1/album/list?page=1&size=280&platform=web&category=1&api_key=0fcf845a413e11beb5606448eb8abbc4&timestamp=1574304350` //开始地址
  // let html = await sp.get(BASE_URL).set({}).charset("gbk");
  let html = await sp.get(BASE_URL).set({Authorization:"wawa 6957b910207c0f1eca17b422bdbd563b"});
  await writeFileSync('./song.json', JSON.stringify(html.body), 'utf8');
}
// start()
const data = [];
const menu = require('./song.json');
const song = async (start = 0) => {
  let id = menu.data[start].id //开始地址
  console.log(menu.data[start].title + '开始')

  const BASE_URL = `http://wawa.fm/app/v1/album/info?id=${id}&api_key=0fcf845a413e11beb5606448eb8abbc4&timestamp=1574305282`
  if (start > menu.data.length -2) {
    console.log("结束")
    return false;
  } else {
    let html = await sp.get(BASE_URL).set({Authorization:'wawa b948ee7e237353848a3f11293c2fcac4'}).charset("utf-8");
    await appendFileSync("songItem.txt", html.text + ",")
    console.log(menu.data[start].title + '结束')
    start++
    await sleep(5000)
    song(start)
  }
}
song()
