<template>
  <div class="community-card" @click="handleClick">
    <div class="media-container">
      <img
        v-if="item.type === 'image'"
        :src="item.media"
        :alt="item.title"
        loading="lazy"
      />
      <video
        v-else
        :src="item.media"
        :poster="item.media + '?x-oss-process=video/snapshot,t_1000,f_jpg,w_300'"
        controls
        playsinline
        webkit-playsinline
        x5-playsinline
      ></video>
    </div>

    <div class="content">
      <h3 class="title">{{ item.title }}</h3>
      <p class="desc" v-if="item.content">{{ item.content }}</p>

      <div class="user-info">
        <img class="avatar" :src="item.user.avatar" :alt="item.user.name" />
        <span class="name">{{ item.user.name }}</span>
        <span class="verified" v-if="item.user.verified">✓</span>
      </div>

      <div class="stats">
        <span class="likes">❤ {{ formatCount(item.likes) }}</span>
        <span class="comments">💬 {{ formatCount(item.comments) }}</span>
        <span class="shares">↗ {{ formatCount(item.shares) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.item)
    },
    formatCount(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    }
  }
}
</script>

<style scoped>
.community-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.media-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  overflow: hidden;
}

.media-container img,
.media-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 12px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 6px;
}

.name {
  font-size: 12px;
  color: #333;
}

.verified {
  color: #1da1f2;
  font-size: 12px;
  margin-left: 4px;
}

.stats {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.stats span {
  margin-right: 12px;
}
</style>
