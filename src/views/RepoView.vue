<script setup lang="ts">
import CommitsTable from '@/components/navigation/CommitsTable.vue';
import { useGithubStore } from '@/stores/github';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const store = useGithubStore();
const route = useRoute();
const expandedRepo = ref<string | null>(null)
const username = route.params.username as string;

const onSelectRepo = async (repoName: string) => {
  if (expandedRepo.value === repoName) {
    expandedRepo.value = null;
    return;
  }
  expandedRepo.value = repoName
}

onMounted(() => {
  // Get the repos on mount
  if (store.repos.length) {
    store.getRepositories({ username });
  }
})

</script>

<template>
  <main class="container">
    <div>
      <div class="text-container">
        <h1 class="title">Repositorie for: {{ username }}</h1>
        <h3>Select a repo to view the repo details </h3>
      </div>

      <div v-if="store.loading">Loading...</div>
      <div v-if="store.error">{{ store.error }}</div>

      <table v-if="!store.loading && !store.error && store.repos.length > 0" class="table-bordered">
        <thead class="table-head">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repo in store.repos" :key="repo.id">
            <td>{{ repo.name }}</td>
            <td>{{ repo.description || 'No description available' }}</td>
            <td class="view-details" @click="onSelectRepo(repo.name)">View commits</td>
          </tr>
        </tbody>
      </table>
      <!-- Table showing commits -->
      <CommitsTable v-if="expandedRepo" :username="username" :repo-name="expandedRepo" />
    </div>
  </main>
</template>

<style scoped>
.table-bordered {
  width: 100%;
  border-collapse: collapse;
  border-radius: 5px;
}

.table-bordered thead {
  background-color: #f2f2f2;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.title {
  font-size: 3rem;
}

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

.view-details {
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  color: #55d6aa;
}

.view-details:hover {
  color: #000;
}

.favourites-link {
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  padding: 7px 10px;
  background-color: #55d6aa;
  font-size: 1.4rem;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  color: #000;
  margin: 5px;
}

.favourites-link:hover {
  color: #fff;
  cursor: pointer;
}
</style>
