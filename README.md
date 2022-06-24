# generator-g-next

## Commands

### yo g-next:app

Execute `npx create-next-app@latest` with support for NPM, TypeScript in the current directory (so you should first create a repo, clone locally, and tun this command inside this repo).

### yo g-next:pkg-core

This will:
- install all basic packages for code linting and styling (by fixing the eslint plugin used by default by Next and installing prettier).
- add husky and lint-staged in order to clean the code before committing to the repo.
- add the AppHead component
- add the GeNYG config file .genyg.json

### yo g-next:pkg-mui

#### dependencies: pkg-core

It will install all MUI related dependencies, that is:
- MUI core
- MUI icons
- react-hook-form
- yup validation support
- _form basic components based on MUI and react-hook-form

### yo g-next:pkg-spa

#### dependencies: pkg-core

It installs everything needed to add an SPA page into the Next application.\
In particular it will install:
- react-router-dom libs
- redux libs plus plugins
- axios for ajax support

### yo g-next:model

#### dependencies: pkg-core

It creates a new model inside `./models/server` or `./models/client` folder, depending on the usage of the model, client if it is supposed to run in the frontend in React, server if it supposed to run in the backend with NodeJS.\
Having different folders and files (even to represent the same entity) from backend and frontend avoids issues when loading browser-related code in the backend code, or file-system-related code in the frontend.

### yo g-next:scene

#### dependencies: pkg-spa

It creates a new scene for the specified SPA.

### yo g-next:page

It creates a new page with a hook file [WIP]

### yo g-next:comp

It creates a new component with a hook file [WIP]

## TODO

### yo g-next:pkg-core

- Add support for [mocked HTTP calls](https://www.paigeniedringhaus.com/blog/how-to-unit-test-next-js-api-routes-with-typescript) in order to test APIs
- It should support more envs (at least locale, test, staging and production ones)

### yo g-next:model-mongo

- It should create a new model inside `./models/server` folder with the mongoDB model template

### yo g-next:page

- It should allow to create dynamic routes (both single `[param]` and multiple `[[params]]`

### yo g-next:comp

- It should allow to select also subfolders of ./components and ./pages

### yo g-next:ajax

- It should allow to create an AJAX function.\

### yo g-next:pkg-mongo

- It should copy mongo db libraries inside the `lib` folder
- It should install mongodb dependencies to the package json
- It should also add mongo env vars to the env files

### yo g-next:api

- It should allow to create a new API starting from a route and a method
- It should create a new subfolder in the `./endpoints` folder with the API files inside
- It should connect this endpoint function to the Next `./api` folder and its configuration files


### yo g-next:pkg-cognito

- It should add all the backend library files inside the `./lib` folder
- It should add all fe and be dependencies to the package json
- It should copy the CognitoAuthManager model to the `./models/client` folder
- It should add all the required env vars to all env files
