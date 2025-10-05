<script setup lang="ts">
import { useGithubStore } from '@/stores/github';

const store = useGithubStore();

</script>

<template>
  <header class="header">
    <h1 @click="$router.push('/')" class="nav-title">Commit Explorer</h1>
    <nav>
      <ul class="navList">
        <li>
          <RouterLink v-if="!store.loading && !store.error && Object.keys(store.favourites).length > 0"
            to="/favourites-commits" class="navItem">
            List favourite commits
          </RouterLink>
        </li>
      </ul>
    </nav>

  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background: #55d6aa;
  padding: 0 7rem;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75);
  text-transform: capitalize;
}

.navList {
  display: flex;
  list-style: none;
  gap: 3rem;
}

.navItem {
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  cursor: pointer;
  color: #444;
}

.navItem:hover {
  color: #000;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.nav-title {
  cursor: pointer;
}
</style>
