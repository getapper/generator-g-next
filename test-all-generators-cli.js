#!/usr/bin/env node

/**
 * Test script for all generators CLI functionality
 * Uses yo from test-project/node_modules when present (yo 7.x), else global yo.
 */

const { spawnYo, resolveYo } = require("./scripts/resolve-yo");
const { cliTestPassed } = require("./scripts/cli-test-shared");

const repoRoot = __dirname;

const testCases = [
  {
    name: "API Generator - Basic GET",
    args: ["g-next:api", "--route", "users", "--method", "get"],
    expect: "cli-success",
  },
  {
    name: "API Generator - POST with auth",
    args: [
      "g-next:api",
      "--route",
      "users",
      "--method",
      "post",
      "--useCookieAuth",
      "--cookieRole",
      "admin",
    ],
    expect: "cli-success",
  },
  {
    name: "API Generator - Invalid method",
    args: ["g-next:api", "--route", "users", "--method", "invalid"],
    expect: "validation",
  },
  {
    name: "Component Generator - Basic",
    args: ["g-next:comp", "--componentName", "UserCard"],
    expect: "cli-success",
  },
  {
    name: "Component Generator - With path",
    args: [
      "g-next:comp",
      "--componentName",
      "UserProfile",
      "--componentPath",
      "user",
    ],
    expect: "cli-success",
  },
  {
    name: "Component Generator - Invalid name",
    args: ["g-next:comp", "--componentName", "123Invalid"],
    expect: "validation",
  },
  {
    name: "Form Generator - Basic",
    args: ["g-next:form", "--formName", "LoginForm"],
    expect: "cli-success",
  },
  {
    name: "Form Generator - With path",
    args: [
      "g-next:form",
      "--formName",
      "UserRegistration",
      "--formPath",
      "auth",
    ],
    expect: "cli-success",
  },
  {
    name: "Model Generator - Client model",
    args: ["g-next:model", "--modelName", "User", "--location", "client"],
    expect: "cli-success",
  },
  {
    name: "Model Generator - Server model",
    args: ["g-next:model", "--modelName", "Product", "--location", "server"],
    expect: "cli-success",
  },
  {
    name: "Model Generator - Invalid location",
    args: ["g-next:model", "--modelName", "User", "--location", "invalid"],
    expect: "validation",
  },
  {
    name: "Page Generator - Basic page",
    args: [
      "g-next:page",
      "--pageName",
      "home",
      "--componentName",
      "HomePage",
      "--renderingStrategy",
      "none",
    ],
    expect: "cli-success",
  },
  {
    name: "Page Generator - Dynamic page",
    args: [
      "g-next:page",
      "--pageName",
      "[userId]",
      "--componentName",
      "UserDetail",
      "--renderingStrategy",
      "Server-side Rendering Props (SSR)",
      "--useCookieAuth",
      "--cookieRole",
      "user",
    ],
    expect: "cli-success",
  },
  {
    name: "Page Generator - Invalid rendering strategy",
    args: [
      "g-next:page",
      "--pageName",
      "home",
      "--componentName",
      "HomePage",
      "--renderingStrategy",
      "invalid",
    ],
    expect: "validation",
  },
  {
    name: "Task Generator - Basic task",
    args: ["g-next:task", "--taskName", "SendEmails"],
    expect: "cli-success",
  },
  {
    name: "Task Generator - Invalid name",
    args: ["g-next:task", "--taskName", "123Invalid"],
    expect: "validation",
  },
];

console.log("🧪 Testing All Generators CLI functionality...");
const yoInfo = resolveYo(repoRoot);
console.log(`📁 Working directory: ${yoInfo.cwd}`);
console.log(`📌 Yeoman CLI: ${yoInfo.label}\n`);

function runTest(testCase) {
  return new Promise((resolve) => {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`   Command: yo ${testCase.args.join(" ")}`);
    console.log(`   Expected: ${testCase.expect}`);

    const child = spawnYo(repoRoot, testCase.args, { stdio: "pipe" });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    let settled = false;
    const finish = (code) => {
      if (settled) return;
      settled = true;
      console.log(`   Exit code: ${code}`);
      const ok = cliTestPassed({
        code,
        stdout,
        stderr,
        expect: testCase.expect,
      });
      if (ok) {
        console.log("   ✅ Passed");
      } else {
        console.log("   ❌ Failed");
        if (stdout) console.log(`   stdout (trim): ${stdout.slice(0, 400)}`);
        if (stderr) console.log(`   stderr (trim): ${stderr.slice(0, 400)}`);
      }
      resolve(ok);
    };

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      console.log("   ⏰ Test timed out");
      finish(-1);
    }, 15000);

    child.on("close", (code) => {
      clearTimeout(timer);
      finish(code);
    });
  });
}

async function main() {
  const yoAvailable = await new Promise((resolve) => {
    const c = spawnYo(repoRoot, ["--version"], { stdio: "pipe" });
    c.on("error", () => resolve(false));
    c.on("close", (code) => resolve(code === 0));
  });

  if (!yoAvailable) {
    console.log("❌ Yeoman (yo) is not available. Install test-project deps or global yo:");
    console.log("   npm install --prefix test-project");
    process.exit(1);
  }

  let failed = 0;
  for (const tc of testCases) {
    const ok = await runTest(tc);
    if (!ok) failed++;
  }

  console.log("\n🎉 All generator CLI tests finished.");
  console.log(`\n📊 Failed: ${failed} / ${testCases.length}`);

  if (failed > 0) {
    process.exit(1);
  }
  console.log("\n✅ All generator CLI tests passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
