/*
 * @Author: ShawnPhang
 * @Date: 2022-03-03 14:13:16
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 15:11:46
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from './utils'
import 'normalize.css/normalize.css'
import '@/assets/styles/index.less'
// import elementConfig from './utils/widgets/elementConfig'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App)

// elementConfig.components.forEach((component) => {
//   app.component(component.name, component)
// })

// elementConfig.plugins.forEach((plugin: any) => {
//   app.use(plugin)
// })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, { locale })

app
  .use(store)
  .use(router)
  .use(utils)
  .mount('#app')
