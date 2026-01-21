# generator-g-next

Welcome to the **GeNYG (Getapper Next.js Yeoman Generator)** project! GeNYG is a comprehensive generator made with Yeoman by Getapper for scaffolding, development, testing and deployment of Next.js applications.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Package Generators](#package-generators)
  - [pkg-core](#yo-g-nextpkg-core)
  - [pkg-mui](#yo-g-nextpkg-mui)
  - [pkg-spa](#yo-g-nextpkg-spa)
  - [pkg-translations](#yo-g-nextpkg-translations)
  - [pkg-mongodb](#yo-g-nextpkg-mongodb)
  - [pkg-cookie-auth](#yo-g-nextpkg-cookie-auth)
  - [pkg-cognito](#yo-g-nextpkg-cognito)
- [Code Generators](#code-generators)
  - [api](#yo-g-nextapi)
  - [ajax](#yo-g-nextajax)
  - [comp](#yo-g-nextcomp)
  - [form](#yo-g-nextform)
  - [model](#yo-g-nextmodel)
  - [model-mongodb](#yo-g-nextmodel-mongodb)
  - [page](#yo-g-nextpage)
  - [scene](#yo-g-nextscene)
  - [slice](#yo-g-nextslice)
  - [spa](#yo-g-nextspa)
  - [task](#yo-g-nexttask)
- [AWS Generators](#aws-generators)
- [API Generator - Detailed Examples](#api-generator---detailed-examples)
- [CLI Examples for All Generators](#cli-examples-for-all-generators)
- [Validation & Error Handling](#validation--error-handling)
- [Best Practices](#best-practices)
- [Complete Example: Setting Up a Project](#complete-example-setting-up-a-project)
- [Troubleshooting](#troubleshooting)
- [TODO](#todo)

---

## Quick Start

```bash
# Install Yeoman globally
npm install -g yo

# Install GeNYG generator
npm install -g generator-g-next

# Create a new Next.js app
yo g-next:app

# Install core package (required first step)
yo g-next:pkg-core
```

---

## Installation

### Prerequisites

- **Node.js**: Version 16.x, 17.x, 18.x, 19.x, or 20.x
- **npm**: Usually comes with Node.js
- **Yeoman**: Install globally with `npm install -g yo`

### Install GeNYG Generator

```bash
npm install -g generator-g-next
```

### Verify Installation

```bash
yo g-next:version
```

---

## Getting Started

### Create a New Next.js Project

1. **Create and initialize your repository:**
   ```bash
   mkdir my-nextjs-app
   cd my-nextjs-app
   git init
   ```

2. **Initialize the Next.js app:**
   ```bash
   yo g-next:app
   ```
   This runs `npx create-next-app@latest` with TypeScript support in the current directory.

3. **Install core package (required first step):**
   ```bash
   yo g-next:pkg-core
   ```
   This installs basic linting, testing, and GeNYG configuration.

---

## Package Generators

Package generators install dependencies and configure your project with specific features. They should be run **only once** per project.

### `yo g-next:pkg-core`

**Dependencies:** None (this is the foundation)

**Description:** Installs basic linting support with ESLint + Prettier and initializes GeNYG configuration.

**What it does:**
- Installs all basic packages for code linting and styling
- Adds Husky and lint-staged for pre-commit hooks
- Adds the AppHead component
- Creates the GeNYG config file `.genyg.json`
- Sets up Jest for testing
- Configures TypeScript

**Interactive Mode:**
```bash
yo g-next:pkg-core
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-core
```

**Files Created:**
- `.genyg.json` - GeNYG configuration file
- `jest.config.js` - Jest configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig-ts-node.json` - TypeScript config for ts-node
- `src/components/AppHead/index.tsx` - AppHead component
- `.gitignore` - Git ignore file
- `.cursorrules` - Cursor IDE rules

---

### `yo g-next:pkg-mui`

**Dependencies:** `pkg-core`

**Description:** Installs Material-UI components and form support with react-hook-form and yup validation.

**What it does:**
- Installs MUI core and icons
- Installs react-hook-form
- Installs yup validation support
- Creates `_form` basic components based on MUI and react-hook-form
- Sets up theme configuration

**Interactive Mode:**
```bash
yo g-next:pkg-mui
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-mui
```

**Files Created:**
- `src/components/_form/` - Form components directory with all standardized form components
- `src/themes/index.ts` - MUI theme configuration

---

### `yo g-next:pkg-spa`

**Dependencies:** `pkg-core`

**Description:** Enables Single Page Application (SPA) functionality with React Router and Redux.

**What it does:**
- Installs react-router-dom
- Installs Redux Toolkit and Redux Saga
- Installs axios for AJAX support
- Sets up Redux store structure
- Creates SPA configuration

**Interactive Mode:**
```bash
yo g-next:pkg-spa
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-spa
```

**Files Created:**
- `src/spas/` - SPA directory structure
- Redux store configuration files

---

### `yo g-next:pkg-translations`

**Dependencies:** `pkg-core`

**Description:** Installs everything needed to handle translations with i18next.

**What it does:**
- Creates `./translations` folder with translation files
- Adds Next.js config file option to support i18n
- Creates 2 React hooks to initialize and use translations
- Sets up locale management

**Interactive Mode:**
```bash
yo g-next:pkg-translations
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-translations
```

**Files Created:**
- `src/translations/` - Translation files directory
- Translation hooks and utilities

---

### `yo g-next:pkg-mongodb`

**Dependencies:** `pkg-core`

**Description:** Installs MongoDB support with database connection utilities and export/import tasks.

**What it does:**
- Adds MongoDB node dependency (v4.4.0)
- Adds MongoDB library files inside `/lib`
- Adds MongoDB environment variables to env files
- Creates database export/import tasks
- Adds `.db-exports` to `.gitignore`
- Updates Jest config for MongoDB Memory Server

**Interactive Mode:**
```bash
yo g-next:pkg-mongodb
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-mongodb
```

**Environment Variables Added:**
- `MONGODB_NAME` - Database name
- `MONGODB_URI` - MongoDB connection string

**Tasks Created:**
- `TASK:ExportDatabase` - Export database to EJSON format
- `TASK:ImportDatabase` - Import database from export

**Files Created:**
- `src/lib/mongodb/index.ts` - MongoDB connection utilities
- `src/lib/mongodb/mongo-dao.ts` - MongoDB DAO class
- `src/tasks/export-database/` - Database export task
- `src/tasks/import-database/` - Database import task

**Usage:**
```bash
# Export database
npm run TASK:ExportDatabase

# Import database
npm run TASK:ImportDatabase
```

---

### `yo g-next:pkg-cookie-auth`

**Dependencies:** `pkg-core`

**Description:** Installs cookie-based authentication system.

**What it does:**
- Adds iron-session dependency
- Creates authentication helpers
- Sets up session management
- Adds authentication environment variables

**Interactive Mode:**
```bash
yo g-next:pkg-cookie-auth
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-cookie-auth
```

**Files Created:**
- `src/lib/session/` - Session management utilities

---

### `yo g-next:pkg-cognito`

**Dependencies:** `pkg-core`

**Description:** Installs AWS Cognito authentication support.

**What it does:**
- Adds AWS Cognito dependencies
- Creates Cognito authentication helpers
- Sets up Redux store for Cognito
- Adds Cognito environment variables

**Interactive Mode:**
```bash
yo g-next:pkg-cognito
```
You'll be prompted to confirm the installation.

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:pkg-cognito
```

**Files Created:**
- `src/lib/cognito/` - Cognito authentication utilities
- Redux store configuration for Cognito

---

## Code Generators

Code generators create specific code files and structures. They can be run multiple times to create different instances.

### `yo g-next:api`

**Dependencies:** `pkg-core`

**Description:** Creates a new API endpoint with interfaces, validations, tests, and handler function.

**What it does:**
- Creates endpoint folder inside `/endpoints`
- Creates Next.js API route in `/pages/api`
- Generates TypeScript interfaces
- Generates Yup validations
- Creates handler function
- Generates unit tests

**Interactive Mode:**
```bash
yo g-next:api
```

**Step-by-step prompts:**
1. **Route path:** Enter the API route (e.g., `users`, `users/{userId}`, `posts/{postId}/comments`)
2. **HTTP method:** Select from: `get`, `post`, `put`, `patch`, `delete`
3. **Use cookie authentication:** Yes/No
4. **Cookie role:** Select role if authentication is enabled (e.g., `admin`, `user`)

**CLI Mode:**
```bash
yo g-next:api --route <route> --method <method> [options]
```

**Required Parameters:**
- `--route` - API route path (e.g., `users`, `users/{userId}`)
- `--method` - HTTP method (`get`, `post`, `put`, `patch`, `delete`)

**Optional Parameters:**
- `--useCookieAuth` - Enable cookie authentication (boolean)
- `--cookieRole` - Cookie role for authentication (required if `--useCookieAuth` is true)

**Examples:**

```bash
# Simple GET endpoint
yo g-next:api --route users --method get

# POST endpoint
yo g-next:api --route posts --method post

# PUT endpoint with dynamic parameter
yo g-next:api --route users/{userId} --method put

# GET endpoint with authentication
yo g-next:api --route admin/users --method get --useCookieAuth --cookieRole admin

# POST endpoint with multiple parameters
yo g-next:api --route posts/{postId}/comments/{commentId} --method post

# PATCH endpoint with authentication
yo g-next:api --route users/{userId} --method patch --useCookieAuth --cookieRole user
```

**Route Parameter Format:**
- Single parameter: `users/{userId}`
- Multiple parameters: `posts/{postId}/comments/{commentId}`
- Parameter names must start with a letter and contain only letters and numbers

**Files Created:**
```
src/
├── pages/api/[route]/index.ts
└── endpoints/[method]-[route]/
    ├── interfaces.ts
    ├── validations.ts
    ├── handler.ts
    ├── index.test.ts
    └── index.ts
```

**See also:** [API Generator - Detailed Examples](#api-generator---detailed-examples) section below for more examples.

---

### `yo g-next:ajax`

**Dependencies:** `pkg-spa`

**Description:** Creates a new AJAX function for the specified SPA with Redux actions.

**What it does:**
- Creates Redux AJAX action builder
- Generates TypeScript interfaces for request/response
- Creates API request payload builder
- Integrates with Redux-Saga

**Interactive Mode:**
```bash
yo g-next:ajax
```

**Step-by-step prompts:**
1. **Route path:** Enter the API route (e.g., `users`, `users/{userId}`)
2. **HTTP method:** Select from: `get`, `post`, `put`, `patch`, `delete`
3. **SPA folder name:** Select from available SPAs or enter new one

**CLI Mode:**
```bash
yo g-next:ajax --route <route> --method <method> [options]
```

**Required Parameters:**
- `--route` - API route path
- `--method` - HTTP method (`get`, `post`, `put`, `patch`, `delete`)

**Optional Parameters:**
- `--spaFolderName` - SPA folder name (default: `app`)

**Examples:**

```bash
# GET AJAX action
yo g-next:ajax --route users --method get

# POST AJAX action
yo g-next:ajax --route posts --method post --spaFolderName admin

# PUT AJAX action with parameter
yo g-next:ajax --route users/{userId} --method put --spaFolderName app

# DELETE AJAX action
yo g-next:ajax --route comments/{commentId} --method delete
```

**Files Created:**
```
src/spas/[spaFolderName]/redux-store/extra-actions/apis/[endpoint-name]/index.tsx
```

---

### `yo g-next:comp`

**Dependencies:** `pkg-core`

**Description:** Creates a new React component with a hooks file following the separation of concerns pattern.

**Interactive Mode:**
```bash
yo g-next:comp
```

**Step-by-step prompts:**
1. **Component name:** Enter component name (PascalCase, e.g., `UserCard`)
2. **Component path:** Optional subfolder path (e.g., `user`, `dashboard`)

**CLI Mode:**
```bash
yo g-next:comp --componentName <componentName> [options]
```

**Required Parameters:**
- `--componentName` - Component name (must start with letter, PascalCase)

**Optional Parameters:**
- `--componentPath` - Subfolder path relative to `src/components`

**Examples:**

```bash
# Simple component
yo g-next:comp --componentName UserCard

# Component in subfolder
yo g-next:comp --componentName UserProfile --componentPath user

# Component in nested path
yo g-next:comp --componentName DashboardCard --componentPath dashboard/cards
```

**Files Created:**
```
src/components/[componentPath]/[ComponentName]/
├── index.tsx
└── index.hooks.tsx
```

---

### `yo g-next:form`

**Dependencies:** `pkg-mui`

**Description:** Creates a new form component with FormProvider and yup schema validation support.

**Interactive Mode:**
```bash
yo g-next:form
```

**Step-by-step prompts:**
1. **Form name:** Enter form name (PascalCase, e.g., `LoginForm`)
2. **Form path:** Optional subfolder path (e.g., `auth`, `user`)

**CLI Mode:**
```bash
yo g-next:form --formName <formName> [options]
```

**Required Parameters:**
- `--formName` - Form name (must start with letter, PascalCase)

**Optional Parameters:**
- `--formPath` - Subfolder path relative to `src/components`

**Examples:**

```bash
# Simple form
yo g-next:form --formName LoginForm

# Form in subfolder
yo g-next:form --formName UserRegistration --formPath auth

# Form in nested path
yo g-next:form --formName ProductForm --formPath admin/products
```

**Files Created:**
```
src/components/[formPath]/[FormName]/
├── index.tsx
└── index.hooks.tsx
```

---

### `yo g-next:model`

**Dependencies:** `pkg-core`

**Description:** Creates a new model inside `./models/server`, `./models/common`, or `./models/client` folder.

**Interactive Mode:**
```bash
yo g-next:model
```

**Step-by-step prompts:**
1. **Model name:** Enter model name (PascalCase, e.g., `User`)
2. **Location:** Select from: `client`, `server`, `common`

**CLI Mode:**
```bash
yo g-next:model --modelName <modelName> --location <location>
```

**Required Parameters:**
- `--modelName` - Model name (must start with letter, PascalCase)
- `--location` - Location (`client`, `server`, or `common`)

**Examples:**

```bash
# Client-side model
yo g-next:model --modelName User --location client

# Server-side model
yo g-next:model --modelName Product --location server

# Common model (shared between client and server)
yo g-next:model --modelName ApiResponse --location common
```

**Files Created:**
```
src/models/[location]/[ModelName]/index.ts
```

**Location Guidelines:**
- **client**: Models used only in frontend React code
- **server**: Models used only in backend Node.js code
- **common**: Models shared between frontend and backend

---

### `yo g-next:model-mongodb`

**Dependencies:** `pkg-mongodb`

**Description:** Creates a new MongoDB model inside `./models/server` folder with full CRUD operations.

**Interactive Mode:**
```bash
yo g-next:model-mongodb
```

**Step-by-step prompts:**
1. **Model name:** Enter model name (PascalCase, e.g., `User`)

**CLI Mode:**
```bash
yo g-next:model-mongodb --modelName <modelName>
```

**Required Parameters:**
- `--modelName` - Model name (must start with letter, PascalCase)

**Examples:**

```bash
# MongoDB model
yo g-next:model-mongodb --modelName User

# Another MongoDB model
yo g-next:model-mongodb --modelName Product

# Order model
yo g-next:model-mongodb --modelName Order
```

**Files Created:**
```
src/models/server/[ModelName]/index.ts
```

**Generated Methods:**
- `create()` - Create new document
- `getById(_id)` - Find by ObjectId
- `getList(filter, options)` - List with pagination and sorting
- `patch(fields)` - Update specific fields
- `delete(_id)` - Remove document
- `refresh()` - Reload from database

---

### `yo g-next:page`

**Dependencies:** `pkg-core`

**Description:** Creates a new Next.js page with various rendering strategies.

**Interactive Mode:**
```bash
yo g-next:page
```

**Step-by-step prompts:**
1. **Page name:** Enter page name (e.g., `users`, `[userId]`, `[[...params]]`)
2. **Component name:** Enter component name (PascalCase)
3. **Rendering strategy:** Select from:
   - `none` - No server-side rendering
   - `Static Generation Props (SSG)` - Static Site Generation
   - `Server-side Rendering Props (SSR)` - Server-side Rendering
4. **Page path:** Optional subfolder path
5. **Use cookie authentication:** Yes/No
6. **Cookie role:** Select role if authentication is enabled

**CLI Mode:**
```bash
yo g-next:page --pageName <pageName> --componentName <componentName> --renderingStrategy <strategy> [options]
```

**Required Parameters:**
- `--pageName` - Page name (supports dynamic routes: `users`, `[userId]`, `[[...params]]`)
- `--componentName` - Component name (PascalCase)
- `--renderingStrategy` - Rendering strategy (`none`, `Static Generation Props (SSG)`, `Server-side Rendering Props (SSR)`)

**Optional Parameters:**
- `--pagePath` - Subfolder path relative to `src/pages`
- `--useCookieAuth` - Enable cookie authentication (boolean)
- `--cookieRole` - Cookie role for authentication

**Examples:**

```bash
# Static page
yo g-next:page --pageName home --componentName HomePage --renderingStrategy "Static Generation Props (SSG)"

# Dynamic page with SSR
yo g-next:page --pageName "[userId]" --componentName UserDetail --renderingStrategy "Server-side Rendering Props (SSR)"

# Page with authentication
yo g-next:page --pageName admin --componentName AdminDashboard --renderingStrategy "Server-side Rendering Props (SSR)" --useCookieAuth --cookieRole admin

# Page with catch-all route
yo g-next:page --pageName "[[...params]]" --componentName CatchAllPage --renderingStrategy none
```

**Files Created:**
```
src/pages/[pagePath]/[pageName]/index.tsx
```

---

### `yo g-next:scene`

**Dependencies:** `pkg-spa`

**Description:** Creates a new scene for the specified SPA.

**Interactive Mode:**
```bash
yo g-next:scene
```

**Step-by-step prompts:**
1. **Scene name:** Enter scene name (PascalCase, e.g., `HomePage`)
2. **SPA folder name:** Select from available SPAs or enter new one

**CLI Mode:**
```bash
yo g-next:scene --sceneName <sceneName> [options]
```

**Required Parameters:**
- `--sceneName` - Scene name (must start with letter, PascalCase)

**Optional Parameters:**
- `--spaFolderName` - SPA folder name (default: `app`)

**Examples:**

```bash
# Simple scene
yo g-next:scene --sceneName HomePage

# Scene in specific SPA
yo g-next:scene --sceneName UserDashboard --spaFolderName admin

# Another scene
yo g-next:scene --sceneName ProductList --spaFolderName app
```

**Files Created:**
```
src/spas/[spaFolderName]/scenes/[SceneName]/
├── index.tsx
└── index.hooks.tsx
```

---

### `yo g-next:slice`

**Dependencies:** `pkg-spa`

**Description:** Creates a new Redux slice for the specified SPA.

**Interactive Mode:**
```bash
yo g-next:slice
```

**Step-by-step prompts:**
1. **Slice name:** Enter slice name (singular, e.g., `user`, `item`)
2. **SPA folder name:** Select from available SPAs
3. **Use sagas:** Yes/No (default: Yes)

**CLI Mode:**
```bash
yo g-next:slice --sliceName <sliceName> [options]
```

**Required Parameters:**
- `--sliceName` - Slice name (must start with letter, singular form)

**Optional Parameters:**
- `--spaFolderName` - SPA folder name (default: `app`)
- `--useSagas` - Create saga file (default: `true`)

**Examples:**

```bash
# Simple slice with sagas
yo g-next:slice --sliceName user

# Slice without sagas
yo g-next:slice --sliceName products --useSagas false

# Slice in specific SPA
yo g-next:slice --sliceName item --spaFolderName admin
```

**Files Created:**
```
src/spas/[spaFolderName]/redux-store/slices/[sliceName]/
├── [sliceName].interfaces.ts
├── [sliceName].selectors.ts
├── [sliceName].sagas.ts (if enabled)
└── index.ts
```

**Important:** Slice names should be **singular** (e.g., `user`, not `users`).

---

### `yo g-next:spa`

**Dependencies:** `pkg-spa`

**Description:** Creates a new Single Page Application with routing and Redux setup.

**Interactive Mode:**
```bash
yo g-next:spa
```

**Step-by-step prompts:**
1. **SPA name:** Enter SPA name (PascalCase, e.g., `AdminApp`)
2. **Page name:** Enter initial page name (PascalCase)
3. **Page path:** Optional subfolder path

**CLI Mode:**
```bash
yo g-next:spa --spaName <spaName> --pageName <pageName> [options]
```

**Required Parameters:**
- `--spaName` - SPA name (must start with letter, PascalCase)
- `--pageName` - Initial page name (PascalCase)

**Optional Parameters:**
- `--pagePath` - Subfolder path relative to `src/pages`

**Examples:**

```bash
# Simple SPA
yo g-next:spa --spaName AdminApp --pageName AdminDashboard

# SPA with page in subfolder
yo g-next:spa --spaName UserApp --pageName UserProfile --pagePath user

# Another SPA
yo g-next:spa --spaName MainApp --pageName HomePage
```

**Files Created:**
```
src/spas/[spaName]/
├── redux-store/
├── scenes/
└── ...

src/pages/[pagePath]/[pageName]/index.tsx
```

---

### `yo g-next:task`

**Dependencies:** `pkg-core`

**Description:** Creates a new task file in the tasks folder with environment file requires and a script in package.json.

**Interactive Mode:**
```bash
yo g-next:task
```

**Step-by-step prompts:**
1. **Task name:** Enter task name (PascalCase, e.g., `SendEmails`)

**CLI Mode:**
```bash
yo g-next:task --taskName <taskName>
```

**Required Parameters:**
- `--taskName` - Task name (must start with letter, PascalCase)

**Examples:**

```bash
# Simple task
yo g-next:task --taskName SendEmails

# Another task
yo g-next:task --taskName ProcessData

# Database task
yo g-next:task --taskName MigrateDatabase
```

**Files Created:**
```
src/tasks/[taskName]/
├── exec.ts
└── index.ts
```

**Package.json Script Added:**
```json
{
  "scripts": {
    "TASK:[TaskName]": "ts-node --project tsconfig-ts-node.json -r tsconfig-paths/register src/tasks/[taskName]/exec"
  }
}
```

**Usage:**
```bash
npm run TASK:SendEmails
```

---

## AWS Generators

### `yo g-next:aws-scheduler`

**Dependencies:** `pkg-core`

**Description:** Creates a new AWS EventBridge scheduler with API destination target.

**What it does:**
- Creates or selects destination role
- Creates or selects scheduler role
- Creates or selects connection
- Creates event bus if needed
- Creates target for selected API destination
- Creates endpoint files for AJAX calls
- Creates scheduler and rule with selected invocation rate

**Interactive Mode:**
```bash
yo g-next:aws-scheduler
```

**Step-by-step prompts:**
1. **Destination role:** Select existing or create new
2. **Scheduler role:** Select existing or create new
3. **Connection:** Select existing or create new
4. **Event bus:** Select existing or create new
5. **API destination:** Select endpoint
6. **Invocation rate:** Select rate (e.g., `rate(5 minutes)`)

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:aws-scheduler
```

---

### `yo g-next:aws-update-schedule`

**Dependencies:** `pkg-core`

**Description:** Updates the status or invocation rate of a specified scheduler.

**Interactive Mode:**
```bash
yo g-next:aws-update-schedule
```

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:aws-update-schedule
```

---

### `yo g-next:aws-delete-scheduler`

**Dependencies:** `pkg-core`

**Description:** Deletes a specified scheduler and all linked rules and API destinations.

**Interactive Mode:**
```bash
yo g-next:aws-delete-scheduler
```

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:aws-delete-scheduler
```

---

### `yo g-next:aws-scheduler-role`

**Dependencies:** `pkg-core`

**Description:** Creates AWS scheduler roles for EventBridge.

**Interactive Mode:**
```bash
yo g-next:aws-scheduler-role
```

**CLI Mode:**
```bash
# No CLI options available - always interactive
yo g-next:aws-scheduler-role
```

---

## API Generator - Detailed Examples

This section provides detailed examples for the API generator with various use cases.

### Basic Examples

#### 1. Endpoint GET semplice
```bash
yo g-next:api --route users --method get
```
**Risultato**: Crea un endpoint GET per `/users`

#### 2. Endpoint POST per creazione
```bash
yo g-next:api --route posts --method post
```
**Risultato**: Crea un endpoint POST per `/posts`

#### 3. Endpoint PUT per aggiornamento
```bash
yo g-next:api --route users/{userId} --method put
```
**Risultato**: Crea un endpoint PUT per `/users/{userId}`

#### 4. Endpoint PATCH per aggiornamento parziale
```bash
yo g-next:api --route posts/{postId} --method patch
```
**Risultato**: Crea un endpoint PATCH per `/posts/{postId}`

#### 5. Endpoint DELETE per eliminazione
```bash
yo g-next:api --route comments/{commentId} --method delete
```
**Risultato**: Crea un endpoint DELETE per `/comments/{commentId}`

### Examples with Dynamic Parameters

#### 6. Endpoint con parametro singolo
```bash
yo g-next:api users/{userId} get
```
**Risultato**: Crea un endpoint GET per `/users/{userId}`

#### 7. Endpoint con parametri multipli
```bash
yo g-next:api posts/{postId}/comments/{commentId} get
```
**Risultato**: Crea un endpoint GET per `/posts/{postId}/comments/{commentId}`

#### 8. Endpoint con parametri e metodo POST
```bash
yo g-next:api users/{userId}/posts post
```
**Risultato**: Crea un endpoint POST per `/users/{userId}/posts`

### Examples with Cookie Authentication

#### 9. Endpoint admin con autenticazione
```bash
yo g-next:api admin/users get --useCookieAuth --cookieRole admin
```
**Risultato**: Crea un endpoint GET per `/admin/users` con autenticazione cookie per ruolo admin

#### 10. Endpoint utente con autenticazione
```bash
yo g-next:api profile put --useCookieAuth --cookieRole user
```
**Risultato**: Crea un endpoint PUT per `/profile` con autenticazione cookie per ruolo user

#### 11. Endpoint con parametri e autenticazione
```bash
yo g-next:api admin/users/{userId} put --useCookieAuth --cookieRole admin
```
**Risultato**: Crea un endpoint PUT per `/admin/users/{userId}` con autenticazione cookie per ruolo admin

### Automation Scripts

#### 12. Script di automazione
```bash
#!/bin/bash
# Script per creare multiple API endpoints

echo "Creating user management APIs..."

yo g-next:api --route users --method get
yo g-next:api users post
yo g-next:api users/{userId} get
yo g-next:api --route users/{userId} --method put
yo g-next:api users/{userId} delete

echo "Creating post management APIs..."

yo g-next:api posts get
yo g-next:api --route posts --method post
yo g-next:api posts/{postId} get
yo g-next:api posts/{postId} put
yo g-next:api posts/{postId} delete

echo "Creating comment APIs..."

yo g-next:api posts/{postId}/comments get
yo g-next:api posts/{postId}/comments post
yo g-next:api comments/{commentId} put
yo g-next:api --route comments/{commentId} --method delete

echo "All APIs created successfully!"
```

#### 13. Script con autenticazione
```bash
#!/bin/bash
# Script per creare API con autenticazione

echo "Creating authenticated APIs..."

# Admin APIs
yo g-next:api admin/users get --useCookieAuth --cookieRole admin
yo g-next:api admin/users post --useCookieAuth --cookieRole admin
yo g-next:api admin/users/{userId} put --useCookieAuth --cookieRole admin
yo g-next:api admin/users/{userId} delete --useCookieAuth --cookieRole admin

# User APIs
yo g-next:api profile get --useCookieAuth --cookieRole user
yo g-next:api profile put --useCookieAuth --cookieRole user

echo "Authenticated APIs created successfully!"
```

### Validation Examples

#### 14. Test di validazione metodo HTTP
```bash
yo g-next:api users invalid
```
**Risultato**: Mostra errore Yup "HTTP method must be one of: get, post, put, patch, delete"

#### 15. Test di validazione autenticazione
```bash
yo g-next:api --route users --method get --useCookieAuth
```
**Risultato**: Mostra errore Yup "Cookie role is required when using cookie authentication"

#### 16. Test di validazione formato route
```bash
yo g-next:api users@#$ get
```
**Risultato**: Mostra errore Yup "Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed"

#### 17. Test di validazione parametri dinamici
```bash
yo g-next:api users/{} get
```
**Risultato**: Mostra errore Yup "Parameter name cannot be empty inside curly braces"

#### 18. Test di validazione nome parametro
```bash
yo g-next:api users/{123invalid} get
```
**Risultato**: Mostra errore Yup "Parameter name '123invalid' must start with a letter and contain only letters and numbers"

#### 19. Test di validazione route vuoto
```bash
yo g-next:api "" get
```
**Risultato**: Mostra errore Yup "Route path cannot be empty"

#### 20. Test di validazione ruolo cookie non valido
```bash
yo g-next:api --route users --method get --useCookieAuth --cookieRole superadmin
```
**Risultato**: Mostra errore Yup "Cookie role must be one of: admin, user, moderator"

#### 21. Test di validazione multipla
```bash
yo g-next:api users@#$ invalid --useCookieAuth --cookieRole guest
```
**Risultato**: Mostra errori Yup multipli:
```
Validation errors found:
  • method: HTTP method must be one of: get, post, put, patch, delete
  • route: Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed
  • cookieRole: Cookie role must be one of: admin, user, moderator
```

### File Generati

Ogni comando genera i seguenti file:

```
src/
├── pages/
│   └── api/
│       └── [route]/
│           └── index.ts          # Endpoint API Next.js
└── endpoints/
    └── [method]-[route]/
        ├── interfaces.ts         # Interfacce TypeScript
        ├── validations.ts        # Validazioni Yup
        ├── handler.ts            # Logica dell'handler
        ├── index.test.ts         # Test unitari
        └── index.ts              # File principale
```

### Important Notes

1. **Parametri dinamici**: Usa la sintassi `{paramName}` per parametri singoli
2. **Metodi HTTP**: Sono supportati solo `get`, `post`, `put`, `patch`, `delete`
3. **Autenticazione**: Se usi `--useCookieAuth`, devi specificare anche `--cookieRole`
4. **Validazione**: Il generator valida automaticamente tutti i parametri
5. **Modalità mista**: Puoi usare sia CLI che modalità interattiva nello stesso progetto

---

## CLI Examples for All Generators

### Generator AJAX

**Comando:** `yo g-next:ajax --route <route> --method <method> [options]`

**Opzioni:**
- `--route` (obbligatorio): Percorso dell'API
- `--method` (obbligatorio): Metodo HTTP
- `--spaFolderName`: Nome della cartella SPA

**Esempi:**
```bash
yo g-next:ajax --route users --method get
yo g-next:ajax --route posts/{postId} --method post --spaFolderName main
```

### Generator Component

**Comando:** `yo g-next:comp --componentName <componentName> [options]`

**Opzioni:**
- `--componentName` (obbligatorio): Nome del componente
- `--componentPath`: Percorso del componente (relativo a src/components)

**Esempi:**
```bash
yo g-next:comp --componentName UserCard
yo g-next:comp --componentName UserProfile --componentPath user
```

### Generator Form

**Comando:** `yo g-next:form --formName <formName> [options]`

**Opzioni:**
- `--formName` (obbligatorio): Nome del form
- `--formPath`: Percorso del form (relativo a src/components)

**Esempi:**
```bash
yo g-next:form --formName LoginForm
yo g-next:form --formName UserRegistration --formPath auth
```

### Generator Model

**Comando:** `yo g-next:model --modelName <modelName> --location <location> [options]`

**Opzioni:**
- `--modelName` (obbligatorio): Nome del modello
- `--location` (obbligatorio): Posizione (`client`, `server`, `common`)

**Esempi:**
```bash
yo g-next:model --modelName User --location client
yo g-next:model --modelName Product --location server
yo g-next:model --modelName ApiResponse --location common
```

### Generator Page

**Comando:** `yo g-next:page --pageName <pageName> --componentName <componentName> --renderingStrategy <renderingStrategy> [options]`

**Opzioni:**
- `--pageName` (obbligatorio): Nome della pagina (es. `users`, `[userId]`, `[[...params]]`)
- `--componentName` (obbligatorio): Nome del componente pagina
- `--renderingStrategy` (obbligatorio): Strategia di rendering (`none`, `Static Generation Props (SSG)`, `Server-side Rendering Props (SSR)`)
- `--pagePath`: Percorso della pagina (relativo a src/pages)
- `--useCookieAuth`: Abilita autenticazione cookie
- `--cookieRole`: Ruolo per autenticazione cookie

**Esempi:**
```bash
yo g-next:page --pageName users --componentName UserList --renderingStrategy "Static Generation Props (SSG)"
yo g-next:page --pageName "[userId]" --componentName UserDetail --renderingStrategy "Server-side Rendering Props (SSR)" --useCookieAuth --cookieRole admin
```

### Generator Scene

**Comando:** `yo g-next:scene --sceneName <sceneName> [options]`

**Opzioni:**
- `--sceneName` (obbligatorio): Nome della scena
- `--spaFolderName`: Nome della cartella SPA

**Esempi:**
```bash
yo g-next:scene --sceneName HomePage
yo g-next:scene --sceneName UserDashboard --spaFolderName admin
```

### Generator Slice

**Comando:** `yo g-next:slice --sliceName <sliceName> [options]`

**Opzioni:**
- `--sliceName` (obbligatorio): Nome dello slice Redux
- `--spaFolderName`: Nome della cartella SPA
- `--useSagas`: Crea file saga (default: true)

**Esempi:**
```bash
yo g-next:slice --sliceName user
yo g-next:slice --sliceName products --spaFolderName main --useSagas false
```

### Generator Task

**Comando:** `yo g-next:task --taskName <taskName> [options]`

**Opzioni:**
- `--taskName` (obbligatorio): Nome del task

**Esempi:**
```bash
yo g-next:task --taskName SendEmails
yo g-next:task --taskName ProcessData
```

### Generator Model MongoDB

**Comando:** `yo g-next:model-mongodb --modelName <modelName> [options]`

**Opzioni:**
- `--modelName` (obbligatorio): Nome del modello MongoDB

**Esempi:**
```bash
yo g-next:model-mongodb --modelName User
yo g-next:model-mongodb --modelName Product
```

### Generator SPA

**Comando:** `yo g-next:spa --spaName <spaName> --pageName <pageName> [options]`

**Opzioni:**
- `--spaName` (obbligatorio): Nome della SPA
- `--pageName` (obbligatorio): Nome della pagina
- `--pagePath`: Percorso della pagina (relativo a src/pages)

**Esempi:**
```bash
yo g-next:spa --spaName AdminApp --pageName AdminDashboard
yo g-next:spa --spaName UserApp --pageName UserProfile --pagePath user
```

### Automation Examples

#### Script di Setup Progetto
```bash
#!/bin/bash
# Setup completo di un progetto Next.js

# Core packages
yo g-next:pkg-core

# Models
yo g-next:model --modelName User --location client
yo g-next:model --modelName Product --location server
yo g-next:model --modelName ApiResponse --location common

# Pages
yo g-next:page --pageName home --componentName HomePage --renderingStrategy "Static Generation Props (SSG)"
yo g-next:page --pageName "[userId]" --componentName UserDetail --renderingStrategy "Server-side Rendering Props (SSR)" --useCookieAuth --cookieRole user

# Components
yo g-next:comp --componentName UserCard
yo g-next:comp --componentName UserProfile --componentPath user

# Forms
yo g-next:form --formName LoginForm --formPath auth
yo g-next:form --formName UserRegistration --formPath auth

# API Endpoints (modalità CLI: accetta automaticamente modifiche ai file)
yo g-next:api --route users --method get
yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin
yo g-next:api --route products --method post --useCookieAuth --cookieRole admin

# Tasks
yo g-next:task --taskName SendEmails
yo g-next:task --taskName ProcessData

# MongoDB Models
yo g-next:model-mongodb --modelName User
yo g-next:model-mongodb --modelName Product

# SPAs
yo g-next:spa --spaName AdminApp --pageName AdminDashboard
yo g-next:spa --spaName UserApp --pageName UserProfile --pagePath user

echo "Project setup completed!"
```

#### Pipeline CI/CD
```yaml
# .github/workflows/setup-project.yml
name: Setup Project
on: [push]
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Generate API endpoints
        run: |
          yo g-next:api --route users --method get
          yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin
      - name: Generate components
        run: |
          yo g-next:comp --componentName UserCard
          yo g-next:comp --componentName UserProfile --componentPath user
```

---

## Validation & Error Handling

### Yup Validation

All generators use **Yup** for robust parameter validation:

**Common Validations:**
- **Names**: Must start with a letter and contain only letters and numbers
- **API Routes**: Only letters, numbers, slashes, curly braces, and hyphens
- **Dynamic Parameters**: Format `{paramName}` with name validation
- **HTTP Methods**: Only supported values (`get`, `post`, `put`, `patch`, `delete`)
- **Cookie Roles**: Only roles defined in the system (read from `.genyg.json`)
- **SPAs**: Only SPAs available in the project

**Error Messages:**
```
Validation errors found:
  • componentName: Name must start with a letter and contain only letters and numbers
  • method: HTTP method must be one of: get, post, put, patch, delete
  • cookieRole: Cookie role must be one of: admin, user, moderator
```

### CLI Mode vs Interactive Mode

**CLI Mode (Non-Interactive):**
- When required parameters are provided, generator skips prompts
- **All existing files are automatically overwritten** without confirmation
- Ideal for automation scripts and CI/CD pipelines

**Interactive Mode:**
- When parameters are not provided, generator shows prompts
- Yeoman asks for confirmation before overwriting existing files
- Better for manual development

**Example:**
```bash
# CLI Mode: automatically accepts all file changes
yo g-next:api --route users --method get

# Interactive Mode: asks for confirmation
yo g-next:api
```

### Gestione Automatica dei Conflitti

Quando vengono forniti parametri CLI (modalità non interattiva), il generator **accetta automaticamente tutte le modifiche ai file** senza chiedere conferma. Questo comportamento è ideale per script automatizzati e pipeline CI/CD dove non è possibile interagire con i prompt.

**Comportamento:**
- **Modalità CLI**: Tutti i file esistenti vengono sovrascritti automaticamente senza chiedere conferma
- **Modalità Interattiva**: Yeoman chiederà conferma prima di sovrascrivere file esistenti

**Nota:** In modalità CLI, tutti i file esistenti verranno sovrascritti automaticamente. Usare con cautela in produzione.

---

## Best Practices

### 1. Install Packages in Order

Always install packages in dependency order:
1. `pkg-core` (required first)
2. `pkg-mui` (if using MUI)
3. `pkg-spa` (if using SPAs)
4. `pkg-mongodb` (if using MongoDB)
5. `pkg-translations` (if using translations)
6. `pkg-cookie-auth` or `pkg-cognito` (if using authentication)

### 2. Use Singular Names for Slices

Redux slices should use singular names:
```bash
# ✅ Correct
yo g-next:slice --sliceName user

# ❌ Wrong
yo g-next:slice --sliceName users
```

### 3. Use PascalCase for Component Names

Component, form, model, and task names should be PascalCase:
```bash
# ✅ Correct
yo g-next:comp --componentName UserCard
yo g-next:form --formName LoginForm

# ❌ Wrong
yo g-next:comp --componentName userCard
yo g-next:form --formName loginForm
```

### 4. Use kebab-case for Routes

API routes should use kebab-case:
```bash
# ✅ Correct
yo g-next:api --route user-profiles --method get

# ❌ Wrong
yo g-next:api --route userProfiles --method get
```

### 5. Specify Cookie Roles When Using Auth

Always specify cookie role when enabling authentication:
```bash
# ✅ Correct
yo g-next:api --route admin/users --method get --useCookieAuth --cookieRole admin

# ❌ Wrong (will fail validation)
yo g-next:api --route admin/users --method get --useCookieAuth
```

### 6. Use CLI Mode for Automation

Use CLI mode in scripts and CI/CD pipelines:
```bash
#!/bin/bash
# Setup script
yo g-next:api --route users --method get
yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin
```

---

## Complete Example: Setting Up a Project

```bash
# 1. Create project directory
mkdir my-app
cd my-app
git init

# 2. Initialize Next.js app
yo g-next:app

# 3. Install core package
yo g-next:pkg-core

# 4. Install additional packages
yo g-next:pkg-mui
yo g-next:pkg-spa
yo g-next:pkg-mongodb

# 5. Create SPA
yo g-next:spa --spaName AdminApp --pageName AdminDashboard

# 6. Create MongoDB models
yo g-next:model-mongodb --modelName User
yo g-next:model-mongodb --modelName Product

# 7. Create API endpoints
yo g-next:api --route users --method get
yo g-next:api --route users/{userId} --method get
yo g-next:api --route users --method post --useCookieAuth --cookieRole admin
yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin

# 8. Create AJAX actions
yo g-next:ajax --route users --method get --spaFolderName admin
yo g-next:ajax --route users/{userId} --method put --spaFolderName admin

# 9. Create Redux slice
yo g-next:slice --sliceName user --spaFolderName admin

# 10. Create components
yo g-next:comp --componentName UserCard
yo g-next:comp --componentName UserList --componentPath users

# 11. Create forms
yo g-next:form --formName UserForm --formPath users

# 12. Create scenes
yo g-next:scene --sceneName UsersPage --spaFolderName admin

# 13. Create tasks
yo g-next:task --taskName SendEmails
yo g-next:task --taskName ProcessData

echo "Project setup completed!"
```

---

## Troubleshooting

### Generator Not Found

**Problem:** `yo g-next:command` returns "generator not found"

**Solution:**
```bash
npm install -g generator-g-next
```

### Missing Dependencies

**Problem:** Generator says "You need [package] installed"

**Solution:** Install the required package first:
```bash
yo g-next:pkg-[package-name]
```

### Validation Errors

**Problem:** Yup validation errors when using CLI

**Solution:** Check the error messages and fix parameter values:
- Names must start with letters
- Routes must use valid characters
- HTTP methods must be valid
- Cookie roles must exist in `.genyg.json`

### File Overwrite Issues

**Problem:** Files are overwritten without confirmation in CLI mode

**Solution:** This is expected behavior in CLI mode. Use interactive mode if you want confirmation:
```bash
# Interactive mode (asks for confirmation)
yo g-next:api

# CLI mode (auto-overwrites)
yo g-next:api --route users --method get
```

### MongoDB Connection Issues

**Problem:** MongoDB tasks fail with connection errors

**Solution:** Check environment variables:
```bash
# Check .env.local
MONGODB_URI=mongodb://127.0.0.1:27017/your-db-name
MONGODB_NAME=your-db-name
```

---

## TODO

### yo g-next:pkg-core
- Add sitemap.xml generation

### yo g-next:model-mongodb
- Add project to getList

### yo g-next:task
- It should create a new task.ts file in the tasks' folder, with the env files requires and a script in the package.json to run it. ✅ (Already implemented)

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
- Additional features and improvements

---

**Happy Coding with GeNYG! 🚀**
