"use strict";

const fs = require("fs");
const fsp = require("fs/promises");
const http = require("http");
const https = require("https");
const net = require("net");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const helperScriptPath = path.join(__dirname, "run-local-generator.js");
const keepTemp = process.env.GENYG_KEEP_TEMP === "1";
const tempRoot = path.join(repoRoot, ".tmp");

const todoSpaFolderName = "todo-app";
const todoPagePath = "/todo-page";

const stepDefinitions = [
  {
    name: "app",
    namespace: "g-next:app",
    options: {},
    expectedPaths: ["package.json", "src/pages/index.tsx", "tsconfig.json"],
    installsDependencies: true,
  },
  {
    name: "pkg-core",
    namespace: "g-next:pkg-core",
    options: { accept: true },
    expectedPaths: [
      ".genyg.json",
      "jest.config.js",
      "next.config.options.json",
      "src/components/AppHead/index.tsx",
      "src/lib/response-handler/index.ts",
    ],
  },
  {
    name: "pkg-mui",
    namespace: "g-next:pkg-mui",
    options: { accept: true },
    expectedPaths: [
      "src/components/AppSnackbar/index.tsx",
      "src/themes/index.ts",
      "src/components/_form/FormTextField/index.tsx",
    ],
  },
  {
    name: "pkg-spa",
    namespace: "g-next:pkg-spa",
    options: { accept: true },
    expectedPaths: ["src/components/AppButton/index.tsx"],
  },
  {
    name: "pkg-mongodb",
    namespace: "g-next:pkg-mongodb",
    options: { accept: true },
    expectedPaths: [
      "src/lib/mongodb/index.ts",
      "src/lib/mongodb/mongo-dao.ts",
      "src/tasks/export-database/exec.ts",
      "src/tasks/import-database/exec.ts",
    ],
  },
  {
    name: "model",
    namespace: "g-next:model",
    options: {
      modelName: "TodoItem",
      location: "common",
    },
    expectedPaths: ["src/models/common/TodoItem/index.ts"],
  },
  {
    name: "model-mongodb",
    namespace: "g-next:model-mongodb",
    options: {
      modelName: "Todo",
    },
    expectedPaths: ["src/models/server/Todo/index.ts"],
  },
  {
    name: "api:get-todos",
    namespace: "g-next:api",
    options: {
      route: "todos",
      method: "get",
    },
    expectedPaths: [
      "src/pages/api/todos/index.ts",
      "src/endpoints/get-todos/index.ts",
      "src/endpoints/get-todos/index.test.ts",
    ],
  },
  {
    name: "api:post-todos",
    namespace: "g-next:api",
    options: {
      route: "todos",
      method: "post",
    },
    expectedPaths: [
      "src/endpoints/post-todos/index.ts",
      "src/endpoints/post-todos/index.test.ts",
    ],
  },
  {
    name: "api:put-todos-by-id",
    namespace: "g-next:api",
    options: {
      route: "todos/{todoId}",
      method: "put",
    },
    expectedPaths: [
      "src/pages/api/todos/[todoId]/index.ts",
      "src/endpoints/put-todos-by-todo-id/index.ts",
    ],
  },
  {
    name: "api:delete-todos-by-id",
    namespace: "g-next:api",
    options: {
      route: "todos/{todoId}",
      method: "delete",
    },
    expectedPaths: ["src/endpoints/delete-todos-by-todo-id/index.ts"],
  },
  {
    name: "spa",
    namespace: "g-next:spa",
    options: {
      spaName: "TodoApp",
      pageName: "TodoPage",
    },
    expectedPaths: [
      "src/pages/todo-page/index.tsx",
      "src/spas/todo-app/index.tsx",
      "src/spas/todo-app/App/index.tsx",
      "src/spas/todo-app/redux-store/index.tsx",
    ],
    smokePath: todoPagePath,
  },
  {
    name: "ajax:get-todos",
    namespace: "g-next:ajax",
    options: {
      route: "todos",
      method: "get",
      spaFolderName: todoSpaFolderName,
    },
    expectedPaths: [
      "src/spas/todo-app/redux-store/extra-actions/apis/get-todos/index.tsx",
    ],
    smokePath: todoPagePath,
  },
  {
    name: "ajax:post-todos",
    namespace: "g-next:ajax",
    options: {
      route: "todos",
      method: "post",
      spaFolderName: todoSpaFolderName,
    },
    expectedPaths: [
      "src/spas/todo-app/redux-store/extra-actions/apis/post-todos/index.tsx",
    ],
    smokePath: todoPagePath,
  },
  {
    name: "ajax:put-todos-by-id",
    namespace: "g-next:ajax",
    options: {
      route: "todos/{todoId}",
      method: "put",
      spaFolderName: todoSpaFolderName,
    },
    expectedPaths: [
      "src/spas/todo-app/redux-store/extra-actions/apis/put-todos-by-todo-id/index.tsx",
    ],
    smokePath: todoPagePath,
  },
  {
    name: "ajax:delete-todos-by-id",
    namespace: "g-next:ajax",
    options: {
      route: "todos/{todoId}",
      method: "delete",
      spaFolderName: todoSpaFolderName,
    },
    expectedPaths: [
      "src/spas/todo-app/redux-store/extra-actions/apis/delete-todos-by-todo-id/index.tsx",
    ],
    smokePath: todoPagePath,
  },
  {
    name: "slice",
    namespace: "g-next:slice",
    options: {
      sliceName: "todo",
      spaFolderName: todoSpaFolderName,
      useSagas: true,
    },
    expectedPaths: [
      "src/spas/todo-app/redux-store/slices/todo/index.ts",
      "src/spas/todo-app/redux-store/slices/todo/todo.interfaces.ts",
      "src/spas/todo-app/redux-store/slices/todo/todo.selectors.ts",
      "src/spas/todo-app/redux-store/slices/todo/todo.sagas.ts",
    ],
    smokePath: todoPagePath,
  },
  {
    name: "scene",
    namespace: "g-next:scene",
    options: {
      sceneName: "TodoScene",
      spaFolderName: todoSpaFolderName,
    },
    expectedPaths: [
      "src/spas/todo-app/scenes/TodoScene/index.tsx",
      "src/spas/todo-app/scenes/TodoScene/index.hooks.tsx",
    ],
    smokePath: todoPagePath,
  },
];

