<template>
  <s-layout>
    <s-layout-header>
      <s-page-header title="活动列表" @back="goBack" />
    </s-layout-header>
    <s-layout-content>
      <div class="list-container">
        <!-- 筛选区域 -->
        <s-card title="活动筛选" class="filter-card">
          <s-form :model="filterForm" layout="inline" @submit="handleFilter">
            <s-form-item label="活动状态">
              <s-select v-model="filterForm.status" placeholder="请选择状态" style="width: 120px" allow-clear>
                <s-option value="进行中">进行中</s-option>
                <s-option value="未开始">未开始</s-option>
                <s-option value="已结束">已结束</s-option>
                <s-option value="已取消">已取消</s-option>
              </s-select>
            </s-form-item>
            
            <s-form-item label="活动类型">
              <s-select v-model="filterForm.type" placeholder="请选择类型" style="width: 120px" allow-clear>
                <s-option value="促销">促销</s-option>
                <s-option value="节日">节日</s-option>
                <s-option value="会员">会员</s-option>
                <s-option value="常规">常规</s-option>
              </s-select>
            </s-form-item>
            
            <s-form-item label="关键词">
              <s-input v-model="filterForm.keyword" placeholder="请输入活动标题关键词" style="width: 200px" />
            </s-form-item>
            
            <s-form-item>
              <s-space>
                <s-button type="primary" html-type="submit" :loading="loading">搜索</s-button>
                <s-button @click="handleReset">重置</s-button>
              </s-space>
            </s-form-item>
          </s-form>
        </s-card>

        <!-- 列表区域 -->
        <s-card title="活动列表" class="list-card">
          <!-- 骨架屏 -->
          <div v-if="loading && activities.length === 0" class="skeleton-container">
            <s-skeleton active :paragraph="{ rows: 8 }" />
          </div>

          <!-- 活动列表 -->
          <s-list 
            v-else
            :data-source="activities"
            :pagination="pagination"
            :loading="loading"
          >
            <template #renderItem="{ item }">
              <s-list-item class="list-item" @click="goToDetail(item.id)">
                <s-list-item-meta
                  :description="`创建人: ${item.creator} | 开始时间: ${formatDate(item.startTime)}`"
                >
                  <template #title>
                    <a href="javascript:;">{{ item.title }}</a>
                    <s-tag :color="getStatusColor(item.status)" style="margin-left: 8px">
                      {{ item.status }}
                    </s-tag>
                    <s-tag style="margin-left: 4px">{{ item.type }}</s-tag>
                  </template>
                  <template #avatar>
                    <s-avatar :src="item.cover" shape="square" size="large" />
                  </template>
                </s-list-item-meta>
                
                <template #actions>
                  <span>结束时间: {{ formatDate(item.endTime) }}</span>
                  <span>参与人数: {{ item.participants }}</span>
                </template>
              </s-list-item>
            </template>
          </s-list>
        </s-card>
      </div>
    </s-layout-content>
  </s-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import type { ActivityFilterParams } from '../types/activity'

const router = useRouter()
const route = useRoute()
const activityStore = useActivityStore()

// 筛选表单
const filterForm = ref<ActivityFilterParams>({
  status: undefined,
  type: undefined,
  keyword: ''
})

const loading = ref(false)

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
})

// 活动列表
const activities = computed(() => activityStore.activities)

// 状态颜色映射
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '进行中': 'green',
    '未开始': 'blue',
    '已结束': 'default',
    '已取消': 'red'
  }
  return colors[status] || 'default'
}

// 日期格式化
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// 筛选处理
const handleFilter = async () => {
  pagination.value.current = 1
  await fetchActivities()
  updateURL()
}

// 重置筛选
const handleReset = () => {
  filterForm.value = {
    status: undefined,
    type: undefined,
    keyword: ''
  }
  pagination.value.current = 1
  fetchActivities()
  updateURL()
}

// 获取活动列表
const fetchActivities = async () => {
  const params = {
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...filterForm.value
  }
  
  // 清理空值
  Object.keys(params).forEach(key => {
    if ((params as any)[key] === undefined || (params as any)[key] === null || (params as any)[key] === '') {
      delete (params as any)[key]
    }
  })
  
  try {
    const response = await activityStore.fetchActivities(params)
    pagination.value.total = response.total
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
}

// 更新URL参数
const updateURL = () => {
  const query = { ...filterForm.value }
  router.push({ 
    path: route.path, 
    query: { ...query, page: pagination.value.current } 
  })
}

// 从URL参数初始化
const initFromURL = () => {
  const query = route.query
  
  if (query.status) filterForm.value.status = query.status as string
  if (query.type) filterForm.value.type = query.type as string
  if (query.keyword) filterForm.value.keyword = query.keyword as string
  if (query.page) pagination.value.current = parseInt(query.page as string)
}

// 跳转到详情页
const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 监听分页变化
watch(() => pagination.value.current, (newPage) => {
  fetchActivities()
  updateURL()
})

onMounted(() => {
  initFromURL()
  fetchActivities()
})
</script>

<style scoped>
.list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.list-item {
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 12px 0;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.skeleton-container {
  padding: 20px;
}
</style>