import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/repos/:username',
      name: 'repos',
      component: () => import('@/views/RepoView.vue'),
    },
    {
      path: '/favourites-commits',
      name: 'favourites',
      component: () => import('@/components/navigation/FavouritesList.vue'),
    },
  ],
});

export default router;
