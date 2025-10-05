<script setup lang="ts">
import { useGithubStore } from '@/stores/github';
import { computed } from 'vue';
const store = useGithubStore();

const favouriteCommits = computed(() => Object.values(store.favourites));

const onRemoveFavourite = (sha: string) => {
  store.removeFavourite({ sha });
};
</script>

<template>
  <main class="container">
    <div class="content-container">
      <div class="text-container">
        <h1 class="title">Favourite Commits </h1>
      </div>
      <div v-if="favouriteCommits.length === 0">
        <p>No favourite commits yet.</p>
      </div>
      <ul v-else>
        <li v-for="commit in favouriteCommits" :key="commit.sha" class="list-item">
          <p><strong>{{ commit.commit.message }}</strong> by {{ commit.commit.author.name }}</p>
          <button @click="onRemoveFavourite(commit.sha)" class="delete-button">Remove</button>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
}

.text-container {
  text-align: center;
  margin-bottom: 20px;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px
}

.list-item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
</style>
