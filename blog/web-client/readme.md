# 初始化环境构件项目
  1. npm install -g create-next-app
  2. npx create-next-app blog
# next支持css文件
  1. yarn add @zeit/next-css
  2. 创建next.config.js
    ```
      const withCss = require("@zeit/next-css);
      if(typeof require !== 'undefined'){
        require.extendsions['.css']=file => {}
      }
      module.exports = withCss({})
    ```
# 按需引入 antd
  1. yarn add antd babel-plugin-import
  2. 创建.babelrc的babel配置文件
    ```
      {
        "presents":["next/babel"],
        "plugins":[
          [
            "import",
            "libraryName":"antd"
          ]
        ]
      }
    ```
# 文章展示使用react-markdown
  1. https://github.com/rexxars/react-markdown
# 文章跳转使用markdown-navbar
  1. https://github.com/parksben/markdown-navbar
