import { createApp } from 'vue'
import App from './App.vue'
import { tooltip } from './directives/tooltip'
import './style.css'

const app = createApp(App)
app.directive('tooltip', tooltip)
app.mount('#app')
