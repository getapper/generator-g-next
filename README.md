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
- [Development Standards](#development-standards)
  - [Model Architecture Rules](#model-architecture-rules)
  - [Environment Variables](#environment-variables)
  - [Development Workflow](#development-workflow)
  - [Redux Store Access Standards](#redux-store-access-standards)
  - [API Development Best Practices](#api-development-best-practices)
  - [Redux Slice Best Practices](#redux-slice-best-practices)
  - [MUI Component Standards](#mui-component-standards)
  - [CSS Color Standards](#css-color-standards)
  - [React Component Architecture Standards](#react-component-architecture-standards)
  - [Form Component Standards](#form-component-standards)
  - [Navigation and Routing Standards](#navigation-and-routing-standards)
  - [Code Language Standards](#code-language-standards)
- [Complete Example: Setting Up a Project](#complete-example-setting-up-a-project)
- [Troubleshooting](#troubleshooting)
- [TODO](#todo)

---

## Quick Start

```bash
# Install Yeoman globally (version 4.3.1 required)
npm install -g yo@4.3.1

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
- **Yeoman**: Install globally with `npm install -g yo@4.3.1` (version 4.3.1 required)

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
yo g-next:pkg-core --accept
```
Automatically accepts the installation and overwrites existing files without confirmation.

**Optional Parameters:**
- `--accept` - Skip confirmation prompt and force overwrite (non-interactive mode)

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
- Adds `db-exports` to `.gitignore`
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

### `yo g-next:pkg-prisma`

**Dependencies:** `pkg-core`

**Description:** Installs [Prisma](https://www.prisma.io/) with a PostgreSQL datasource preconfigured for serverless Postgres (e.g. [Neon](https://neon.tech/)). Run once per project.

**What it does:**
- Adds `@prisma/client` dependency and `prisma` devDependency
- Creates `prisma/schema.prisma` with a `postgresql` datasource using `DATABASE_URL` (pooled) and `directUrl` (`DIRECT_URL`, used by Prisma Migrate)
- Creates a `PrismaClient` singleton at `src/lib/prisma/index.ts` (dev hot-reload safe)
- Adds `DATABASE_URL` / `DIRECT_URL` to `.env`, `.env.local`, `.env.test`, `.env.template`
- Exposes `DATABASE_URL` / `DIRECT_URL` through `next.config.options.json`
- Adds npm scripts: `prisma:generate`, `prisma:migrate`, `prisma:deploy`, `prisma:push`, `prisma:studio`
- Marks `prisma` as installed in `.genyg.json`

**Interactive Mode:**
```bash
yo g-next:pkg-prisma
```
You'll be prompted to confirm the installation.

**Environment Variables Added:**
- `DATABASE_URL` - Pooled connection string (Neon `-pooler` host), used by the app at runtime
- `DIRECT_URL` - Direct connection string, used by Prisma Migrate

**Files Created:**
- `prisma/schema.prisma` - Prisma schema with the Postgres datasource
- `src/lib/prisma/index.ts` - `PrismaClient` singleton

**Next steps:**
```bash
npm install
# fill DATABASE_URL / DIRECT_URL in your .env files (Neon dashboard)
yo g-next:model-prisma --modelName Task
npm run prisma:migrate
```

---

### `yo g-next:model-prisma`

**Dependencies:** `pkg-prisma`

**Description:** Adds a model to `prisma/schema.prisma` and generates a server-side data-access class with full CRUD on top of the Prisma client.

**What it does:**
- Appends a `model <ModelName>` block to `prisma/schema.prisma` (id `cuid`, `created`, `updated`, `v` defaults) if it doesn't already exist
- Generates `src/models/server/<ModelName>/index.ts` exposing CRUD helpers: `create`, `getById`, `getList`, `count`, `patch`, `delete`, `deleteAll`, plus `refresh`
- Types are derived from the generated Prisma client (`I<ModelName>`, `Prisma.<ModelName>CreateInput`, etc.)

**Interactive Mode:**
```bash
yo g-next:model-prisma
```

**CLI Mode:**
```bash
yo g-next:model-prisma --modelName <modelName>
```

**Examples:**
```bash
yo g-next:model-prisma --modelName Task
yo g-next:model-prisma --modelName Project
```

After generating, edit the model block in `prisma/schema.prisma` to add fields, then run `npm run prisma:generate` (and `npm run prisma:migrate`) to sync the types. Pair with `yo g-next:api` to expose REST endpoints that use the generated class.

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

#### 1. Simple GET endpoint
```bash
yo g-next:api --route users --method get
```
**Result**: Creates a GET endpoint for `/users`

#### 2. POST endpoint for creation
```bash
yo g-next:api --route posts --method post
```
**Result**: Creates a POST endpoint for `/posts`

#### 3. PUT endpoint for update
```bash
yo g-next:api --route users/{userId} --method put
```
**Result**: Creates a PUT endpoint for `/users/{userId}`

#### 4. PATCH endpoint for partial update
```bash
yo g-next:api --route posts/{postId} --method patch
```
**Result**: Creates a PATCH endpoint for `/posts/{postId}`

#### 5. DELETE endpoint for deletion
```bash
yo g-next:api --route comments/{commentId} --method delete
```
**Result**: Creates a DELETE endpoint for `/comments/{commentId}`

### Examples with Dynamic Parameters

#### 6. Endpoint with single parameter
```bash
yo g-next:api users/{userId} get
```
**Result**: Creates a GET endpoint for `/users/{userId}`

#### 7. Endpoint with multiple parameters
```bash
yo g-next:api posts/{postId}/comments/{commentId} get
```
**Result**: Creates a GET endpoint for `/posts/{postId}/comments/{commentId}`

#### 8. Endpoint with parameters and POST method
```bash
yo g-next:api users/{userId}/posts post
```
**Result**: Creates a POST endpoint for `/users/{userId}/posts`

### Examples with Cookie Authentication

#### 9. Admin endpoint with authentication
```bash
yo g-next:api admin/users get --useCookieAuth --cookieRole admin
```
**Result**: Creates a GET endpoint for `/admin/users` with cookie authentication for admin role

#### 10. User endpoint with authentication
```bash
yo g-next:api profile put --useCookieAuth --cookieRole user
```
**Result**: Creates a PUT endpoint for `/profile` with cookie authentication for user role

#### 11. Endpoint with parameters and authentication
```bash
yo g-next:api admin/users/{userId} put --useCookieAuth --cookieRole admin
```
**Result**: Creates a PUT endpoint for `/admin/users/{userId}` with cookie authentication for admin role

### Automation Scripts

#### 12. Automation script
```bash
#!/bin/bash
# Script to create multiple API endpoints

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

#### 13. Script with authentication
```bash
#!/bin/bash
# Script to create APIs with authentication

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

#### 14. HTTP method validation test
```bash
yo g-next:api users invalid
```
**Result**: Shows Yup error "HTTP method must be one of: get, post, put, patch, delete"

#### 15. Authentication validation test
```bash
yo g-next:api --route users --method get --useCookieAuth
```
**Result**: Shows Yup error "Cookie role is required when using cookie authentication"

#### 16. Route format validation test
```bash
yo g-next:api users@#$ get
```
**Result**: Shows Yup error "Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed"

#### 17. Dynamic parameters validation test
```bash
yo g-next:api users/{} get
```
**Result**: Shows Yup error "Parameter name cannot be empty inside curly braces"

#### 18. Parameter name validation test
```bash
yo g-next:api users/{123invalid} get
```
**Result**: Shows Yup error "Parameter name '123invalid' must start with a letter and contain only letters and numbers"

#### 19. Empty route validation test
```bash
yo g-next:api "" get
```
**Result**: Shows Yup error "Route path cannot be empty"

#### 20. Invalid cookie role validation test
```bash
yo g-next:api --route users --method get --useCookieAuth --cookieRole superadmin
```
**Result**: Shows Yup error "Cookie role must be one of: admin, user, moderator"

#### 21. Multiple validation test
```bash
yo g-next:api users@#$ invalid --useCookieAuth --cookieRole guest
```
**Result**: Shows multiple Yup errors:
```
Validation errors found:
  • method: HTTP method must be one of: get, post, put, patch, delete
  • route: Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed
  • cookieRole: Cookie role must be one of: admin, user, moderator
```

### Generated Files

Each command generates the following files:

```
src/
├── pages/
│   └── api/
│       └── [route]/
│           └── index.ts          # Next.js API endpoint
└── endpoints/
    └── [method]-[route]/
        ├── interfaces.ts         # TypeScript interfaces
        ├── validations.ts        # Yup validations
        ├── handler.ts            # Handler logic
        ├── index.test.ts         # Unit tests
        └── index.ts              # Main file
```

### Important Notes

1. **Dynamic parameters**: Use the syntax `{paramName}` for single parameters
2. **HTTP methods**: Only `get`, `post`, `put`, `patch`, `delete` are supported
3. **Authentication**: If you use `--useCookieAuth`, you must also specify `--cookieRole`
4. **Validation**: The generator automatically validates all parameters
5. **Mixed mode**: You can use both CLI and interactive mode in the same project

---

## CLI Examples for All Generators

### Generator AJAX

**Command:** `yo g-next:ajax --route <route> --method <method> [options]`

**Options:**
- `--route` (required): API route path
- `--method` (required): HTTP method
- `--spaFolderName`: SPA folder name

**Examples:**
```bash
yo g-next:ajax --route users --method get
yo g-next:ajax --route posts/{postId} --method post --spaFolderName main
```

### Generator Component

**Command:** `yo g-next:comp --componentName <componentName> [options]`

**Options:**
- `--componentName` (required): Component name
- `--componentPath`: Component path (relative to src/components)

**Examples:**
```bash
yo g-next:comp --componentName UserCard
yo g-next:comp --componentName UserProfile --componentPath user
```

### Generator Form

**Command:** `yo g-next:form --formName <formName> [options]`

**Options:**
- `--formName` (required): Form name
- `--formPath`: Form path (relative to src/components)

**Examples:**
```bash
yo g-next:form --formName LoginForm
yo g-next:form --formName UserRegistration --formPath auth
```

### Generator Model

**Command:** `yo g-next:model --modelName <modelName> --location <location> [options]`

**Options:**
- `--modelName` (required): Model name
- `--location` (required): Location (`client`, `server`, `common`)

**Examples:**
```bash
yo g-next:model --modelName User --location client
yo g-next:model --modelName Product --location server
yo g-next:model --modelName ApiResponse --location common
```

### Generator Page

**Command:** `yo g-next:page --pageName <pageName> --componentName <componentName> --renderingStrategy <renderingStrategy> [options]`

**Options:**
- `--pageName` (required): Page name (e.g., `users`, `[userId]`, `[[...params]]`)
- `--componentName` (required): Page component name
- `--renderingStrategy` (required): Rendering strategy (`none`, `Static Generation Props (SSG)`, `Server-side Rendering Props (SSR)`)
- `--pagePath`: Page path (relative to src/pages)
- `--useCookieAuth`: Enable cookie authentication
- `--cookieRole`: Cookie role for authentication

**Examples:**
```bash
yo g-next:page --pageName users --componentName UserList --renderingStrategy "Static Generation Props (SSG)"
yo g-next:page --pageName "[userId]" --componentName UserDetail --renderingStrategy "Server-side Rendering Props (SSR)" --useCookieAuth --cookieRole admin
```

### Generator Scene

**Command:** `yo g-next:scene --sceneName <sceneName> [options]`

**Options:**
- `--sceneName` (required): Scene name
- `--spaFolderName`: SPA folder name

**Examples:**
```bash
yo g-next:scene --sceneName HomePage
yo g-next:scene --sceneName UserDashboard --spaFolderName admin
```

### Generator Slice

**Command:** `yo g-next:slice --sliceName <sliceName> [options]`

**Options:**
- `--sliceName` (required): Redux slice name
- `--spaFolderName`: SPA folder name
- `--useSagas`: Create saga file (default: true)

**Examples:**
```bash
yo g-next:slice --sliceName user
yo g-next:slice --sliceName products --spaFolderName main --useSagas false
```

### Generator Task

**Command:** `yo g-next:task --taskName <taskName> [options]`

**Options:**
- `--taskName` (required): Task name

**Examples:**
```bash
yo g-next:task --taskName SendEmails
yo g-next:task --taskName ProcessData
```

### Generator Model MongoDB

**Command:** `yo g-next:model-mongodb --modelName <modelName> [options]`

**Options:**
- `--modelName` (required): MongoDB model name

**Examples:**
```bash
yo g-next:model-mongodb --modelName User
yo g-next:model-mongodb --modelName Product
```

### Generator SPA

**Command:** `yo g-next:spa --spaName <spaName> --pageName <pageName> [options]`

**Options:**
- `--spaName` (required): SPA name
- `--pageName` (required): Page name
- `--pagePath`: Page path (relative to src/pages)

**Examples:**
```bash
yo g-next:spa --spaName AdminApp --pageName AdminDashboard
yo g-next:spa --spaName UserApp --pageName UserProfile --pagePath user
```

### Automation Examples

#### Project Setup Script
```bash
#!/bin/bash
# Complete Next.js project setup

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

# API Endpoints (CLI mode: automatically accepts file changes)
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

When CLI parameters are provided (non-interactive mode), the generator **automatically accepts all file changes** without asking for confirmation. This behavior is ideal for automated scripts and CI/CD pipelines where it's not possible to interact with prompts.

**Behavior:**
- **CLI Mode**: All existing files are automatically overwritten without asking for confirmation
- **Interactive Mode**: Yeoman will ask for confirmation before overwriting existing files

**Note:** In CLI mode, all existing files will be automatically overwritten. Use with caution in production.

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

## Development Standards

### Model Architecture Rules

#### Client-Server Model Separation
**CRITICAL**: Client-side files (`src/models/client/`, `src/components/`, `src/spas/`) MUST NEVER import from server-side models (`src/models/server/`).

**✅ Correct Approach:**
- Use common models (`src/models/common/`) for shared types, enums, and interfaces
- Client models can import from `@/models/common/`
- Server models can import from `@/models/common/`
- Common models can import from other common models

**❌ Prohibited Approach:**
```typescript
// ❌ NEVER do this in client files
import { SomeType } from "@/models/server/SomeModel";
import { SomeEnum } from "@/models/server/SomeModel";
```

**✅ Correct Pattern:**
```typescript
// ✅ Use common models for shared types
import { Frequency } from "@/models/common/ResourceCommon";
import { Status } from "@/models/common/StatusCommon";
import { Type } from "@/models/common/TypeCommon";
```

**When to Create Common Models:**
- If a type, enum, or interface is needed by both client and server code, it MUST be placed in `src/models/common/`
- Common models should be organized by domain (e.g., `ResourceCommon`, `UserCommon`, `OrderCommon`)
- Enums that are shared between client and server MUST be in common models
- Types that represent business logic shared between client and server MUST be in common models

### Environment Variables

- All environment variables used in the project MUST be added to `next.config.options.json`
- This includes both server-side and client-side environment variables
- Client-side variables must be prefixed with `NEXT_PUBLIC_`
- Server-side variables (like database connections, API keys, secrets) should be added without the prefix
- When adding new environment variables, always update the `env` array in `next.config.options.json`

### Development Workflow

1. Use GeNYG generators to scaffold new features
2. Follow the established patterns in the codebase
3. Use TypeScript for type safety
4. Follow the project's ESLint and Prettier configuration
5. Write tests for new functionality using Jest
6. Always add new environment variables to `next.config.options.json`

### Redux Store Access Standards

- Always access Redux actions and selectors through the centralized imports from `@/spas/app/redux-store`
- Use `actions.` prefix for all Redux actions (e.g., `actions.setUserList`)
- Use `selectors.` prefix for all Redux selectors (e.g., `selectors.getUserFeList`)
- Never import actions or selectors directly from individual slice files
- This ensures consistent access patterns and proper TypeScript typing

### API Development Best Practices

#### User Authentication Helper
**CRITICAL RULE: Always use the `isUser()` helper function to check user authentication in API handlers.**

**✅ Correct Approach:**
```typescript
import { isUser } from "@/lib/api-helpers/isUser";

export default async function handler(
  req: YourApi.Request,
  res: NextApiResponse<YourApi.EndpointResponse>,
  originalReq: NextApiRequest,
) {
  if (!isUser(originalReq)) {
    return ResponseHandler.json<ErrorResponse>(
      res,
      { message: "Unauthorized" },
      StatusCodes.Unauthorized,
    );
  }
  // ... rest of handler
}
```

**❌ Prohibited Approach:**
```typescript
// DON'T check session.user directly
if (!originalReq.session.user) {
  // Wrong - use isUser() helper instead
}

if (!originalReq.session.user?.isLoggedIn) {
  // Wrong - use isUser() helper instead
}
```

#### RESTful API Design Standards
**CRITICAL RULES:**
1. **All APIs MUST follow RESTful principles - every action must be a CRUD operation**
2. **Use proper HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete), PATCH (partial update)**
3. **Use resource-based URLs - each resource should have its own endpoint**
4. **Avoid action-based URLs - instead of `/resource/action`, use `/resource` with appropriate HTTP method**

**✅ Correct RESTful Patterns:**
```typescript
// Creating a new verification token
POST /user/account-verification-tokens  // ✅ Creates a new token

// Reading a resource
GET /users/{userId}  // ✅ Reads a user

// Updating a resource
PUT /users/{userId}  // ✅ Updates entire user
PATCH /users/{userId}  // ✅ Partial update

// Deleting a resource
DELETE /users/{userId}  // ✅ Deletes a user
```

**❌ Avoid Non-RESTful Patterns:**
```typescript
// ❌ Don't use action-based URLs
POST /user/account-verifications/resend  // Wrong - action in URL
POST /users/{userId}/activate  // Wrong - action in URL
POST /items/{itemId}/cancel  // Wrong - action in URL

// ✅ Use resource-based URLs instead
POST /user/account-verification-tokens  // Correct - creating a token
PUT /users/{userId} with { isActive: true }  // Correct - updating user
PUT /items/{itemId} with { status: "cancelled" }  // Correct - updating item
```

**Resource Naming Conventions:**
- Use plural nouns for collections: `/users`, `/items`, `/tokens`
- Use singular nouns for individual resources: `/user/{userId}`, `/item/{itemId}`
- Use kebab-case for multi-word resources: `/account-verification-tokens`, `/business-clubs`
- Avoid verbs in URLs - the HTTP method already indicates the action

#### ObjectId Handling in APIs
When working with MongoDB ObjectIds in API endpoints, follow these best practices:

**✅ Correct Approach:**
```typescript
// interfaces.ts
import { ObjectId } from "mongodb";

export namespace DeleteAdminUsersByUserIdApi {
  export type QueryStringParameters = {
    userId: ObjectId,  // Use ObjectId type directly
  };
}

// validations.ts
import { yupObjectId } from "@/lib/mongodb/mongo-dao";

const queryStringParametersValidations = () => ({
  userId: yupObjectId().required(),  // Use yupObjectId() for validation
});

// handler.ts
const { userId } = queryStringParameters;
const user = await User.getById(userId);  // No casting needed!
```

**❌ Avoid This Approach:**
```typescript
// interfaces.ts
export type QueryStringParameters = {
  userId: string,  // Don't use string for ObjectId
};

// handler.ts
const userObjectId = new ObjectId(userId);  // Avoid manual casting
```

**Benefits of Using ObjectId Type:**
- Type safety: No need for manual casting with `new ObjectId()`
- Validation: `yupObjectId()` ensures proper ObjectId format
- Cleaner code: Direct usage without conversion
- Better error handling: Automatic validation of ObjectId format

**When to Use ObjectId vs String:**
- Use `ObjectId` type when the parameter represents a MongoDB document ID
- Use `string` type for regular string parameters (names, emails, etc.)
- Always use `yupObjectId()` for ObjectId validation
- Always use `yup.string()` for regular string validation

#### ObjectId Standards for All API Endpoints
**CRITICAL RULES:**
1. **All ObjectId parameters in API interfaces MUST use `ObjectId` type, never `string`**
2. **All ObjectId validations MUST use `yupObjectId()` from `@/lib/mongodb/mongo-dao`**
3. **All yup validations MUST include `.noUnknown()` to reject unexpected fields**
4. **Never use manual casting with `new ObjectId()` in handlers**

**Required Pattern for All API Endpoints:**
```typescript
// interfaces.ts - ALWAYS use ObjectId type
import { ObjectId } from "mongodb";

export namespace YourApi {
  export type QueryStringParameters = {
    id: ObjectId,           // ✅ Correct
    userId: ObjectId,       // ✅ Correct
    // name: string,        // ✅ Correct for non-ObjectId fields
  };
}

// validations.ts - ALWAYS use yupObjectId for ObjectIds
import { yupObjectId } from "@/lib/mongodb/mongo-dao";

const queryStringParametersValidations = () => ({
  id: yupObjectId().required(),     // ✅ Correct
  userId: yupObjectId().required(), // ✅ Correct
  // name: yup.string().required(), // ✅ Correct for non-ObjectId fields
});

export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()).noUnknown(),
  payload: yup.object().shape(payloadValidations()).noUnknown(),
});

// handler.ts - Direct usage without casting
const { id, userId } = queryStringParameters;
const document = await Model.getById(id);  // ✅ No casting needed!
```

#### API Payload Handling in GeNYG Endpoints
When working with PUT/POST API endpoints generated by GeNYG, follow these standards for reading request data:

**✅ Correct Approach:**
```typescript
// handler.ts
export default async function handler(
  req: PutAdminUsersByUserIdApi.Request,
  res: NextApiResponse<PutAdminUsersByUserIdApi.EndpointResponse>,
  originalReq: NextApiRequest,
) {
  try {
    const { validationResult, queryStringParameters, payload } = req;
    
    // Use the destructured payload directly
    const { firstName, lastName, email } = payload;
    
    // Access query parameters
    const { userId } = queryStringParameters;
  } catch (e) {
    // Handle errors
  }
}
```

**❌ Avoid This Approach:**
```typescript
// Don't access req.body directly
const payload = req.body;  // Avoid this approach
const { firstName, lastName } = req.body;  // Don't do this
```

**Key Benefits:**
- **Type Safety**: The `payload` is properly typed according to the interface
- **Validation**: The payload is already validated by the middleware
- **Consistency**: Follows the GeNYG pattern for all API endpoints
- **Error Handling**: Validation errors are handled automatically

### Redux Slice Best Practices

#### Slice Naming Convention
- **ALWAYS use singular names for slices**, not plural
- Examples: `event` (not `events`), `item` (not `items`), `user` (not `users`)
- State key in Redux store should match the slice name (singular)

#### Loading State Management
**CRITICAL RULE: NEVER add `loading` boolean properties to slice state interfaces.**

The application already has a centralized loading system through the `getAjaxIsLoadingByApi` selector that accepts any AJAX API action. This provides immediate loading state for any API call without duplicating loading state across slices.

**✅ Correct Approach:**
```typescript
// Use the centralized loading selector
const isLoading = useSelector(selectors.getAjaxIsLoadingByApi(actions.getAdminResources.api));

// In components
{isLoading ? <CircularProgress /> : <ResourcesList />}
```

**❌ Prohibited Approach:**
```typescript
// DON'T add loading to slice state
export interface ResourceState {
  list: IResourceFe[];
  loading: boolean;  // ❌ NEVER do this
}

// DON'T manage loading in extraReducers
builder.addCase(getAdminResources.request, (state) => {
  state.loading = true;  // ❌ NEVER do this
});
```

**Benefits of Centralized Loading:**
- **No Duplication**: Single source of truth for loading states
- **Automatic Management**: Loading state is handled automatically by AJAX actions
- **Consistent Behavior**: All API calls follow the same loading pattern
- **Reduced Boilerplate**: No need to manage loading state in every slice
- **Better Performance**: No unnecessary state updates for loading flags

#### Using extraReducers with builder.addCase

**CRITICAL: Always use `extraReducers` with `builder.addCase` to handle AJAX action responses, NOT sagas with manual state updates.**

**✅ Correct Pattern:**
```typescript
// index.ts
import { createSlice } from "@reduxjs/toolkit";
import * as extraActions from "../../extra-actions";
import {
  getAdminResourcesByResourceId,
  postAdminResourcesByResourceId,
  putAdminResourcesByResourceIdAndItemId,
  deleteAdminResourcesByResourceIdAndItemId,
} from "../../extra-actions/apis";

export const itemStore = createSlice({
  name: "item",
  initialState,
  reducers: {
    // Optional: custom reducers for manual state updates
  },
  extraReducers: (builder) => {
    // Handle session lifecycle
    builder.addCase(extraActions.clearSession, () => initialState);
    builder.addCase(extraActions.appStartup, () => initialState);

    // Handle GET success - access data via action.payload.data
    builder.addCase(getAdminResourcesByResourceId.success, (state, action) => {
      const items = action.payload.data?.items;
      if (items) {
        state.list = items;
      }
    });

    // Handle POST success
    builder.addCase(postAdminResourcesByResourceId.success, (state, action) => {
      const item = action.payload.data?.item;
      if (item) {
        state.list.push(item);
      }
    });

    // Handle PUT success
    builder.addCase(putAdminResourcesByResourceIdAndItemId.success, (state, action) => {
      const item = action.payload.data?.item;
      if (item) {
        const index = state.list.findIndex((e) => e._id === item._id);
        if (index !== -1) {
          state.list[index] = item;
        }
      }
    });

    // Handle DELETE success - access params via action.payload.prepareParams
    builder.addCase(deleteAdminResourcesByResourceIdAndItemId.success, (state, action) => {
      const itemId = action.payload.prepareParams.itemId;
      state.list = state.list.filter((e) => e._id !== itemId);
    });
  },
});
```

**Sagas are ONLY for Side Effects**
Sagas should handle:
- Triggering follow-up actions (e.g., refresh list after create/update/delete)
- Complex async workflows
- Navigation after operations
- NOT direct state updates (use extraReducers instead)

#### Accessing AJAX Response Data

When handling AJAX actions in extraReducers:
- **Response data**: Access via `action.payload.data`
- **Request parameters**: Access via `action.payload.prepareParams`

### MUI Component Standards
- Always use MUI Stack for flex containers instead of MUI Box with display flex
- MUI Stack provides better semantic meaning and cleaner code for flex layouts
- Use MUI Box only for non-flex containers or when you need specific styling that Stack doesn't support

### CSS Color Standards
- Always use CSS custom properties (var(--color-name)) instead of hardcoded RGB/hex values
- All colors must be defined in `src/styles/colors.css` using the established color system
- If a color doesn't exist in the color system, add it to `colors.css` with a semantic name
- Use semantic color names (e.g., `--Gray-700`, `--Brand-600`) rather than generic names
- Never use hardcoded color values like `#414651` or `rgb(65, 70, 81)` in components
- Import colors.css in your main CSS file or ensure it's loaded globally

### React Component Architecture Standards
- Every React component, scene, and frontend file that creates a React component MUST have a separate hooks file
- Each component must be a folder with two files:
  - `index.tsx`: Contains ONLY the UI/JSX code
  - `index.hooks.tsx`: Contains ONLY the business logic, state management, and side effects
- This separation ensures clean architecture with clear separation of concerns
- UI components should be pure and focused only on rendering
- Business logic, API calls, state management, and side effects belong in the hooks file
- Use custom hooks pattern to extract and organize business logic
- Import and use the hooks in the main component file

### Form Component Standards
**CRITICAL RULE: All form fields in the application MUST use standardized form components from `src/components/_form/` directory.**

#### Available Form Components
The following standardized form components are available in `src/components/_form/`:

**Text Input Components:**
- **`FormTextField`**: For text inputs, numbers, emails, passwords, etc.
- **`FormPassword`**: Specialized password field with show/hide toggle
- **`FormRichTextField`**: Rich text editor with formatting options

**Selection Components:**
- **`FormSelect`**: Dropdown selection with options array
- **`FormSelectBoolean`**: Yes/No or True/False selection
- **`FormAutocomplete`**: Autocomplete selection with search

**Date/Time Components:**
- **`FormDatePicker`**: Date selection with calendar
- **`FormDateTimePicker`**: Date and time selection
- **`FormTimePicker`**: Time selection only

**Boolean Components:**
- **`FormSwitch`**: Toggle switch for boolean values
- **`FormCheckbox`**: Checkbox for boolean values
- **`FormRadioGroup`**: Radio button group for single selection

**Specialized Components:**
- **`FormPhoneSelector`**: Phone number input with country selection
- **`FormAddressSelector`**: Address input with autocomplete
- **`FormChips`**: Chip input for tags or multiple values
- **`FormImageDropZone`**: Image upload with drag and drop
- **`FormImageUpload`**: Image upload with file selection

**✅ Correct Usage:**
```typescript
import { FormTextField } from "@/components/_form/FormTextField";
import { FormSelect } from "@/components/_form/FormSelect";
import { FormSwitch } from "@/components/_form/FormSwitch";

<FormTextField name="firstName" label="First Name" fullWidth />
<FormSelect name="country" label="Country" options={[...]} fullWidth />
<FormSwitch name="isActive" label="Active Status" />
```

**❌ Prohibited Usage:**
```typescript
// NEVER use raw MUI components directly in forms
import { TextField, Select, Switch } from "@mui/material";

// ❌ Don't do this
<TextField {...formData.register("firstName")} />
```

**Benefits:**
- **Automatic Error Handling**: All form components handle validation errors automatically
- **Consistent Styling**: All components follow the same design system
- **Type Safety**: Full TypeScript support with proper typing
- **Accessibility**: Built-in accessibility features and ARIA support
- **Validation Integration**: Seamless integration with react-hook-form validation
- **Reduced Boilerplate**: No need to manually handle error states and validation

### Navigation and Routing Standards

#### React Router Basename
- The application uses React Router with `basename="/app"`
- **CRITICAL**: All `navigate()` calls must use paths WITHOUT the `/app` prefix
- The basename is automatically prepended by React Router

**✅ Correct Navigation:**
```typescript
// Good - without /app prefix
navigate("/settings/users");
navigate("/settings/users/new");
navigate(`/settings/users/${userId}`);
```

**❌ Incorrect Navigation:**
```typescript
// Bad - includes /app prefix (will result in /app/app/settings/users)
navigate("/app/settings/users");
```

### Code Language Standards
- **CRITICAL**: All comments in the code must be written in English
- **CRITICAL**: All documentation files (`.md`, `.txt`, etc.) must be written in English
- **CRITICAL**: All comments in shell scripts (`.sh`) must be written in English
- All labels, messages, and user-facing text must be in English
- Variable names, function names, and identifiers should follow English conventions
- Documentation and README files should be in English
- Error messages and console logs should be in English
- Script output messages and echo statements should be in English

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
