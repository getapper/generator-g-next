"use strict";

const fs = require("fs");
const path = require("path");
const yeoman = require("yeoman-environment");

const repoRoot = path.resolve(__dirname, "..");
const generatorsRoot = path.join(repoRoot, "generators");

const namespace = process.argv[2];
const rawOptions = process.argv[3] ?? "{}";
const rawPromptAnswers = process.argv[4] ?? "{}";

const options = JSON.parse(rawOptions);
const promptAnswers = JSON.parse(rawPromptAnswers);

const toPromptAnswer = (question) => {
  if (Object.prototype.hasOwnProperty.call(promptAnswers, question.name)) {
    return promptAnswers[question.name];
  }

  if (question.default !== undefined) {
    return question.default;
  }

  if (question.type === "confirm") {
    return true;
  }

  if (question.type === "list") {
    const [firstChoice] = question.choices ?? [];
    if (typeof firstChoice === "string") {
      return firstChoice;
    }
    if (firstChoice && typeof firstChoice === "object") {
      return firstChoice.value ?? firstChoice.name;
    }
  }

  if (question.type === "directory") {
    return "";
  }

  return "";
};

const resolvePromptAnswers = async (questions) => {
  const answers = {};

  for (const question of questions) {
    answers[question.name] = toPromptAnswer(question);
  }

  return answers;
};

const registerLocalGenerators = (env) => {
  const generatorNames = fs
    .readdirSync(generatorsRoot)
    .filter((entry) =>
      fs.existsSync(path.join(generatorsRoot, entry, "index.js")),
    );

  for (const generatorName of generatorNames) {
    env.register(
      path.join(generatorsRoot, generatorName),
      `g-next:${generatorName}`,
    );
  }
};

const run = async () => {
  if (!namespace) {
    throw new Error("Missing generator namespace");
  }

  const env = yeoman.createEnv();
  const originalPrompt = env.adapter.prompt.bind(env.adapter);
  env.adapter.prompt = (questions, answers) => {
    if (!questions?.length) {
      return originalPrompt(questions, answers);
    }
    return resolvePromptAnswers(questions);
  };

  registerLocalGenerators(env);

  await env.run(namespace, options);
};

run()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error) => {
    console.error(error?.stack ?? error?.message ?? error);
    process.exitCode = typeof error?.code === "number" ? error.code : 1;
  });
