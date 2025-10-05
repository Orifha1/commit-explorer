<script setup lang="ts">
import { useGithubStore } from '@/stores/github';
import { computed, ref, watch } from 'vue';
const store = useGithubStore();

const props = defineProps<{
  username: string;
  repoName: string;
}>();
const currentPage = ref(1)
const selectedCommit = ref<string | null>(null);
const showDialog = ref(false);

// Fetch commits when the component mounts or repo changes
watch(
  () => [props.repoName, currentPage.value],
  async () => {
    await store.getCommits({
      username: props.username,
      repo: props.repoName,
      page: currentPage.value,
    })
  },
  { immediate: true }
)

const commits = computed(() => store.commits[props.repoName] || []);

const nextPage = () => {
  currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const expandedRepo = ref<string | null>(null)

const onViewCommitDetails = async (sha: string) => {
  selectedCommit.value = sha;
  await store.getCommitDetails({ username: props.username, repoName: props.repoName, sha });

  showDialog.value = true;
}

const closeDialog = () => {
  showDialog.value = false;
  selectedCommit.value = null;
};

</script>

<template>
  <main class="container">
    <div class="content-container">
      <div class="text-container">
        <h1 class="title">Commits for: {{ username }} </h1>
        <h3>Repository name: {{ repoName }} </h3>
      </div>

      <div v-if="store.loading">Loading...</div>
      <div v-if="store.error">{{ store.error }}</div>

      <table v-if="!store.loading && !store.error && commits.length > 0" class="table-bordered">
        <thead class="table-head">
          <tr>
            <th>Message</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commit in commits" :key="commit.sha">
            <td>{{ commit.commit.message }}</td>
            <td>{{ commit.commit.author.name }}</td>
            <td class="view-details" @click="onViewCommitDetails(commit.sha)">View commits details</td>
          </tr>

          <!-- Show the commits if expanded -->
          <tr v-if="expandedRepo">
            <td>
              <div v-if="store.commits[expandedRepo]">
                <ul>
                  <li v-for="commit in store.commits[expandedRepo]" :key="commit.sha">
                    {{ commit.commit.message }}
                  </li>
                </ul>

              </div>
              <div v-else>
                <p>Loading commits...</p>
              </div>
            </td>

          </tr>
        </tbody>

      </table>
      <!-- Pagination -->
      <div class="pagination" v-if="!store.loading && commits?.length">
        <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
        <span>Page {{ currentPage }}</span>
        <button @click="nextPage">Next</button>
      </div>
    </div>

    <dialog v-if="showDialog" open class="commit-dialog">
      <div class="dialog-content">
        <button class="close-btn" @click="closeDialog">&times;</button>

        <div v-if="selectedCommit && store.commitDetails[selectedCommit]">
          <h2 class="modal-title">Commit Details</h2>
          <p><strong>Author:</strong> {{ store.commitDetails[selectedCommit]?.commit.author.name || 'Unknown' }}</p>
          <p><strong>Author:</strong> {{ store.commitDetails[selectedCommit]?.commit.author.date || 'Unknown' }}</p>
          <p><strong>Message:</strong> {{ store.commitDetails[selectedCommit]?.commit.message || 'No message' }}</p>


          <div class="commit-actions">
            <button
              v-if="selectedCommit && store.commitDetails[selectedCommit] && !store.isFavourite({ sha: selectedCommit })"
              @click="store.addFavourite({ commit: store.commitDetails[selectedCommit]! })" class="favourites-button">
              Mark as Favourite
            </button>

            <button v-else @click="store.removeFavourite({ sha: selectedCommit })" class="favourites-button remove">
              Remove from Favourites
            </button>
          </div>


          <div v-if="store.commitDetails[selectedCommit]?.files?.length" class="files-container">
            <h3>Changed Files</h3>
            <ul class="files-list">
              <li v-for="file in store.commitDetails[selectedCommit]?.files" :key="file.filename" class="file-item">
                <p>
                  <strong>{{ file.filename }}</strong> - {{ file.status }}
                  (Added: {{ file.additions }}, Deleted: {{ file.deletions }})
                </p>
                <div v-if="file.patch" class="file-patch">
                  {{ file.patch }}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p>Loading commit details...</p>
        </div>
      </div>
    </dialog>
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

.content-container {
  width: 100%;
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

.pagination {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 10px;
  margin-bottom: 30px;
}


/* Modal */
.commit-dialog {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  width: 80%;
  height: 80%;
  border-radius: 12px;
  overflow-y: auto;
  padding: 4rem;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 3rem;
  cursor: pointer;
}

.files-list {
  margin-left: 40px;
}

.files-list li {
  list-style: decimal;
}

.modal-title {
  text-align: center;
  margin-bottom: 10px;
  font-size: 3rem;
  font-weight: bold;
}

.files-container {
  margin-top: 10px;
}

.file-patch {
  background-color: #f5f5f5;
  font-family: monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
}
</style>
