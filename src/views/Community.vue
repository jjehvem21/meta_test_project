<template>
  <div class="community-page">
    <PullToRefresh @refresh="handleRefresh">
      <div class="header">
        <h1>社区发现</h1>
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="{ active: activeTab === tab.value }"
            @click="changeTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="hot-recommend" v-if="hotItems.length > 0">
        <h2>热门推荐</h2>
        <div class="hot-list">
          <CommunityCard
            v-for="item in hotItems"
            :key="item.id"
            :item="item"
            @click="handleCardClick(item)"
          />
        </div>
      </div>

      <h2>最新内容</h2>
      <Waterfall :items="list" :column-count="2" :gap="12">
        <template #default="{ item }">
          <CommunityCard :item="item" @click="handleCardClick(item)" />
        </template>
      </Waterfall>

      <infinite-loading
        @infinite="loadMore"
        :identifier="infiniteId"
      >
        <template #spinner>
          <div class="loading">加载中...</div>
        </template>
        <template #no-more>
          <div class="no-more">没有更多内容了</div>
        </template>
        <template #no-results>
          <div class="no-results">暂无内容</div>
        </template>
      </infinite-loading>
    </PullToRefresh>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import PullToRefresh from '@/components/CustomPullRefresh.vue'

import Waterfall from '@/components/Waterfall.vue'
import CommunityCard from '@/components/CommunityCard.vue'
import { getCommunityList, getHotRecommendations } from '@/api/community'

export default {
  name: 'CommunityPage',
  components: {
    PullToRefresh,
    InfiniteLoading,
    Waterfall,
    CommunityCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const list = ref([])
    const hotItems = ref([])
    const loading = ref(false)
    const page = ref(1)
    const size = ref(10)
    const hasMore = ref(true)
    const infiniteId = ref(+new Date())

    const tabs = [
      { label: '全部', value: 'all' },
      { label: '视频', value: 'video' },
      { label: '图片', value: 'image' },
      { label: '热门', value: 'hot' }
    ]

    const activeTab = computed(() => {
      return route.query.type || 'all'
    })

    // 获取热门推荐
    const fetchHotRecommendations = async () => {
      try {
        const res = await getHotRecommendations()
        console.log(res)
        // hotItems.value = res.list || []
      } catch (error) {
        console.error('获取热门推荐失败:', error)
      }
    }

    // 获取列表数据
    const fetchList = async (reset = false) => {
      if (loading.value) return

      loading.value = true
      try {
        const params = {
          page: reset ? 1 : page.value,
          size: size.value,
          type: activeTab.value
        }

        const res = await getCommunityList(params)

        if (reset) {
          list.value = res.list || []
          page.value = 1
        } else {
          list.value = [...list.value, ...(res.list || [])]
        }

        hasMore.value = res.hasMore
        if (reset) {
          infiniteId.value += 1
        }

        return res.list || []
      } catch (error) {
        console.error('获取列表失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 初始化加载
    onMounted(() => {
      fetchHotRecommendations()
      fetchList(true)
    })

    // 下拉刷新
    const handleRefresh = async (done) => {
      await Promise.all([
        fetchHotRecommendations(),
        fetchList(true)
      ])
      done()
    }

    // 上拉加载更多
    const loadMore = async ($state) => {
      if (!hasMore.value) {
        $state.complete()
        return
      }

      page.value += 1
      const newItems = await fetchList()

      if (newItems.length > 0) {
        $state.loaded()
      } else {
        $state.complete()
      }
    }

    // 切换标签
    const changeTab = (type) => {
      router.replace({ query: { ...route.query, type } })
      fetchList(true)
    }

    // 卡片点击
    const handleCardClick = (item) => {
      console.log('点击卡片:', item)
      // 这里可以跳转到详情页
    }

    return {
      list,
      hotItems,
      tabs,
      activeTab,
      infiniteId,
      handleRefresh,
      loadMore,
      changeTab,
      handleCardClick
    }
  }
}
</script>

<style scoped>
.community-page {
  padding: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  margin-bottom: 16px;
}

.header h1 {
  font-size: 24px;
  margin: 0 0 12px;
}

.tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.tabs button {
  flex: none;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: #f5f5f5;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.tabs button.active {
  background: #ff2442;
  color: white;
}

h2 {
  font-size: 18px;
  margin: 16px 0 12px;
  color: #333;
}

.hot-list {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
}

.hot-list .community-card {
  flex: 0 0 70%;
  max-width: 70%;
}

.loading,
.no-more,
.no-results {
  text-align: center;
  padding: 16px;
  color: #999;
  font-size: 14px;
}
</style>
