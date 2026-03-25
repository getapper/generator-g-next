"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

/**
 * Prefer Yeoman CLI from test-project/node_modules (yo 7.x) when installed;
 * otherwise fall back to global `yo`.
 */
function getTestProjectDir(repoRoot) {
  return path.join(repoRoot, "test-project");
}

function localYoBin(testProjectDir) {
  const binDir = path.join(testProjectDir, "node_modules", ".bin");
  const yoUnix = path.join(binDir, "yo");
  const yoWin = path.join(binDir, "yo.cmd");
  if (process.platform === "win32" && fs.existsSync(yoWin)) {
    return { command: yoWin, argsPrefix: [], shell: false };
  }
  if (fs.existsSync(yoUnix)) {
    return { command: yoUnix, argsPrefix: [], shell: false };
  }
  return null;
}

/**
 * @param {string} repoRoot - absolute path to generator-g-next repo root
 * @returns {{ command: string, argsPrefix: string[], shell: boolean, cwd: string, label: string }}
 */
function resolveYo(repoRoot) {
  const testProjectDir = getTestProjectDir(repoRoot);
  const local = localYoBin(testProjectDir);
  if (local) {
    return {
      ...local,
      cwd: testProjectDir,
      label: path.relative(repoRoot, local.command) || local.command,
    };
  }
  return {
    command: "yo",
    argsPrefix: [],
    shell: false,
    cwd: testProjectDir,
    label: "yo (global)",
  };
}

/**
 * @param {import('child_process').SpawnOptions} baseOptions
 */
function spawnYo(repoRoot, yoArgs, baseOptions = {}) {
  const r = resolveYo(repoRoot);
  const cwd = baseOptions.cwd ?? r.cwd;
  const fullArgs = [...r.argsPrefix, ...yoArgs];
  return spawn(r.command, fullArgs, {
    ...baseOptions,
    cwd,
    shell: r.shell,
  });
}

module.exports = {
  getTestProjectDir,
  resolveYo,
  spawnYo,
};
