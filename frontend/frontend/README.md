# 前端代码规范和常见问题

## 1. 项目结构

```vue
src
├─ views // 所有的页面
│  └─ *.vue
├─ utils // 工具函数
│  └─ axios.js 
│  └─ ....... 
├─ router // 路由跳转
│  └─ router.js
├─ display // 全局 css
│  └─ *.css
├─ components // 组件
│  ├─ topBar.vue
├─ assets // 存放图片,icon等
│  ├─ image
│  │  └─.....
│  └─ icon
│     └─ ......
└─ apis //接口的逻辑
   └─ ....
```

## 2. 开发注意事项

- 项目已经导入了Element-plus及其图标库，请优先使用Element-plus的图标库，详见[Icon 图标 | Element Plus](https://element-plus.org/zh-CN/component/icon.html)

## 3. 常见问题收录

- 容器占不满整个屏幕，右侧总有一条线，怎么处理？

  答：在display/global.css下面编写全局的样式：

  ```css
  html,
  body,
  #app {
      width: 100%;
      height: 100%;
      overflow: hidden;
      padding: 0;
      margin: 0;
      overflow: hidden;
  }
  ```

  然后在main.js中引入即可。
  
- 为什么我的标题容器与其他容器之间有间隔？

  答：在浏览器中，经常有一些默认的设置，比如h1标签，默认与其他容器之间有margin，因此需要我们手动设置。比如：

  ```html
  <div class="article-title">
      <h1>{{ article_basicInfo.title }}</h1>
  </div>
  <div class="article-authors"></div>
  ```

  两个div之间默认会有间隔，只需做如下调整即可：

  ```css
  .article-title h1 {
      margin: 0; /* 移除 h1 的默认 margin */
  }
  ```

统一边框的阴影
```css
 box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
```





