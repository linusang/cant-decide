# Vue 3 + Typescript + Vite + TailwindCSS + Vitest + ESLint + Prettier

This template should help get you started developing with Vue 3 and Typescript in Vite.

### Opinionated Starter Kit

Uses the additional following libraries:

1. [Tailwind CSS](https://tailwindcss.com/) (because utility-CSS scales better)
2. [Vitest](https://vitest.dev/) (because running tests should be fast)
3. [Prettier](https://prettier.io/) (auto-formats when save in VS Code)
4. [ESLint](https://eslint.org/) (Fix problems in your TypeScript Code)
5. [simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort) (Sort import statements)
6. [unplugin-icons](https://github.com/antfu/unplugin-icons) (iconify: the definitive icon library)

### Getting Started

Make sure you have [git](https://git-scm.com/) and [node](https://nodejs.org/) installed.

Navigate to your desired folder to save the files
and execute the following commands:

```
npx degit https://github.com/linusang/vite-starter-kit.git

// say yes if prompted

npm install

// if you use git

git init

// running the app

npm run dev

// open browser and navigate to http://localhost:3333

```

### Run in the browser

Don't want to clone to your desktop? Just run in the browser!

https://stackblitz.com/github/linusang/vite-starter-kit

### For Testing

- Vitest to test business logic (use `npm run vitest`)

### For CSS

- Uses Tailwind CSS because of this [article](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)
- Makes use of [JIT feature](https://www.youtube.com/watch?v=3O_3X7InOw8)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vue Language Features](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Icons

1. Go to [icones.js.org](https://icones.js.org/).
2. Select a collection, then do `npm install @iconify-json/[collection id]` if you don't have the collection installed.
3. Import in Vue file, eg: `import HeroiconsRocketLaunchSolid from '~icons/heroicons/rocket-launch-solid'`
4. In template, use `<HeroiconsRocketLaunchSolid/>`

# Updating dependencies

If you need to install the latest dependencies you can run `npx taze` to check which npm packages are outdated. Then run `npx taze -w` if you are sure that the minor versions can be overwritten in package.json. Thereafter, run `npm install` to install the latest packages.

# Using with `bun`

Make sure you have [bun](https://bun.sh/) installed.

```bash
# point to bun install directory

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bunx degit https://github.com/linusang/vite-starter-kit.git#bun

# say yes if prompted

bun install

# if you use git

git init

# running the app

bun run dev

# open browser and navigate to http://localhost:3333

```
