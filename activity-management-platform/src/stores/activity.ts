import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity, ActivityFilterParams } from '../types/activity'
import { getActivities, getActivityDetail } from '../api/activity'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const currentActivity = ref<Activity | null>(null)
  const loading = ref(false)
  
  const fetchActivities = async (params: ActivityFilterParams = {}) => {
    loading.value = true
    try {
      const response = await getActivities(params)
      activities.value = response.data
      return response
    } finally {
      loading.value = false
    }
  }
  
  const fetchActivityDetail = async (id: number) => {
    loading.value = true
    try {
      const response = await getActivityDetail(id)
      currentActivity.value = response.data
      return response
    } finally {
      loading.value = false
    }
  }
  
  return {
    activities,
    currentActivity,
    loading,
    fetchActivities,
    fetchActivityDetail
  }
})