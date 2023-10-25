# generator-g-next

Welcome to the GeNYG project! GeNYG is a generator made with Yeoman by Getapper for scaffolding, development, testing and deployment of applications in NextJS.

## Commands

### yo g-next:app

Execute `npx create-next-app@latest` with support for NPM, TypeScript in the current directory (so you should first create a repo, clone locally, and run this command inside this repo).

### yo g-next:aws-scheduler
**dependencies: pkg-core.**\
Thanks to this command is possible to create a new aws scheduler and select as a target an api destination, in particular:

-It should add a new destination role if none existing or if the user wants to create a new one

-It should add a new scheduler role if none existing or if the user wants to create a new one

-It should add a new connection if none existing or if the user wants to create a new one

-It should create a new event bus if none existing or if the user wants to create a new one

-It should create a target for the selected api destination

-It should add in the endpoint folder all the necessary files in order to manage the ajax calls

-It should create a new scheduler and a new rule with the invocation rate selected

### yo g-next:aws-update-schedule
**dependencies: pkg-core.**\
It updates the status or the invocation Rate of a specified scheduler

### yo g-next:aws-delete-scheduler
**dependencies: pkg-core.**\
It deletes a specified scheduler and also all the rules and apiDestinations linked to him.

### yo g-next:pkg-core

**Thanks to this package you will get basic linting support with eslint + prettier and initialize GeNYG configuration.**\
This will:
- install all basic packages for code linting and styling (by fixing the eslint plugin used by default by Next and installing prettier).
- add husky and lint-staged in order to clean the code before committing to the repo.
- add the AppHead component
- add the GeNYG config file .genyg.json

### yo g-next:pkg-mui

#### dependencies: pkg-core

**Thanks to this package you will be able to use MUI components, and to create forms based on MUI input fields plus
react-hook-form library with yup validation support.**\
It will install all MUI related dependencies, that is:
- MUI core
- MUI icons
- react-hook-form
- yup validation support
- _form basic components based on MUI and react-hook-form

### yo g-next:pkg-spa

#### dependencies: pkg-core

**Thanks to this package you will be able to add one or multiple Single Page Application to your app.**\
In particular it will install:
- react-router-dom libs
- redux libs plus plugins
- axios for ajax support

### yo g-next:pkg-translations

#### dependencies: pkg-core

It installs everything needed to handle translations with i18next, in particular:
- `./translations` folder with translations files types and contents for each locale
- a next config file option to support i18n
- 2 react hooks to initialize and use translations with react

### yo g-next:model

#### dependencies: pkg-core

It creates a new model inside `./models/server`, `./models/common` or `./models/client` folder, depending on the usage of the model, client if it is supposed to run in the frontend in React, server if it supposed to run in the backend with NodeJS, common for both.\
Having different folders and files (even to represent the same entity) from backend and frontend avoids issues when loading browser-related code in the backend code, or file-system-related code in the frontend.

### yo g-next:scene

#### dependencies: pkg-spa

It creates a new scene for the specified SPA.


### yo g-next:pkg-mongodb

#### dependencies: pkg-core

- It adds mongodb node dependency
- It adds mongodb library files inside /lib
- It adds mongo env vars to the env files

### yo g-next:model-mongodb

#### dependencies: pkg-mongodb

- It creates a new model inside `./models/server` folder with the mongoDB model template

### yo g-next:page

#### dependencies: pkg-core

It creates a new page inside NextJS project, inside /pages root folder or one of its subfolders.\
It also allows specifying if the component is:
- a normal page (eg. /news)
- a dynamic page with a parameter (eg. /news/\[newsId\])
- a dynamic page with multiple parameters (eg. /news/\[\[...parameters]])\
It also gives the possibility to specify the server rendering mode (SSG or SSR).

### yo g-next:comp

#### dependencies: pkg-core

It creates a new component with a hook file. A subfolder of the components one can be selected as well.

### yo g-next:ajax

#### dependencies: pkg-spa

It creates a new AJAX function for the specified SPA.

### yo g-next:slice

#### dependencies: pkg-spa

It creates a new redux slice for the specified SPA.

### yo g-next:form

#### dependencies: pkg-mui

It creates a new form component in the selected folder, with FormProvider and yup schema validation support.

### yo g-next:api

#### dependencies: pkg-core

It creates a new API endpoint folder insider /endpoints, with interfaces, validations, tests and handler function.\
It also connects this endpoint function to the Next `./api` folder and its configuration files

## TODO

### yo g-next:pkg-core

- Add sitemap.xml generation

### yo g-next:model-mongodb

- Add project to getList

### yo g-next:task

- It should create a new task.ts file in the tasks' folder, with the env files requires and a script in the package.json to run it. 

### yo g-next:spa

It should check if pkg-translations is installed.\
In this case, BrowserRouter basename shouldn't be set to "/page-route", since it will not take in consideration the `/:languageCode` parameter in the URI.\
So something like this:
```jsx
  <BrowserRouter basename="/app">
    <Routes>
      <Route path="/" element={<span />} />
    </Routes>
  </BrowserRouter>
```
should become like this:
```jsx
  <BrowserRouter>
    <Routes>
      <Route path="/:languageCode/app/" element={<span />} />
    </Routes>
  </BrowserRouter>
```
Also, if pkg-translations is installed, the `<App />` component should call the `useInitializeTranslations();` hook, like:
```jsx
// .....

const useAppHooks = () => {
  useInitializeTranslations();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.appStartup());
  }, [dispatch]);

  return {
    theme,
  };
};

export default useAppHooks;
```

### yo g-next:pkg-cognito

- It should add all the backend library files inside the `./lib` folder
- It should add all fe and be dependencies to the package json
- It should add all the required env vars to all env files

### yo g-next:aws-scheduler-role
