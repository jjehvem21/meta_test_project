import { createRouter, createWebHistory } from 'vue-router'
import Community from '@/views/Community.vue'

const routes = [
  {
    path: '/',
    name: 'Community',
    component: Community,
    // 路由元信息，可用于权限控制等
    meta: {
      title: '233乐园 - 社区发现'
    }
  },
  // {
  //   path: '/post/:id',
  //   name: 'PostDetail',
  //   component: PostDetail,
  //   props: true, // 将路由参数作为props传递
  //   meta: {
  //     title: '内容详情'
  //   }
  // },
  // {
  //   path: '/user/:id',
  //   name: 'UserProfile',
  //   component: UserProfile,
  //   props: true,
  //   meta: {
  //     title: '用户主页'
  //   }
  // },
  // 404 页面
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/'
  // }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  // 滚动行为控制
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { top: 0 }
  //   }
  // }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '233乐园'
  next()
})

export default router
