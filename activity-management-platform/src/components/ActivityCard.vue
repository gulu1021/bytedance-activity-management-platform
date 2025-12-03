<template>
  <div class="activity-card" @click="$emit('click')">
    <div class="card-image">
      <img :src="activity.cover" :alt="activity.title" />
      <div class="status-badge" :class="activity.status.toLowerCase()">
        {{ activity.status }}
      </div>
    </div>
    <div class="card-content">
      <h3 class="title">{{ activity.title }}</h3>
      <div class="meta">
        <s-tag :color="getTypeColor(activity.type)">{{ activity.type }}</s-tag>
        <span class="time">{{ formatDate(activity.startTime) }}</span>
      </div>
      <div class="creator">创建人: {{ activity.creator }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '../types/activity'

defineProps<{
  activity: Activity
}>()

defineEmits<{
  click: []
}>()

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '促销': 'red',
    '节日': 'orange',
    '会员': 'blue',
    '常规': 'green'
  }
  return colors[type] || 'gray'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.activity-card {
  border: 1px solid var(--semi-color-border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  margin-bottom: 16px;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.status-badge.进行中 { background: var(--semi-color-success); }
.status-badge.未开始 { background: var(--semi-color-warning); }
.status-badge.已结束 { background: var(--semi-color-tertiary); }
.status-badge.已取消 { background: var(--semi-color-danger); }

.card-content {
  padding: 16px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--semi-color-text-0);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.time {
  font-size: 12px;
  color: var(--semi-color-text-2);
}

.creator {
  font-size: 12px;
  color: var(--semi-color-text-3);
}
</style>