const readTextIfExists = async (filePath) => {
  try {
    return await fsp.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const readJsonIfExists = async (filePath) => {
  const content = await readTextIfExists(filePath);
  return content ? JSON.parse(content) : null;
};

const runCommand = ({
  command,
  args,
  cwd,
  description,
  env = {},
  stdio = "pipe",
}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...process.env,
        CI: "1",
        ...env,
      },
      stdio,
    });

    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const error = new Error(
        `${description} failed with exit code ${code}\n${stderr || stdout}`,
      );
      error.stdout = stdout;
      error.stderr = stderr;
      error.exitCode = code;
      reject(error);
    });
  });

const assertPathsExist = async (projectRoot, relativePaths) => {
  for (const relativePath of relativePaths) {
    const absolutePath = path.join(projectRoot, relativePath);
    try {
      await fsp.access(absolutePath);
    } catch (error) {
      throw new Error(`Expected path was not generated: ${relativePath}`);
    }
  }
};

const installDependenciesIfNeeded = async (
  projectRoot,
  packageJsonBefore,
  packageJsonAfter,
  installsDependencies,
) => {
  if (installsDependencies || packageJsonBefore !== packageJsonAfter) {
    await runCommand({
      command: "npm",
      args: ["install"],
      cwd: projectRoot,
      description: "npm install in generated project",
      stdio: "inherit",
    });
  }
};

const runTypecheck = async (projectRoot) => {
  const tsconfigPath = path.join(projectRoot, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) {
    return;
  }

  await runCommand({
    command: "npx",
    args: ["tsc", "--noEmit"],
    cwd: projectRoot,
    description: "TypeScript typecheck",
    stdio: "inherit",
  });
};

const runUnitTests = async (projectRoot) => {
  const packageJson = await readJsonIfExists(path.join(projectRoot, "package.json"));
  const hasTestScript = Boolean(packageJson?.scripts?.test);

  if (!hasTestScript || packageJson.scripts.test === "echo \"Error: no test specified\" && exit 1") {
    return;
  }

  await runCommand({
    command: "npm",
    args: ["test", "--", "--passWithNoTests"],
    cwd: projectRoot,
    description: "Generated project unit tests",
    stdio: "inherit",
  });
};

const runLint = async (projectRoot) => {
  const packageJson = await readJsonIfExists(path.join(projectRoot, "package.json"));
  if (!packageJson?.scripts?.lint) {
    return;
  }

  await runCommand({
    command: "npm",
    args: ["run", "lint"],
    cwd: projectRoot,
    description: "Generated project lint",
    stdio: "inherit",
  });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getFreePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });

