import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/mock-config',
        redirect: '/'
    },
    {
        path: '/',
        name: 'MockConfig',
        component: () => import('../views/MockConfig.vue'),
        meta: {
            title: 'Mock配置'
        }
    },
    {
        path: '/mock-app',
        name: 'MockApp',
        component: () => import('../views/MockApp.vue'),
        meta: {
            title: 'Mock应用'
        }
    },
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('../views/404.vue'),
        meta: {
            title: '未知页面'
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = 'Mock - ' + to.meta.title
    }
    next()
})

export default router
