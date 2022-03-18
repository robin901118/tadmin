import { createApp } from 'vue'
import App from './App.vue'
import ElmentPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import installRouter from './router'
import installDirective from './directive'
import installComponents from './components'

//全局样式
import 'normalize.css'
import './index.scss'

const app = createApp(App)
const pinia = createPinia()
//状态持久化
pinia.use(piniaPluginPersist)
app.use(pinia)
app.use(ElmentPlus)
installRouter(app)
// 全局指令
installDirective(app)
// 全局组件
installComponents(app)
app.mount('#app')
