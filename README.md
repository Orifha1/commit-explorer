### Prerequisites

Ensure that you have **Node.js** and **npm** installed.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Application Structure

src/
├── api/
│ └── base.ts # base fetch method used to call the api
│
├── components/
│ ├── CommitsTable.vue # deals with the list of commits
│ ├── FavouritesList.vue # deals with the list of favourite commits and has a remove button to remove from the favourites list.
│ └── navigation/
│ └── NavBar.vue # consist of the application navigation bar / header
│
├── lib/
│ └── types.ts # this folder consist of all the application types and interfaces
│
├── router/
│ └── index.ts # consist of our application routes
│
├── store/
│ └── github.ts # this consist of the store for our state management for repos and commits
│
├── views/
│ ├── HomeView.vue # This is where the user enters their username to get there repos. On success, the user is redirected to the RepoView.vue
│ └── RepoView.vue # Here a list repos is shown in a table format. The table consists of an actions column that a user can click to view the commits of that specific repo. On success, a new table with a list commit of commits is shown and a link on the navbar to appears. The link takes you to a list of favourite commits(if there are no favourites in the list, it does not exist). The table consist of the an actions column to view the details of the commit.
A modal appears and within the modal, there is a button to mark as a favourite commit.
│
└── main.ts # application entry point