const httpRequest = (urlString, options = {}) =>
  new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.request(
      url,
      {
        method: options.method ?? "GET",
        headers: options.headers,
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 0,
            ok:
              (response.statusCode ?? 0) >= 200 &&
              (response.statusCode ?? 0) < 300,
            body,
          });
        });
      },
    );

    request.on("error", reject);

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });

const terminateProcess = async (child) => {
  if (!child || child.exitCode !== null) {
    return;
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch (error) {
    child.kill("SIGTERM");
  }

  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    wait(5_000),
  ]);

  if (child.exitCode === null) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch (error) {
      child.kill("SIGKILL");
    }
    await new Promise((resolve) => child.once("exit", resolve));
  }
};

const waitForHttp = async (url, timeoutMs, getLogs) => {
  const start = Date.now();
  let lastError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await httpRequest(url);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`Unexpected status code ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await wait(1_000);
  }

  throw new Error(
    `Server at ${url} did not become ready in time.\n${lastError?.message ?? ""}\n${getLogs()}`,
  );
};

const withDevServer = async (projectRoot, callback) => {
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const port = await getFreePort();
    const child = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
      cwd: projectRoot,
      env: {
        ...process.env,
        CI: "1",
        PORT: String(port),
      },
      detached: true,
      stdio: "pipe",
    });

    let logs = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        logs += chunk.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        logs += chunk.toString();
      });
    }

    try {
      await waitForHttp(`http://127.0.0.1:${port}/`, 90_000, () => logs);
      return await callback({
        port,
        logs: () => logs,
      });
    } catch (error) {
      const portBusy =
        /already in use/i.test(logs) || /EADDRINUSE/i.test(logs);

      if (portBusy && attempt < maxAttempts - 1) {
        console.warn(
          `next dev could not bind to port ${port} (attempt ${attempt + 1}/${maxAttempts}), retrying...`,
        );
        continue;
      }

      throw error;
    } finally {
      await terminateProcess(child);
    }
  }

  throw new Error("withDevServer: exhausted port retries");
};

const runAppSmoke = async (projectRoot, smokePath) => {
  await withDevServer(projectRoot, async ({ port }) => {
    const response = await httpRequest(`http://127.0.0.1:${port}${smokePath}`);
    if (!response.ok) {
      throw new Error(
        `Application smoke check failed for ${smokePath} with status ${response.status}`,
      );
    }
  });
};

const writeProjectFile = async (projectRoot, relativePath, content) => {
  const absolutePath = path.join(projectRoot, relativePath);
  await fsp.mkdir(path.dirname(absolutePath), {
    recursive: true,
  });
  await fsp.writeFile(absolutePath, content, "utf8");
};

const updateProjectPackageJson = async (projectRoot, updater) => {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = JSON.parse(await fsp.readFile(packageJsonPath, "utf8"));
  const nextPackageJson = updater(packageJson);
  await fsp.writeFile(
    packageJsonPath,
    `${JSON.stringify(nextPackageJson, null, 2)}\n`,
    "utf8",
  );
};

