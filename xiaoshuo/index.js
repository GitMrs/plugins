var charset = require('superagent-charset');
const sp = charset(require("superagent"));
const { writeFileSync, appendFileSync } = require("fs");
// const sp = require("superagent-charset");
const cheerio = require("cheerio");
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
let books = [];
const getMenu = async (page = 1) => {
  let BASE_URL = `https://www.biqugetv.com/41_41183/` //开始地址
  // let html = await sp.get(BASE_URL).set({}).charset("gbk");
  let html = await sp.get(BASE_URL).set({}).charset("utf-8");

  let $ = cheerio.load(html.text);
  // console.log($("#list"))
  $("#list a").each((index, item) => {
    // console.log(index)
    let info = {
      url: 'https://www.biqugetv.com' + $(item).attr("href"),
      name: $(item).text()
    }
    books.push(info);
  })
  await writeFileSync('./menu.json', JSON.stringify(books), 'utf8');
  console.log('done')
}
// getMenu()
const menu = require("./menu.json")
// console.log(menu.length)
const getContent = async (page) => {
  if (page > menu.length - 1) {
    console.log("结束")
    return false;
  } else {
    console.log(menu[page].name + "下载开始")
    let BASE_URL = menu[page].url //开始地址
    let html = await sp.get(BASE_URL).set({}).charset("utf-8");
    let $ = cheerio.load(html.text);
    await appendFileSync("我是赘婿岳风.txt", "\n" + menu[page].name + "\n" + $("#content").text().trim())
    console.log(menu[page].name + "下载完成")
    page++
    await sleep(5000)
    getContent(page)
  }
}
getContent(586)