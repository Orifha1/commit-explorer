export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  body?: T;
  errors?: string[];
  status?: number;
}

export interface IGithubRepo {
  id?: number;
  name: string;
  description: string;
}

export interface IGithubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

export interface IGithubCommitDetail {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  files?: {
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: string;
    raw_url: string;
    blob_url: string;
    patch?: string;
  }[];
}

export interface IGithubState {
  username: string;
  repos: IGithubRepo[];
  commits: Record<string, IGithubCommit[]>;
  commitDetails: Record<string, IGithubCommitDetail>;
  favourites: Record<string, IGithubCommitDetail>;
  loading: boolean;
  error: string | null;
}
