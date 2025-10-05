<script setup lang="ts">
import { useGithubStore } from '@/stores/github';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const store = useGithubStore();
const router = useRouter();

const username = ref('')
// Submit username to github api.
const onSubmit = async () => {
  if (!username.value.trim()) {
    return;
  }
  await store.getRepositories({ username: username.value.trim() }); // fetch repos.

  if (!store.error && store.repos.length > 0) {
    router.push({ name: 'repos', params: { username: username.value.trim() } });
  }
}
</script>

<template>
  <main class="container">
    <div class="text-container">
      <h1 class="title">Welcome to the commit explorer</h1>
      <h3>Enter a Github username to view the repositories</h3>
    </div>
    <div class="form-container">
      <form @submit.prevent="onSubmit" class="input-form">
        <div class="input-container">
          <label for="" class="form-input">
            Username
            <input v-model="username" type="text" placeholder="Enter username" :disabled="store.loading">
          </label>
          <p v-if="store.error" class="input-error">{{ store.error }}</p>
        </div>

        <button type="submit" class="btn" :disabled="store.loading">
          {{ store.loading ? 'Loading...' : 'Submit' }}
        </button>
      </form>
    </div>

  </main>
</template>
<style scoped>
.title {
  font-size: 3rem;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 7%;
}

.form-container {
  width: 400px;
  margin: 0 auto;
  background-color: #fcfcfc;
  padding: 20px 50px 40px;
  box-shadow: 1px 4px 10px 1px #aaa;
  border-radius: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  gap: 5px;
}

.form-input {
  font-size: 2rem;
  border-top: 20px solid transparent;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
}

.form-input input {
  appearance: none;
  background: #f2f2f2;
  border-radius: 3px;
  outline: none;
  font-size: 14px;
  padding: 12px;
}

.text-container {
  text-align: center;
  margin-bottom: 20px;
}

.btn {
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  padding: 12px 30px;
  border-radius: 100px;
  font-size: 1.4rem;
  border: none;
  background: #55d6aa;
}

.btn:hover {
  color: #fff;
  cursor: pointer;
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-error {
  color: red;
  font-size: 1.3rem;
}
</style>