const applyTodoFixture = async (projectRoot) => {
  await writeProjectFile(
    projectRoot,
    "src/models/common/TodoItem/index.ts",
    `export type TodoItem = {
  _id: string;
  title: string;
  completed: boolean;
  created: string;
};
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/models/server/Todo/index.ts",
    `import { ObjectId } from "mongodb";
import mongoDao from "@/lib/mongodb/mongo-dao";
import type { TodoItem } from "@/models/common/TodoItem";

export type ITodo = {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  created: Date;
  v: number;
};

export class Todo {
  _id: ObjectId;
  title: string;
  completed: boolean;
  created: Date;
  v: number;

  static get collectionName() {
    return "todos";
  }

  constructor(todo: ITodo) {
    if (!todo._id) {
      throw new Error("Todo requires an _id");
    }

    this._id = todo._id;
    this.title = todo.title;
    this.completed = todo.completed;
    this.created = todo.created;
    this.v = todo.v;
  }

  static async create({
    title,
  }: {
    title: string;
  }): Promise<Todo> {
    const todo = await mongoDao.insertOne<ITodo>(Todo.collectionName, {
      title,
      completed: false,
      created: new Date(),
      v: 1,
    });

    return new Todo(todo);
  }

  static async getList(): Promise<Todo[]> {
    const todos = await mongoDao.findMany<ITodo>(Todo.collectionName, {}, {
      sort: { created: -1 },
    });

    return todos.map((todo) => new Todo(todo));
  }

  static async getById(_id: ObjectId): Promise<Todo | null> {
    const todo = await mongoDao.findOne<ITodo>(Todo.collectionName, { _id });
    return todo ? new Todo(todo) : null;
  }

  async update({
    title,
    completed,
  }: {
    title: string;
    completed: boolean;
  }) {
    await mongoDao.updateOne<ITodo>(
      Todo.collectionName,
      { _id: this._id },
      {
        $set: {
          title,
          completed,
          v: this.v + 1,
        },
      },
    );

    const freshTodo = await Todo.getById(this._id);
    if (!freshTodo) {
      throw new Error("Updated todo not found");
    }

    this.title = freshTodo.title;
    this.completed = freshTodo.completed;
    this.created = freshTodo.created;
    this.v = freshTodo.v;
  }

  async delete() {
    await mongoDao.deleteOne<ITodo>(Todo.collectionName, { _id: this._id });
  }

  toClient(): TodoItem {
    return {
      _id: this._id.toHexString(),
      title: this.title,
      completed: this.completed,
      created: this.created.toISOString(),
    };
  }
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/get-todos/interfaces.ts",
    `import { ErrorResponse, RequestI } from "@/lib/response-handler";
import type { TodoItem } from "@/models/common/TodoItem";

export namespace GetTodosApi {
  export type QueryStringParameters = {};

  export type SuccessResponse = {
    items: TodoItem[];
  };

  export type EndpointResponse = SuccessResponse | ErrorResponse;

  export interface Request extends RequestI<QueryStringParameters, null> {}
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/get-todos/validations.ts",
    `import * as yup from "yup";

export default () => ({
  queryStringParameters: yup.object().shape({}).noUnknown(),
});
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/get-todos/handler.ts",
    `import { ErrorResponse, ResponseHandler, StatusCodes } from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { GetTodosApi } from "./interfaces";
import { Todo } from "@/models/server/Todo";

export default async function handler(
  req: GetTodosApi.Request,
  res: NextApiResponse<GetTodosApi.EndpointResponse>,
) {
  try {
    const items = await Todo.getList();

    return ResponseHandler.json<GetTodosApi.SuccessResponse>(
      res,
      {
        items: items.map((todo) => todo.toClient()),
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return ResponseHandler.json<ErrorResponse>(
      res,
      {
        message: error instanceof Error ? error.message : "Internal error",
      },
      StatusCodes.InternalServerError,
    );
  }
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/post-todos/interfaces.ts",
    `import { ErrorResponse, RequestI } from "@/lib/response-handler";
import type { TodoItem } from "@/models/common/TodoItem";

export namespace PostTodosApi {
  export type QueryStringParameters = {};

  export type Payload = {
    title: string;
  };

  export type SuccessResponse = {
    item: TodoItem;
  };

  export type EndpointResponse = SuccessResponse | ErrorResponse;

  export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/post-todos/validations.ts",
    `import * as yup from "yup";

export default () => ({
  queryStringParameters: yup.object().shape({}).noUnknown(),
  payload: yup
    .object()
    .shape({
      title: yup.string().trim().required(),
    })
    .noUnknown(),
});
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/post-todos/handler.ts",
    `import { ErrorResponse, ResponseHandler, StatusCodes } from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PostTodosApi } from "./interfaces";
import { Todo } from "@/models/server/Todo";

export default async function handler(
  req: PostTodosApi.Request,
  res: NextApiResponse<PostTodosApi.EndpointResponse>,
) {
  try {
    const todo = await Todo.create({
      title: req.payload.title.trim(),
    });

    return ResponseHandler.json<PostTodosApi.SuccessResponse>(
      res,
      {
        item: todo.toClient(),
      },
      StatusCodes.Created,
    );
  } catch (error) {
    return ResponseHandler.json<ErrorResponse>(
      res,
      {
        message: error instanceof Error ? error.message : "Internal error",
      },
      StatusCodes.InternalServerError,
    );
  }
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/put-todos-by-todo-id/interfaces.ts",
    `import { ErrorResponse, RequestI } from "@/lib/response-handler";
import type { TodoItem } from "@/models/common/TodoItem";

export namespace PutTodosByTodoIdApi {
  export type QueryStringParameters = {
    todoId: string;
  };

  export type Payload = {
    title: string;
    completed: boolean;
  };

  export type SuccessResponse = {
    item: TodoItem;
  };

  export type EndpointResponse = SuccessResponse | ErrorResponse;

  export interface Request extends RequestI<QueryStringParameters, Payload> {}
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/put-todos-by-todo-id/validations.ts",
    `import * as yup from "yup";

export default () => ({
  queryStringParameters: yup
    .object()
    .shape({
      todoId: yup.string().required(),
    })
    .noUnknown(),
  payload: yup
    .object()
    .shape({
      title: yup.string().trim().required(),
      completed: yup.boolean().required(),
    })
    .noUnknown(),
});
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/put-todos-by-todo-id/handler.ts",
    `import { ObjectId } from "mongodb";
import { ErrorResponse, ResponseHandler, StatusCodes } from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PutTodosByTodoIdApi } from "./interfaces";
import { Todo } from "@/models/server/Todo";

export default async function handler(
  req: PutTodosByTodoIdApi.Request,
  res: NextApiResponse<PutTodosByTodoIdApi.EndpointResponse>,
) {
  try {
    const todo = await Todo.getById(new ObjectId(req.queryStringParameters.todoId));

    if (!todo) {
      return ResponseHandler.json<ErrorResponse>(
        res,
        { message: "Todo not found" },
        StatusCodes.NotFound,
      );
    }

    await todo.update({
      title: req.payload.title.trim(),
      completed: req.payload.completed,
    });

    return ResponseHandler.json<PutTodosByTodoIdApi.SuccessResponse>(
      res,
      {
        item: todo.toClient(),
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return ResponseHandler.json<ErrorResponse>(
      res,
      {
        message: error instanceof Error ? error.message : "Internal error",
      },
      StatusCodes.InternalServerError,
    );
  }
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/delete-todos-by-todo-id/interfaces.ts",
    `import { ErrorResponse, RequestI } from "@/lib/response-handler";

export namespace DeleteTodosByTodoIdApi {
  export type QueryStringParameters = {
    todoId: string;
  };

  export type SuccessResponse = {
    success: true;
  };

  export type EndpointResponse = SuccessResponse | ErrorResponse;

  export interface Request extends RequestI<QueryStringParameters, null> {}
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/delete-todos-by-todo-id/validations.ts",
    `import * as yup from "yup";

export default () => ({
  queryStringParameters: yup
    .object()
    .shape({
      todoId: yup.string().required(),
    })
    .noUnknown(),
});
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/endpoints/delete-todos-by-todo-id/handler.ts",
    `import { ObjectId } from "mongodb";
import { ErrorResponse, ResponseHandler, StatusCodes } from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { DeleteTodosByTodoIdApi } from "./interfaces";
import { Todo } from "@/models/server/Todo";

export default async function handler(
  req: DeleteTodosByTodoIdApi.Request,
  res: NextApiResponse<DeleteTodosByTodoIdApi.EndpointResponse>,
) {
  try {
    const todo = await Todo.getById(new ObjectId(req.queryStringParameters.todoId));

    if (!todo) {
      return ResponseHandler.json<ErrorResponse>(
        res,
        { message: "Todo not found" },
        StatusCodes.NotFound,
      );
    }

    await todo.delete();

    return ResponseHandler.json<DeleteTodosByTodoIdApi.SuccessResponse>(
      res,
      {
        success: true,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return ResponseHandler.json<ErrorResponse>(
      res,
      {
        message: error instanceof Error ? error.message : "Internal error",
      },
      StatusCodes.InternalServerError,
    );
  }
}
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/spas/todo-app/scenes/TodoScene/index.hooks.tsx",
    `import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TodoItem } from "@/models/common/TodoItem";

type TodoPayload = {
  title: string;
};

type TodoUpdatePayload = {
  title: string;
  completed: boolean;
};

const fetchJson = async <T,>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
};

export const useTodoScene = () => {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleBusyRef = useRef(false);

  const fetchTodoItems = useCallback(async () => {
    const data = await fetchJson<{ items: TodoItem[] }>("/api/todos");
    return data.items;
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    fetchTodoItems()
      .then((nextItems) => {
        if (active) {
          setItems(nextItems);
        }
      })
      .catch((nextError) => {
        if (active) {
          setError(
            nextError instanceof Error ? nextError.message : "Load failed",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [fetchTodoItems]);

  const resetForm = useCallback(() => {
    setTitle("");
    setEditingTodoId(null);
  }, []);

  const submitLabel = useMemo(
    () => (editingTodoId ? "Save todo" : "Add todo"),
    [editingTodoId],
  );

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      return;
    }

    setError(null);

    if (editingTodoId) {
      const currentTodo = items.find((item) => item._id === editingTodoId);
      if (!currentTodo) {
        return;
      }

      const data = await fetchJson<{ item: TodoItem }>(
        \`/api/todos/\${editingTodoId}\`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: title.trim(),
            completed: currentTodo.completed,
          } satisfies TodoUpdatePayload),
        },
      );

      setItems((currentItems) =>
        currentItems.map((item) =>
          item._id === data.item._id ? data.item : item,
        ),
      );
      resetForm();
      return;
    }

    const data = await fetchJson<{ item: TodoItem }>("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
      } satisfies TodoPayload),
    });

    setItems((currentItems) => [data.item, ...currentItems]);
    resetForm();
  }, [editingTodoId, items, resetForm, title]);

  const startEditing = useCallback((item: TodoItem) => {
    setEditingTodoId(item._id);
    setTitle(item.title);
  }, []);

  const toggleTodo = useCallback(async (item: TodoItem) => {
    if (toggleBusyRef.current) {
      return;
    }

    toggleBusyRef.current = true;
    setError(null);

    try {
      const data = await fetchJson<{ item: TodoItem }>(\`/api/todos/\${item._id}\`, {
        method: "PUT",
        body: JSON.stringify({
          title: item.title,
          completed: !item.completed,
        } satisfies TodoUpdatePayload),
      });

      const nextId = String(data.item._id);
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          String(currentItem._id) === nextId ? data.item : currentItem,
        ),
      );
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Toggle failed",
      );
    } finally {
      toggleBusyRef.current = false;
    }
  }, []);

  const deleteTodo = useCallback(async (item: TodoItem) => {
    setError(null);

    await fetchJson<{ success: true }>(\`/api/todos/\${item._id}\`, {
      method: "DELETE",
    });

    setItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem._id !== item._id),
    );

    if (editingTodoId === item._id) {
      resetForm();
    }
  }, [editingTodoId, resetForm]);

  return {
    items,
    title,
    setTitle,
    editingTodoId,
    submitLabel,
    handleSubmit,
    startEditing,
    toggleTodo,
    deleteTodo,
    resetForm,
    isLoading,
    error,
  };
};
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/spas/todo-app/scenes/TodoScene/index.tsx",
    `import React, { memo } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTodoScene } from "./index.hooks";

type TodoSceneProps = {};

export const TodoScene = memo(({}: TodoSceneProps) => {
  const {
    items,
    title,
    setTitle,
    editingTodoId,
    submitLabel,
    handleSubmit,
    startEditing,
    toggleTodo,
    deleteTodo,
    resetForm,
    isLoading,
    error,
  } = useTodoScene();

  return (
    <Stack spacing={3} sx={{ maxWidth: 720, margin: "0 auto", padding: 4 }}>
      <Typography variant="h4">Todo CRUD</Typography>
      <Typography color="text.secondary">
        This page is generated and validated by the local GeNYG harness.
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ padding: 2 }}>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <TextField
            data-cy="todo-input"
            label="Todo title"
            fullWidth
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSubmit();
              }
            }}
          />
          <Button
            data-cy="todo-submit"
            variant="contained"
            onClick={() => void handleSubmit()}
          >
            {submitLabel}
          </Button>
          {editingTodoId ? (
            <Button data-cy="todo-cancel" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </Stack>
      </Paper>

      {isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper
              key={item._id}
              data-cy="todo-item"
              data-completed={item.completed ? "true" : "false"}
              sx={{
                padding: 2,
                border: "1px solid",
                borderColor: item.completed ? "success.main" : "divider",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    data-cy="todo-title"
                    sx={{
                      textDecoration: item.completed ? "line-through" : "none",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.completed ? "Completed" : "Open"}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    data-cy="todo-toggle"
                    size="small"
                    variant="outlined"
                    onClick={() => void toggleTodo(item)}
                  >
                    Toggle
                  </Button>
                  <Button
                    data-cy="todo-edit"
                    size="small"
                    onClick={() => startEditing(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    data-cy="todo-delete"
                    size="small"
                    color="error"
                    onClick={() => void deleteTodo(item)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}

          {!items.length ? (
            <Paper sx={{ padding: 2 }}>
              <Typography color="text.secondary">
                No todos yet. Create one to start the CRUD flow.
              </Typography>
            </Paper>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
});

TodoScene.displayName = "TodoScene";
`,
  );

  await writeProjectFile(
    projectRoot,
    "src/spas/todo-app/App/index.tsx",
    `import React, { memo, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { AppSnackbar } from "@/components/AppSnackbar";
import { TodoScene } from "@/spas/todo-app/scenes/TodoScene";
import useAppHooks from "./index.hooks";
import domNavigation from "@/models/client/DomNavigation";

const NavigationInitializer: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    domNavigation.navigate = navigate;
  }, [navigate]);

  return null;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <NavigationInitializer />
      <Routes>
        <Route path="/" element={<TodoScene />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const { theme, open, type, message, handleClose } = useAppHooks();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/todo-page">
        <AppRoutes />
      </BrowserRouter>
      <AppSnackbar
        open={open}
        message={message}
        severity={type}
        onClose={handleClose}
      />
    </ThemeProvider>
  );
};

export default memo(App);
`,
  );
};

const installCypress = async (projectRoot) => {
  await updateProjectPackageJson(projectRoot, (packageJson) => ({
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      "test:e2e": "cypress run --browser electron",
    },
  }));

  await writeProjectFile(
    projectRoot,
    "cypress.config.cjs",
    `const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
    defaultCommandTimeout: 10000,
  },
});
`,
  );

  await writeProjectFile(
    projectRoot,
    "cypress/e2e/todo.cy.js",
    `describe("Todo CRUD", () => {
  it("creates, updates, toggles and deletes a todo", () => {
    cy.intercept({ method: "PUT", url: "**/api/todos/*" }).as("putTodo");

    cy.visit("/todo-page");

    // MUI TextField: data-cy is on the root; type into the actual input so React state updates.
    cy.get('[data-cy="todo-input"]').find("input").type("Buy milk");
    cy.get('[data-cy="todo-submit"]').click();
    cy.contains('[data-cy="todo-title"]', "Buy milk").should("be.visible");

    cy.get('[data-cy="todo-toggle"]').first().click({ force: true });
    cy.wait("@putTodo").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="todo-item"]').first().should("have.attr", "data-completed", "true");

    cy.get('[data-cy="todo-edit"]').first().click({ force: true });
    cy.get('[data-cy="todo-input"]').find("input").clear().type("Buy oat milk");
    cy.get('[data-cy="todo-submit"]').click({ force: true });
    cy.contains('[data-cy="todo-title"]', "Buy oat milk").should("be.visible");

    cy.get('[data-cy="todo-delete"]').first().click({ force: true });
    cy.contains('[data-cy="todo-title"]', "Buy oat milk").should("not.exist");
  });
});
`,
  );

  await runCommand({
    command: "npm",
    args: ["install", "--save-dev", "cypress"],
    cwd: projectRoot,
    description: "Install Cypress in generated project",
    stdio: "inherit",
  });
};

const parseJsonBody = (response) => {
  if (!response.body) {
    return null;
  }

  return JSON.parse(response.body);
};

const runFinalApiChecks = async (port) => {
  const initialResponse = await httpRequest(`http://127.0.0.1:${port}/api/todos`);
  if (initialResponse.status !== 200) {
    throw new Error(`GET /api/todos returned ${initialResponse.status}`);
  }

  const initialBody = parseJsonBody(initialResponse);
  if (!Array.isArray(initialBody?.items)) {
    throw new Error("GET /api/todos did not return an items array");
  }

  const createResponse = await httpRequest(`http://127.0.0.1:${port}/api/todos`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "API created todo",
    }),
  });

  if (![200, 201].includes(createResponse.status)) {
    throw new Error(`POST /api/todos returned ${createResponse.status}`);
  }

  const createdBody = parseJsonBody(createResponse);
  const createdTodoId = createdBody?.item?._id;

  if (!createdTodoId) {
    throw new Error("POST /api/todos did not return the created todo id");
  }

  const updateResponse = await httpRequest(
    `http://127.0.0.1:${port}/api/todos/${createdTodoId}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: "API updated todo",
        completed: true,
      }),
    },
  );

  if (updateResponse.status !== 200) {
    throw new Error(
      `PUT /api/todos/${createdTodoId} returned ${updateResponse.status}`,
    );
  }

  const updatedBody = parseJsonBody(updateResponse);
  if (updatedBody?.item?.title !== "API updated todo" || !updatedBody?.item?.completed) {
    throw new Error("PUT /api/todos did not persist the updated todo");
  }

  const deleteResponse = await httpRequest(
    `http://127.0.0.1:${port}/api/todos/${createdTodoId}`,
    {
      method: "DELETE",
    },
  );

  if (deleteResponse.status !== 200) {
    throw new Error(
      `DELETE /api/todos/${createdTodoId} returned ${deleteResponse.status}`,
    );
  }
};

const runFinalBrowserCheck = async (projectRoot, port) => {
  await runCommand({
    command: "npx",
    args: [
      "cypress",
      "run",
      "--browser",
      "electron",
      "--config",
      `baseUrl=http://127.0.0.1:${port}`,
    ],
    cwd: projectRoot,
    description: "Run Cypress Todo CRUD E2E",
    stdio: "inherit",
  });
};

const runGeneratorStep = async (projectRoot, step) => {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJsonBefore = await readTextIfExists(packageJsonPath);

  await runCommand({
    command: process.execPath,
    args: [
      helperScriptPath,
      step.namespace,
      JSON.stringify(step.options ?? {}),
      JSON.stringify(step.promptAnswers ?? {}),
    ],
    cwd: projectRoot,
    description: `Generator step ${step.name}`,
    stdio: "inherit",
  });

  const packageJsonAfter = await readTextIfExists(packageJsonPath);

  await assertPathsExist(projectRoot, step.expectedPaths);
  await installDependenciesIfNeeded(
    projectRoot,
    packageJsonBefore,
    packageJsonAfter,
    Boolean(step.installsDependencies),
  );
};

const runChecksForStep = async (projectRoot, step) => {
  await runTypecheck(projectRoot);
  await runUnitTests(projectRoot);
  await runLint(projectRoot);
  await runAppSmoke(projectRoot, step.smokePath ?? "/");
};

const removeTempProject = async (projectRoot) => {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await fsp.rm(projectRoot, {
        recursive: true,
        force: true,
      });
      return true;
    } catch (error) {
      if (attempt === 3) {
        console.warn(`Unable to remove temp project at ${projectRoot}`);
        console.warn(error?.message ?? error);
        return false;
      }

      await wait(1_000 * attempt);
    }
  }

  return false;
};

