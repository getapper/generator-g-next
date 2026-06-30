# GeNYG Prisma generators

Two generators add Prisma (PostgreSQL / Neon) support to a GeNYG project:

| Command | Purpose |
| --- | --- |
| `yo g-next:pkg-prisma` | One-time setup: installs Prisma, creates the schema + client singleton, env vars and scripts. |
| `yo g-next:model-prisma --modelName <Name>` | Adds a model to `schema.prisma` and generates a CRUD data-access class. |

## Making your local (modified) generator global

Since these generators live in your local clone of `generator-g-next`, link the
package globally so `yo g-next:*` resolves to *this* code:

```bash
cd /Users/antoniogiordano/Documents/getapper/tools/generator-g-next
npm install          # ensure deps are present
npm install -g .     # or: npm link  — registers this folder as the global generator-g-next
```

Verify it's picked up:

```bash
yo --generators | grep g-next
```

### ⚠️ nvm caveat — same Node version on both sides

Global npm packages are installed **per Node version**. If you link the generator
under one Node version (via nvm) but run `yo` in the *AI Todo List* project under a
different version, `yo g-next:*` won't be found (or will resolve to an old copy).

Keep the versions identical. This repo pins Node `22` in `.nvmrc`, so in **both**
terminals (the generator folder and the AI Todo List folder) run:

```bash
nvm use 22      # match .nvmrc
node -v         # confirm the SAME version in both shells before npm i -g / yo
```

If you change Node version later, re-run `npm install -g .` in this folder under the
new version.

## End-to-end workflow in a project

```bash
# in your Next.js app (e.g. AI Todo List), after yo g-next:app + yo g-next:pkg-core
yo g-next:pkg-prisma
npm install

# 1) put your Neon connection strings into the .env files:
#    DATABASE_URL = pooled host (…-pooler…neon.tech), used at runtime
#    DIRECT_URL   = direct host (no -pooler),         used by migrations

# 2) create a model + its CRUD data-access class
yo g-next:model-prisma --modelName Task

# 3) edit prisma/schema.prisma to add fields to the Task model, e.g.
#      title     String
#      done      Boolean   @default(false)
#      priority  Int       @default(0)
#      dueDate   DateTime?

# 4) generate the client and run the migration
npm run prisma:generate
npm run prisma:migrate     # creates the table on Neon
```

## Generated CRUD class

`src/models/server/<Model>/index.ts` exposes:

```ts
Task.create(data)        // Prisma.TaskCreateInput  -> Task
Task.getById(id)         // string -> Task | null
Task.getList(args?)      // Prisma.TaskFindManyArgs -> Task[]
Task.count(where?)       // Prisma.TaskWhereInput -> number
task.patch(data)         // Prisma.TaskUpdateInput (instance method)
Task.delete(id)          // string -> void
Task.deleteAll()         // -> number (deleted count)
task.refresh()           // reload the instance from DB
```

Types come straight from the generated Prisma client, so they stay in sync with the
schema after every `npm run prisma:generate`.

## Neon notes

- Use the **pooled** connection string (host contains `-pooler`) for `DATABASE_URL`
  so serverless/Next.js runtimes don't exhaust connections.
- Use the **direct** (non-pooler) string for `DIRECT_URL` — Prisma Migrate needs it.
- Append `?sslmode=require` to both.
- On AWS App Runner you connect to Neon over the public internet, so **no VPC
  connector is required** (unlike RDS/Aurora). Just set `DATABASE_URL` / `DIRECT_URL`
  as App Runner runtime environment variables.
