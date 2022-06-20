# generator-g-next

## Commands

### yo g-next:app

Execute `npx create-next-app@latest` with support for NPM, TypeScript in the current directory (so you should first create a repo, clone locally, and tun this command inside this repo).

### yo g-next:init

This will:
- install all basic packages for code linting and styling (by fixing the eslint plugin used by default by Next and installing prettier).
- add husky and lint-staged in order to clean the code before committing to the repo.
- add the AppHead component
- add the GeNYG config file .genyg.json

### yo g-next:page

It creates a new page with a hook file

### yo g-next:compo

It creates a new component with a hook file

## TODO

### yo g-next:comp

- Add the possibility to create a new subfolder in ./components
