<template>
  <div
    class="pull-to-refresh-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    :style="{ transform: `translateY(${pullDistance}px)` }"
  >
    <div class="refresh-indicator" :class="{ active: isRefreshing }">
      <div v-if="!isRefreshing">
        <span v-if="pullDistance < refreshThreshold">下拉刷新</span>
        <span v-else>释放刷新</span>
      </div>
      <div v-else class="loading">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PullToRefresh',
  props: {
    onRefresh: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const pullDistance = ref(0)
    const startY = ref(0)
    const isRefreshing = ref(false)
    const refreshThreshold = 80 // 触发刷新的阈值

    const handleTouchStart = (e) => {
      if (isRefreshing.value) return

      // 只有在页面顶部时才允许下拉刷新
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) return

      startY.value = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (isRefreshing.value || startY.value === 0) return

      const y = e.touches[0].clientY
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

      // 只有在顶部且下拉时才触发
      if (scrollTop <= 0 && y > startY.value) {
        e.preventDefault()
        // 使用阻尼效果，下拉距离越大阻力越大
        const distance = Math.min(
          (y - startY.value) * 0.6,
          refreshThreshold * 1.5
        )
        pullDistance.value = distance
      }
    }

    const handleTouchEnd = async () => {
      if (isRefreshing.value || startY.value === 0) return

      startY.value = 0

      if (pullDistance.value >= refreshThreshold) {
        isRefreshing.value = true
        try {
          await props.onRefresh()
        } finally {
          // 刷新完成后恢复
          setTimeout(() => {
            pullDistance.value = 0
            isRefreshing.value = false
          }, 300)
        }
      } else {
        // 未达到阈值，回弹
        pullDistance.value = 0
      }
    }

    return {
      pullDistance,
      isRefreshing,
      refreshThreshold,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    }
  }
}
</script>

<style scoped>
.pull-to-refresh-container {
  transition: transform 0.3s ease;
  position: relative;
}

.refresh-indicator {
  position: absolute;
  width: 100%;
  height: 60px;
  top: -60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.refresh-indicator.active {
  color: #1890ff;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
