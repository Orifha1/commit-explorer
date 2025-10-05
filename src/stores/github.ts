import { get } from '@/api/base';
import type { IGithubCommit, IGithubCommitDetail, IGithubRepo, IGithubState } from '@/lib/types';
import { defineStore } from 'pinia';

export const useGithubStore = defineStore('github', {
  state: (): IGithubState => ({
    username: '',
    repos: [],
    commits: {},
    commitDetails: {},
    favourites: {},
    loading: false,
    error: null,
  }),
  getters: {},
  actions: {
    // Get repos using username.
    async getRepositories(body: { username: string }) {
      this.loading = true;
      this.error = null;
      this.username = body.username;

      //Fetch data from the github rest API.
      const res = await get<IGithubRepo[]>(`https://api.github.com/users/${body.username}/repos`);

      if (res.success && res.body) {
        console.log(res.body);
        if (res.body.length > 0) {
          this.repos = res.body;
        } else {
          this.error =
            'User does not exist or does not have any repos. Please verify your username';
        }
      } else {
        this.error = res.errors?.join(',') || 'Failed to fetch the repositories';
      }

      this.loading = false;
    },

    // Get repository commits using username.
    async getCommits(body: { username: string; repo: string; page: number }) {
      this.loading = true;
      this.error = null;

      //Fetch data from the github rest API and add the page number required and how many results should be returned.
      const res = await get<IGithubCommit[]>(
        `https://api.github.com/repos/${body.username}/${body.repo}/commits?page=${body.page}&per_page=10`,
      );

      if (res.success && res.body) {
        console.log('rot: ', res.body);
        if (res.body.length > 0) {
          this.commits[body.repo] = res.body;
        } else {
          this.error = 'No commits found';
        }
      } else {
        if (res.errors?.some((e) => e.includes('403'))) {
          this.error = 'The Github APi rate limit has been reached. Please try again later';
        } else {
          this.error = res.errors?.join(',') || 'Failed to fetch the commits';
        }
      }

      this.loading = false;
    },

    async getCommitDetails(body: { username: string; repoName: string; sha: string }) {
      this.loading = true;
      this.error = null;

      //Fetch data from the github rest API.
      const res = await get<IGithubCommitDetail>(
        `https://api.github.com/repos/${body.username}/${body.repoName}/commits/${body.sha}`,
      );

      if (res.success && res.body) {
        this.commitDetails[body.sha] = res.body;
      } else {
        this.error = res.errors?.join(',') || 'Failed to fetch the commit details';
      }
      this.loading = false;
    },
    /**
     * Adds a commit to the favourites list
     * The commit is stored in the favourites state object.
     * This is keyed by its sha.
     */
    addFavourite(body: { commit: IGithubCommitDetail }) {
      this.favourites[body.commit.sha] = body.commit;
    },

    /**
     * Removes a commit to the favourites list.
     * This uses the sha to delete the corresponding commit
     */
    removeFavourite(body: { sha: string }) {
      delete this.favourites[body.sha];
    },

    /**
     * Checks if the commit is currently marked as favourate
     */
    isFavourite(body: { sha: string }) {
      return !!this.favourites[body.sha];
    },
  },
});
