import {
    createRouter,
    createWebHistory
} from 'vue-router'
import Home from '../components/Home.vue'
import Video from '../components/Video.vue'

const routes = [{
    path: '/file/:pathMatch(.*)*',
    name: 'home',
    component: Home
}, {
    path: '/',
    redirect: '/file/'
}, {
    path: '/video',
    name: 'video',
    component: Video,
}]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router