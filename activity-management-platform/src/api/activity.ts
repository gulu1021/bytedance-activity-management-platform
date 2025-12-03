import type { Activity, ActivityListResponse, ActivityFilterParams } from '../types/activity'

// 模拟数据
let mockActivities: Activity[] = [
  {
    id: 1,
    title: '春节促销活动',
    status: '进行中',
    startTime: '2024-01-20T00:00:00',
    endTime: '2024-02-20T23:59:59',
    creator: '张三',
    type: '节日',
    cover: 'https://picsum.photos/300/200',
    participants: 1500,
    description: '春节特别促销活动，全场商品优惠',
    rules: '活动期间购买指定商品享受优惠'
  },
  // 添加更多模拟数据...
]

export const getActivities = (params: ActivityFilterParams = {}): Promise<ActivityListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...mockActivities]
      
      // 筛选逻辑
      if (params.status) {
        data = data.filter(item => item.status === params.status)
      }
      if (params.type) {
        data = data.filter(item => item.type === params.type)
      }
      if (params.keyword) {
        data = data.filter(item => item.title.includes(params.keyword || ''))
      }
      
      // 分页逻辑
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageData = data.slice(start, end)
      
      resolve({
        data: pageData,
        total: data.length,
        page,
        pageSize
      })
    }, 500)
  })
}

export const getActivityDetail = (id: number): Promise<{ data: Activity }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activity = mockActivities.find(item => item.id === id)
      if (activity) {
        activity.data = {
          participants: Math.floor(Math.random() * 10000),
          pageViews: Math.floor(Math.random() * 50000),
          conversionRate: Number((Math.random() * 1).toFixed(2))
        }
        resolve({ data: activity })
      } else {
        reject(new Error('活动不存在'))
      }
    }, 300)
  })
}