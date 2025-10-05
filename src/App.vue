<script setup lang="ts">
import Navbar from '@/components/navigation/NavBar.vue';
import { useGithubStore } from './stores/github';
const store = useGithubStore();
</script>

<template>
  <!-- Navbar -->
  <Navbar />
  <div class="error-message">
    {{ store.error }}
  </div>
  <RouterView />
  <!-- Global Alert -->
</template>

<style scoped>
.error-message {
  display: flex;
  justify-content: center;
  margin-bottom: 5%;
  font-size: 2.5rem;
  color: red;
  font-weight: bold;
  margin: 10px 0;
}
</style>
