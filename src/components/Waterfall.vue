<template>
  <div class="waterfall-container">
    <div class="waterfall-column" v-for="(col, index) in columns" :key="index" :style="{ width: columnWidth }">
      <slot v-for="item in col" :item="item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Waterfall',
  props: {
    items: {
      type: Array,
      required: true
    },
    columnCount: {
      type: Number,
      default: 2
    },
    gap: {
      type: Number,
      default: 12
    }
  },
  computed: {
    columns() {
      const cols = Array.from({ length: this.columnCount }, () => [])
      this.items.forEach((item, index) => {
        cols[index % this.columnCount].push(item)
      })
      return cols
    },
    columnWidth() {
      return `calc(${100 / this.columnCount}% - ${this.gap / 2}px)`
    }
  }
}
</script>

<style scoped>
.waterfall-container {
  display: flex;
  justify-content: space-between;
  margin: 0 -6px;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  margin: 0 6px;
}
</style>