const createTempProject = async () => {
  const projectRoot = path.join(
    tempRoot,
    `genyg-local-${crypto.randomBytes(4).toString("hex")}`,
  );

  await fsp.mkdir(projectRoot, {
    recursive: true,
  });

  return projectRoot;
};

const main = async () => {
  await fsp.mkdir(tempRoot, {
    recursive: true,
  });

  const projectRoot = await createTempProject();
  let shouldCleanup = !keepTemp;

  console.log(`Temporary GeNYG project: ${projectRoot}`);

  try {
    for (const step of stepDefinitions) {
      console.log(`\n==> ${step.name}`);
      await runGeneratorStep(projectRoot, step);
      await runChecksForStep(projectRoot, step);
    }

    console.log("\n==> todo fixture");
    await applyTodoFixture(projectRoot);
    await runTypecheck(projectRoot);
    await runUnitTests(projectRoot);
    await runLint(projectRoot);
    await runAppSmoke(projectRoot, todoPagePath);

    console.log("\n==> cypress install");
    await installCypress(projectRoot);

    console.log("\n==> final validation");
    await withDevServer(projectRoot, async ({ port }) => {
      await runFinalApiChecks(port);
      await runFinalBrowserCheck(projectRoot, port);
    });

    console.log("\nLocal GeNYG todo harness completed successfully.");
  } catch (error) {
    shouldCleanup = !keepTemp;
    console.error("\nLocal GeNYG todo harness failed.");
    console.error(error?.stack ?? error?.message ?? error);

    if (!keepTemp) {
      console.error(`Set GENYG_KEEP_TEMP=1 to inspect ${projectRoot}`);
    }

    throw error;
  } finally {
    if (shouldCleanup) {
      await removeTempProject(projectRoot);
    } else {
      console.log(`Kept temp project at ${projectRoot}`);
    }
  }
};

main().catch((error) => {
  console.error(error?.stack ?? error?.message ?? error);
  process.exit(1);
});
