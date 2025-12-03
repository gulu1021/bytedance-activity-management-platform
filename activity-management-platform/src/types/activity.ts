export interface Activity {
  id: number
  title: string
  status: '进行中' | '未开始' | '已结束' | '已取消'
  startTime: string
  endTime: string
  creator: string
  type: '促销' | '节日' | '会员' | '常规'
  cover: string
  participants: number
  description?: string
  rules?: string
  data?: {
    participants: number
    pageViews: number
    conversionRate: number
  }
}

export interface ActivityListResponse {
  data: Activity[]
  total: number
  page: number
  pageSize: number
}

export interface ActivityFilterParams {
  status?: string
  type?: string
  keyword?: string
  page?: number
  pageSize?: number
  dateRange?: [string, string]
}

export interface Banner {
  id: number
  image: string
  title: string
  description: string
}

export interface Announcement {
  id: number
  title: string
  time: string
  content: string
}