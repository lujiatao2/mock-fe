import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import './assets/css/mock.css'
import {httpClient} from './assets/js/mock.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
app.config.globalProperties.$http = httpClient
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
