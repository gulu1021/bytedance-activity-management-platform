<template>
  <div class="detail-container">
    <s-page-header 
      title="活动详情" 
      @back="goBack"
      class="page-header"
    >
      <template #extra>
        <s-space>
          <s-button v-if="!isEditing" type="primary" @click="startEditing">编辑</s-button>
          <s-button v-else type="primary" :loading="saving" @click="handleSave">保存</s-button>
          <s-button v-if="isEditing" @click="cancelEditing">取消</s-button>
        </s-space>
      </template>
    </s-page-header>

    <div class="content-wrapper">
      <s-spin :spinning="loading">
        <div v-if="activity" class="detail-content">
          <!-- 只读模式 -->
          <div v-if="!isEditing">
            <s-card title="基础信息" class="info-card">
              <s-descriptions :column="2" bordered>
                <s-descriptions-item label="活动标题">{{ activity.title }}</s-descriptions-item>
                <s-descriptions-item label="活动状态">
                  <s-tag :color="getStatusColor(activity.status)">{{ activity.status }}</s-tag>
                </s-descriptions-item>
                <s-descriptions-item label="活动类型">
                  <s-tag>{{ activity.type }}</s-tag>
                </s-descriptions-item>
                <s-descriptions-item label="开始时间">{{ formatDate(activity.startTime) }}</s-descriptions-item>
                <s-descriptions-item label="结束时间">{{ formatDate(activity.endTime) }}</s-descriptions-item>
                <s-descriptions-item label="创建人">{{ activity.creator }}</s-descriptions-item>
                <s-descriptions-item label="参与人数">{{ activity.participants }}</s-descriptions-item>
              </s-descriptions>
            </s-card>

            <s-card title="活动规则" class="info-card">
              <p>{{ activity.rules || '暂无规则说明' }}</p>
            </s-card>

            <s-card title="活动描述" class="info-card">
              <p>{{ activity.description || '暂无描述' }}</p>
            </s-card>

            <s-card title="活动数据" class="info-card" v-if="activity.data">
              <s-row :gutter="16">
                <s-col :span="8">
                  <s-statistic title="参与人数" :value="activity.data.participants" />
                </s-col>
                <s-col :span="8">
                  <s-statistic title="页面浏览量" :value="activity.data.pageViews" />
                </s-col>
                <s-col :span="8">
                  <s-statistic 
                    title="转化率" 
                    :value="(activity.data.conversionRate * 100).toFixed(2)" 
                    suffix="%" 
                  />
                </s-col>
              </s-row>
            </s-card>
          </div>

          <!-- 编辑模式 -->
          <s-form v-else :model="editForm" layout="vertical" class="edit-form">
            <s-card title="编辑活动信息">
              <s-row :gutter="16">
                <s-col :span="12">
                  <s-form-item label="活动标题">
                    <s-input v-model:value="editForm.title" />
                  </s-form-item>
                </s-col>
                <s-col :span="6">
                  <s-form-item label="活动状态">
                    <s-select v-model:value="editForm.status">
                      <s-option value="进行中">进行中</s-option>
                      <s-option value="未开始">未开始</s-option>
                      <s-option value="已结束">已结束</s-option>
                      <s-option value="已取消">已取消</s-option>
                    </s-select>
                  </s-form-item>
                </s-col>
                <s-col :span="6">
                  <s-form-item label="活动类型">
                    <s-select v-model:value="editForm.type">
                      <s-option value="促销">促销</s-option>
                      <s-option value="节日">节日</s-option>
                      <s-option value="会员">会员</s-option>
                      <s-option value="常规">常规</s-option>
                    </s-select>
                  </s-form-item>
                </s-col>
              </s-row>

              <s-row :gutter="16">
                <s-col :span="12">
                  <s-form-item label="开始时间">
                    <s-date-picker 
                      v-model:value="editForm.startTime" 
                      type="datetime"
                      style="width: 100%"
                      value-format="YYYY-MM-DDTHH:mm:ss"
                    />
                  </s-form-item>
                </s-col>
                <s-col :span="12">
                  <s-form-item label="结束时间">
                    <s-date-picker 
                      v-model:value="editForm.endTime" 
                      type="datetime"
                      style="width: 100%"
                      value-format="YYYY-MM-DDTHH:mm:ss"
                    />
                  </s-form-item>
                </s-col>
              </s-row>

              <s-form-item label="活动规则">
                <s-textarea 
                  v-model:value="editForm.rules" 
                  :rows="4" 
                  placeholder="请输入活动规则"
                />
              </s-form-item>

              <s-form-item label="活动描述">
                <s-textarea 
                  v-model:value="editForm.description" 
                  :rows="6" 
                  placeholder="请输入活动详细描述"
                />
              </s-form-item>
            </s-card>
          </s-form>
        </div>

        <!-- 加载状态 -->
        <div v-else-if="loading" class="loading-state">
          <s-skeleton active :paragraph="{ rows: 8 }" />
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <s-empty description="活动不存在或已被删除" />
        </div>
      </s-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import type { Activity } from '../types/activity'

const router = useRouter()
const route = useRoute()
const activityStore = useActivityStore()

// 响应式数据
const isEditing = ref(false)
const saving = ref(false)
const loading = ref(false)

// 获取当前活动详情
const activity = computed(() => activityStore.currentActivity)

// 编辑表单数据
const editForm = ref<Partial<Activity>>({})

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
  return new Date(dateString).toLocaleString('zh-CN')
}

// 开始编辑
const startEditing = () => {
  if (activity.value) {
    editForm.value = { ...activity.value }
    isEditing.value = true
  }
}

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false
  editForm.value = {}
}

// 保存编辑
const handleSave = async () => {
  if (!activity.value) return
  
  saving.value = true
  try {
    await (activityStore as any).updateActivityDetail(activity.value.id, editForm.value)
    isEditing.value = false
    // 显示成功消息
    if (window.$message) {
      window.$message.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
    if (window.$message) {
      window.$message.error('保存失败')
    }
  } finally {
    saving.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取活动详情
const fetchActivityDetail = async () => {
  const id = Number(route.params.id)
  if (!id) return
  
  loading.value = true
  try {
    await activityStore.fetchActivityDetail(id)
  } catch (error) {
    console.error('获取活动详情失败:', error)
    if (window.$message) {
      window.$message.error('获取活动详情失败')
    }
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchActivityDetail()
  }
})

// 组件挂载时获取数据
onMounted(() => {
  fetchActivityDetail()
})
</script>

<script lang="ts">
// 全局类型声明
declare global {
  interface Window {
    $message?: any
  }
}
</script>

<style scoped>
.detail-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 16px 24px;
}

.content-wrapper {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.info-card {
  margin-bottom: 20px;
}

.edit-form {
  max-width: 800px;
}

.loading-state,
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state {
  color: #999;
}
</style>