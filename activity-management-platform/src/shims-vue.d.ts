declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Semi-UI 类型声明
declare module '@douyinfe/semi-ui' {
  export const Layout: any
  export const Nav: any
  export const Button: any
  export const Card: any
  export const Row: any
  export const Col: any
  export const Space: any
  export const Radio: any
  export const RadioGroup: any
  export const RadioButton: any
  export const Carousel: any
  export const List: any
  export const Avatar: any
  export const Tag: any
  export const Form: any
  export const Select: any
  export const Input: any
  export const DatePicker: any
  export const Pagination: any
  export const Descriptions: any
  export const Statistic: any
  export const PageHeader: any
  export const Message: any
}