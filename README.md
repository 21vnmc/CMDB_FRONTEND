**demo**: [https://taylorchen709.github.io/vue-admin/](https://taylorchen709.github.io/vue-admin/)

# To start

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build

```

# Folder structure
* build - webpack config files
* config - webpack config files
* dist - build
* src -your app
    * api
    * assets
    * common
    * components - your vue components
    * mock
    * styles
    * views - your pages
    * vuex
    * App.vue
    * main.js - main file
    * routes.js
* static - static assets

# Theme
You can change theme by 
1. Generate theme packages by [https://elementui.github.io/theme-preview/#/](https://elementui.github.io/theme-preview/#/)
2. Put theme packages in src/assets/theme/
3. Edit src/main.js 
``` bash
   import 'element-ui/lib/theme-default/index.css'
   to
   import './assets/theme/your-theme/index.css'
```
4. Edit src/styles/vars.scss

![theme-blue](https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/rec-demo.gif)
![theme-green](https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/theme-green.png)

# Browser support

Modern browsers and IE 10+.

# License
[MIT](http://opensource.org/licenses/MIT)

# Help
[promise](https://www.jianshu.com/p/67a6cade05f2)
[permission](https://www.cnblogs.com/xiaochongchong/p/11308770.html)
[ele-cascader](https://juejin.im/post/5bd90f67e51d452ef37d4541)
[ele-cascader](https://www.cnblogs.com/yulingjia/p/9789174.html)

# issue
[el-cascader回显问题](https://www.codenong.com/cs105410935/)

```js
// packages/cascader-panel/src/cascader-panel.vue , line at 377.
    clearCheckedNodes: function clearCheckedNodes() {
      var config = this.config,
          leafOnly = this.leafOnly;
      var multiple = config.multiple,
          emitPath = config.emitPath;

      if (multiple) {
        this.getCheckedNodes(leafOnly).filter(function (node) {
          return !node.isDisabled;
        }).forEach(function (node) {
          return node.doCheck(false);
        });
        this.calculateMultiCheckedValue();
      } else {
        this.checkedValue = emitPath ? [] : null;
         this.activePath = []; // add this line
        this.calculateCheckedNodePaths(); // add this line
        this.syncActivePath(); // add this line
      }
    }
//packages/cascader-panel/src/cascader-panel.vue , line at 147.


    value: function value() {
      this.clearCheckedNodes(); // add this line
      this.syncCheckedValue();
      this.checkStrictly && this.calculateCheckedNodePaths();
    }
```

