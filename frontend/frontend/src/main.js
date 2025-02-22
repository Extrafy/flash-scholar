import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router/index.js'
import VTooltip from 'v-tooltip'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import 'element-plus/dist/index.css'
import './display/global.css'
import "@/assets/icon/comment/iconfont.css"


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersist);

//导入Elemnet-plus的图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// app.config.globalProperties.$http = axios
app.use(pinia);
app.use(router);
app.use(VTooltip);
app.use(ElementPlus,{
    locale: zhCn, 
  }
);

app.mount('#app');

