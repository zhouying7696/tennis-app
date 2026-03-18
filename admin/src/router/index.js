import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UsersList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/create',
      name: 'createUser',
      component: () => import('../views/users/CreateUser.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/edit/:id',
      name: 'editUser',
      component: () => import('../views/users/EditUser.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/activities/ActivitiesList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/create',
      name: 'createActivity',
      component: () => import('../views/activities/CreateActivity.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/edit/:id',
      name: 'editActivity',
      component: () => import('../views/activities/EditActivity.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/venues',
      name: 'venues',
      component: () => import('../views/venues/VenuesList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/venues/create',
      name: 'createVenue',
      component: () => import('../views/venues/CreateVenue.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/venues/edit/:id',
      name: 'editVenue',
      component: () => import('../views/venues/EditVenue.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tournaments',
      name: 'tournaments',
      component: () => import('../views/tournaments/TournamentsList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tournaments/create',
      name: 'createTournament',
      component: () => import('../views/tournaments/CreateTournament.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tournaments/edit/:id',
      name: 'editTournament',
      component: () => import('../views/tournaments/EditTournament.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const token = localStorage.getItem('token')
  
  if (requiresAuth && !token) {
    // 未登录，跳转到登录页
    ElMessage.warning('请先登录')
    next({ path: '/login' })
  } else if (to.path === '/login' && token) {
    // 已登录，跳转到首页
    next({ path: '/' })
  } else {
    next()
  }
})

// 自动退出机制（1小时无操作）
let inactivityTimer

function resetInactivityTimer() {
  clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.info('长时间未操作，已自动退出登录')
    router.push('/login')
  }, 60 * 60 * 1000) // 1小时
}

// 监听用户操作
window.addEventListener('mousemove', resetInactivityTimer)
window.addEventListener('keypress', resetInactivityTimer)
window.addEventListener('scroll', resetInactivityTimer)
window.addEventListener('click', resetInactivityTimer)

// 初始化定时器
resetInactivityTimer()

export default router
