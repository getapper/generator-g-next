"use strict";

/** @typedef {'cli-success' | 'validation'} CliTestExpectation */

function hasCliNonInteractiveBanner(stdout, stderr) {
  let c = `${stdout}\n${stderr}`.replace(/\u001b\[[0-9;]*m/g, "");
  // yosay wraps text across balloon lines; box chars break contiguous phrases
  c = c.replace(/[│╭╮╯╰─`´.\\/]+/g, " ");
  c = c.replace(/\s+/g, " ");
  return (
    (c.includes("Using CLI options for") &&
      c.includes("non-interactive") &&
      c.includes("generation")) ||
    (c.includes("Using CLI") &&
      c.includes("options for") &&
      c.includes("non-interactive") &&
      c.includes("generation"))
  );
}

function hasValidationSignals(stdout, stderr) {
  const c = `${stdout}\n${stderr}`.replace(/\u001b\[[0-9;]*m/g, "");
  return (
    c.includes("Validation errors found:") ||
    c.includes("must be one of:") ||
    c.includes("must start with a letter") ||
    c.includes("contains invalid characters") ||
    c.includes("is required") ||
    c.includes("HTTP method must be one of:") ||
    c.includes("Cookie role is required when using cookie authentication") ||
    c.includes("Route path contains invalid characters") ||
    c.includes("Parameter name cannot be empty") ||
    c.includes("Route path cannot be empty") ||
    c.includes("Please fix the errors and try again.")
  );
}

/**
 * @param {{ code: number, stdout: string, stderr: string, expect: CliTestExpectation }} p
 */
function cliTestPassed(p) {
  if (p.expect === "cli-success") {
    return (
      p.code === 0 &&
      hasCliNonInteractiveBanner(p.stdout, p.stderr)
    );
  }
  if (p.expect === "validation") {
    return p.code !== 0 && hasValidationSignals(p.stdout, p.stderr);
  }
  return false;
}

module.exports = {
  hasCliNonInteractiveBanner,
  hasValidationSignals,
  cliTestPassed,
};

