"use strict";

/**
 * Registers `inquirer-directory` for generators that use `type: "directory"` prompts.
 * yeoman-environment ≤3: `env.adapter.promptModule`
 * yo 5+ / yeoman-environment 4+ (`QueuedAdapter`): `promptModule` lives on `actualAdapter`.
 */
function registerInquirerDirectoryPrompt(generator) {
  const adapter = generator.env && generator.env.adapter;
  if (!adapter) {
    return;
  }
  const promptModule =
    adapter.promptModule ||
    (adapter.actualAdapter && adapter.actualAdapter.promptModule);
  if (promptModule && typeof promptModule.registerPrompt === "function") {
    promptModule.registerPrompt("directory", require("inquirer-directory"));
  }
}

module.exports = { registerInquirerDirectoryPrompt };
