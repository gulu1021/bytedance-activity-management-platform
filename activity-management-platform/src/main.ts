import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 导入 Semi-UI 组件
import { 
  Layout, 
  Nav, 
  Button, 
  Card, 
  Row, 
  Col, 
  Space, 
  Radio, 
  RadioGroup, 
  Carousel,
  List,
  Avatar,
  Tag,
  Form,
  Select,
  Input,
  DatePicker,
  Pagination,
  Descriptions,
} from '@douyinfe/semi-ui'

import '@douyinfe/semi-ui/dist/css/semi.css'

const app = createApp(App)
const pinia = createPinia()

// 注册 Semi-UI 组件
const components = {
  Layout, Nav, Button, Card, Row, Col, Space, Radio, 
  RadioGroup, Carousel, List, Avatar, 
  Tag, Form, Select, Input, DatePicker, Pagination, 
  Descriptions
}

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component)
})

// 挂载 Message 到全局属性
// app.config.globalProperties.$message = Message

app.use(pinia)
app.use(router)
app.mount('#app')