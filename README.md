#### 同城换书小程序构建

* 导入到微信开发者工具

* 终端中执行

  ```
  npm init
  ```

* 安装 组件

  * 安装 vant

    ```
    npm i @vant/weapp -S --production
    ```

  * 安装 miniprogram

    ```
    npm i miniprogram-sm-crypto --production
    ```

* 配置

  * **将 app.json 中的 “style”: “v2” 这行代码删除**  避免组件样式混乱

  * 使用微信开发者工具所创建的项目，miniprogramRoot 默认为 miniprogram，而package.json 在其外部，npm 构建无法正常工作。需要手动在 project.config.json 内添加如下配置，使开发者工具可以正确索引到 npm 依赖的位置

    ```
    
    {
      ...
      "setting": {
        ...
        "packNpmManually": flase,
        "packNpmRelationList": [
          {
            "packageJsonPath": "./package.json",
            "miniprogramNpmDistDir": "./miniprogram/"
          }
        ]
      }
    
    ```

  * 构建npm工具

    ```
    微信开发者工具中 点工具按钮选npm构建
    ```

  * 使用组件

    按需在不同页面的json文件中引入

    ```
    {
      "usingComponents": {
      "vant-button": "@vant/weapp/button/index"
      }
    }
    ```

    

    ![image-20221124134702692](image-20221124134702692.png)