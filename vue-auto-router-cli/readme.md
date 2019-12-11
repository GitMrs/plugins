## 创建一个vue-auto-router 的脚手架
1. mkire vue-auto-router-cli
2. 安装 yarn add commander(命令行定制) download-git-repo(连接git) ora(进度条) handlebars(代码生成) --save -dev 
3. 创建bin kkb 的文件夹 
  ```
    const progarm = require('commander');
    progarm.version(require('../package').version);
  ```