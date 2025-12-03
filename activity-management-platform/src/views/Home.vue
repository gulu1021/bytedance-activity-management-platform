<template>
  <s-layout>
    <s-layout-header>运营活动管理平台</s-layout-header>
    <s-layout-content>
      <div class="home-container">
        <!-- Banner区域 -->
        <section class="banner-section">
          <s-carousel :autoplay="true" :interval="3000">
            <s-carousel-item v-for="banner in banners" :key="banner.id">
              <div 
                class="banner-item"
                :style="{ backgroundImage: `url(${banner.image})` }"
              >
                <div class="banner-content">
                  <h2>{{ banner.title }}</h2>
                  <p>{{ banner.description }}</p>
                </div>
              </div>
            </s-carousel-item>
          </s-carousel>
        </section>

        <!-- 布局切换 -->
        <section class="control-section">
          <div class="container">
            <s-space>
              <s-radio-group v-model="layoutType" type="button">
                <s-radio value="grid">宫格布局</s-radio>
                <s-radio value="carousel">轮播布局</s-radio>
              </s-radio-group>
              <s-button @click="refreshData">刷新数据</s-button>
            </s-space>
          </div>
        </section>

        <!-- 活动展示 -->
        <section class="activities-section">
          <div class="container">
            <div v-if="layoutType === 'grid'" class="grid-layout">
              <s-row :gutter="16">
                <s-col 
                  v-for="activity in featuredActivities" 
                  :key="activity.id" 
                  :span="8"
                >
                  <ActivityCard 
                    :activity="activity"
                    @click="goToDetail(activity.id)"
                  />
                </s-col>
              </s-row>
            </div>

            <div v-else class="carousel-layout">
              <s-carousel :autoplay="true" :interval="4000">
                <s-carousel-item v-for="(chunk, index) in activityChunks" :key="index">
                  <s-row :gutter="16">
                    <s-col 
                      v-for="activity in chunk" 
                      :key="activity.id" 
                      :span="8"
                    >
                      <ActivityCard 
                        :activity="activity"
                        @click="goToDetail(activity.id)"
                      />
                    </s-col>
                  </s-row>
                </s-carousel-item>
              </s-carousel>
            </div>
          </div>
        </section>

        <!-- 公告区域 -->
        <section class="announcement-section">
          <div class="container">
            <s-card title="平台公告">
              <s-list :data-source="announcements">
                <template #renderItem="{ item }">
                  <s-list-item>
                    <s-list-item-meta>
                      <template #title>
                        <a href="javascript:;" @click="showAnnouncement(item)">{{ item.title }}</a>
                      </template>
                      <template #description>
                        <span>{{ item.time }}</span>
                      </template>
                    </s-list-item-meta>
                  </s-list-item>
                </template>
              </s-list>
            </s-card>
          </div>
        </section>
      </div>
    </s-layout-content>
  </s-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import ActivityCard from '../components/ActivityCard.vue'
import type { Activity, Banner, Announcement } from '../types/activity'

const router = useRouter()
const activityStore = useActivityStore()

const layoutType = ref<'grid' | 'carousel'>('grid')
const featuredActivities = ref<Activity[]>([])

const banners: Banner[] = [
  {
    id: 1,
    image: 'https://picsum.photos/1200/400',
    title: '春节特惠活动',
    description: '全场商品5折起，限时抢购'
  },
  {
    id: 2,
    image: 'https://picsum.photos/1200/401',
    title: '会员专享福利',
    description: '会员独享优惠，积分翻倍'
  }
]

const announcements: Announcement[] = [
  { id: 1, title: '系统维护通知', time: '2024-01-15', content: '系统将于今晚进行维护' },
  { id: 2, title: '春节活动上线', time: '2024-01-10', content: '春节特别开始' }
]

const activityChunks = computed(() => {
  const chunkSize = 3
  const chunks: Activity[][] = []
  for (let i = 0; i < featuredActivities.value.length; i += chunkSize) {
    chunks.push(featuredActivities.value.slice(i, i + chunkSize))
  }
  return chunks
})

const fetchFeaturedActivities = async () => {
  try {
    const response = await activityStore.fetchActivities({ 
      status: '进行中',
      pageSize: 6
    })
    featuredActivities.value = response.data
  } catch (error) {
    console.error('获取活动数据失败:', error)
  }
}

const refreshData = () => {
  fetchFeaturedActivities()
}

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const showAnnouncement = (announcement: Announcement) => {
  // 实现公告详情显示逻辑
  console.log('显示公告:', announcement)
}

onMounted(() => {
  fetchFeaturedActivities()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner-section {
  margin-bottom: 40px;
}

.banner-item {
  height: 300px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.banner-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.control-section {
  background: white;
  padding: 20px 0;
  margin-bottom: 30px;
}

.activities-section {
  margin-bottom: 40px;
}
</style>