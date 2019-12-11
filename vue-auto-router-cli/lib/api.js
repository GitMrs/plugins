const { clone } = require('./dowload');
const fs = require('fs');
const handleBars = require('handlebars');
const symbols = require('log-symbols');
const chalk = require('chalk'); // 
module.exports.init = async name => {
  console.log("创建项目" + name);
  await clone('github:su37josephxia/vue-template', name);
}
module.exports.refresh = async name => {
  // console.log('获取页面列表')
  const content = fs.readFileSync('./template/template.vue.hbs').toString();
  fs.writeFileSync(`./src/views/${name}.vue`,content,'utf8')
  const list = fs.readdirSync('./src/views')
    .filter(v => v != 'Home.vue').map(v => ({
      name: v.replace('.vue', '').toLocaleLowerCase(),
      file: v
    }));
  
  // 生成路由定义
  compile({list}, './src/router.js', './template/router.js.hbs')
  // 生成菜单
  compile({list}, './src/App.vue', './template/App.vue.hbs')
}
/**
 * 编译文件模板
 * @param {*} mate 数据定义
 * @param {*} filePath 目标文件路径
 * @param {*} templatePath 模板路径
 */
function compile(mate, filePath, templatePath) {
  if (fs.existsSync(templatePath)) {
    //读取模板
    const content = fs.readFileSync(templatePath).toString();
    //编译
    const result = handleBars.compile(content)(mate)
    //写人
    fs.writeFileSync(filePath, result)
    console.log(symbols.success, chalk.green(`${filePath}创建成功！`))
  }
}
