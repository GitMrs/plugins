# 数据中台搭建（egg.js）
  1. npm install -g egg-init
  2. npx egg-init --type=simple
  3. 项目结构
    ```
      app  //核心代码
        controller // 控制器
        public // 公共资源
        router // 路由
      config // 配置文件
      logs //日志文件
      run //运行脚本
      test // 测试文件
      typings // ts

    ```
  4. 关联mysql
    - yarn add egg-mysql 
        1. 在config/plugin.js 添加
        ```
          exports.mysql={ 
            enable:true,
            package:"egg-mysql"
          }
        ```
        2. 在config/config.default.js
        ```
          exports.mysql = {
            client:{
              host:'mysql.com',
              port:'3306',
              user:'root',
              password:'root',
              database:'test'
            }
            app:true,
            agent:false
          }
        ```  
  
  5. 开发！