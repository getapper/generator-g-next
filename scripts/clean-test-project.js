#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "test-project", "src");
if (fs.existsSync(src)) {
  fs.rmSync(src, { recursive: true, force: true });
}
