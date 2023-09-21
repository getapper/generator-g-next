const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");

const {
  IAMClient,
  ListRolesCommand,
  CreateRoleCommand,
  GetRoleCommand,
  PutRolePolicyCommand,
} = require("@aws-sdk/client-iam");
const { EventBridge } = require("@aws-sdk/client-eventbridge");
const { Scheduler } = require("@aws-sdk/client-scheduler");
const fs = require("fs");

const schedulerExecutionRoleDocument = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { Service: "scheduler.amazonaws.com" },
      Action: "sts:AssumeRole",
    },
  ],
};

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    // Create a new EventBridge and Scheduler instance
    const credentialAccess = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };

    // Create a new EventBridge instance
    const eventBridge = new EventBridge(AWSConfig);

    let eventBusesList = [];

    // we put the event buses in the eventBusesList array
    const listEventBusesResponse = await eventBridge.listEventBuses({});
    listEventBusesResponse.EventBuses.map((eventBus) => {
      eventBusesList.push(eventBus.Name);
    });

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler role generator, follow the quick and easy configuration to create a new AWS scheduler role!`
      )
    );

    let answers = await this.prompt([
      {
        type: "list",
        name: "eventBus",
        choices: eventBusesList,
        message:
          "Before creating the new role, you must choose an existing event bus.",
      },
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure you want to create a new scheduler role?",
      },
    ]);
    this.answers = answers;
    if (!this.answers.accept) {
      process.exit(0);
    }
  }
  async writing() {
    const { eventBus, accept } = this.answers;

    // Create a new EventBridge and Scheduler instance
    const credentialAccess = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };

    // Create a new EventBridge, IAM and Scheduler instance
    const iamClient = new IAMClient(AWSConfig);
    const eventBridge = new EventBridge(AWSConfig);
    const configFile = this.readDestinationJSON("package.json");
    const projectName = configFile.name;

    await iamClient.send(
      new CreateRoleCommand({
        AssumeRolePolicyDocument: JSON.stringify(
          schedulerExecutionRoleDocument
        ),
        RoleName: `genyg-${projectName}-scheduler-role`,
      })
    );

    const eventBusResponse = await eventBridge.describeEventBus({
      Name: eventBus,
    });
    const schedulerRoleName = `genyg-${projectName}-scheduler-role`;

    const schedulerPolicyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["events:PutEvents"],
          Resource: [eventBusResponse.Arn],
        },
      ],
    };

    await iamClient.send(
      new PutRolePolicyCommand({
        RoleName: schedulerRoleName,
        PolicyDocument: JSON.stringify(schedulerPolicyDocument),
        PolicyName: `genyg_${projectName}_Amazon_EventBridge_Scheduler_Execution_Policy`,
      })
    );
  }
};
