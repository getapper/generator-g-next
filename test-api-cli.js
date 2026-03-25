#!/usr/bin/env node

/**
 * Test script for API generator CLI functionality
 * Uses yo from test-project/node_modules when present (yo 7.x), else global yo.
 */

const { spawnYo, resolveYo } = require("./scripts/resolve-yo");
const { cliTestPassed } = require("./scripts/cli-test-shared");

const repoRoot = __dirname;

const testCases = [
  {
    name: "Basic GET endpoint",
    args: ["g-next:api", "--route", "users", "--method", "get"],
    expect: "cli-success",
  },
  {
    name: "POST endpoint with dynamic parameter",
    args: ["g-next:api", "--route", "posts/{postId}", "--method", "post"],
    expect: "cli-success",
  },
  {
    name: "PUT endpoint with cookie auth",
    args: [
      "g-next:api",
      "--route",
      "users/{userId}",
      "--method",
      "put",
      "--useCookieAuth",
      "--cookieRole",
      "admin",
    ],
    expect: "cli-success",
  },
  {
    name: "Invalid HTTP method",
    args: ["g-next:api", "--route", "users", "--method", "invalid"],
    expect: "validation",
  },
  {
    name: "Missing cookie role with auth",
    args: ["g-next:api", "--route", "users", "--method", "get", "--useCookieAuth"],
    expect: "validation",
  },
  {
    name: "Invalid route format - empty parameter",
    args: ["g-next:api", "--route", "users/{}", "--method", "get"],
    expect: "validation",
  },
  {
    name: "Invalid route format - invalid parameter name",
    args: ["g-next:api", "--route", "users/{123invalid}", "--method", "get"],
    expect: "validation",
  },
  {
    name: "Invalid route format - special characters",
    args: ["g-next:api", "--route", "users@#$", "--method", "get"],
    expect: "validation",
  },
];

console.log("🧪 Testing API Generator CLI functionality...");
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
    }, 10000);

    child.on("close", (code) => {
      clearTimeout(timer);
      finish(code);
    });
  });
}

async function main() {
  const yoCheck = spawnYo(repoRoot, ["--version"], { stdio: "pipe" });
  const yoAvailable = await new Promise((resolve) => {
    yoCheck.on("error", () => resolve(false));
    yoCheck.on("close", (code) => resolve(code === 0));
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

  console.log("\n🎉 API CLI tests finished.");
  if (failed > 0) {
    console.log(`\n❌ ${failed} test(s) failed.`);
    process.exit(1);
  }
  console.log("\n✅ All API CLI tests passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
