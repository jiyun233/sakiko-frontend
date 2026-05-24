import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/MainView.vue'),
    },
    {
        path: '/vote',
        name: 'vote',
        component: () => import('@/views/FeatureVotePage.vue'),
    },
    {
        path: '/features',
        redirect: '/',
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
