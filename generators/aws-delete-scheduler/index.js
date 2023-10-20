const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");

const {
  Scheduler,
  DeleteScheduleCommand,
} = require("@aws-sdk/client-scheduler");
const {
  EventBridgeClient,
  DeleteRuleCommand,
  DeleteApiDestinationCommand,
  RemoveTargetsCommand,
} = require("@aws-sdk/client-eventbridge");

module.exports = class extends Generator {
  async prompting() {
    requirePackages(this, ["core"]);

    const { AWS } = this.readDestinationJSON(".genyg.ignore.json");
    if (!AWS?.accessKeyId || !AWS?.secretAccessKey || !AWS?.region) {
      this.log(
        yosay(
          chalk.red(
            "Please specify your AWS credentials and region in the .genyg.ignore.json file!",
          ),
        ),
      );
      process.exit(0);
      return;
    }
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };
    const schedulerClient = new Scheduler(AWSConfig);
    const input = {};
    const configFile = this.readDestinationJSON("package.json");
    const schedulesList = (
      await schedulerClient.listSchedules(input)
    ).Schedules.map((schedule) => schedule.Name).filter((value) => {
      return value.indexOf("genyg-" + configFile.name) === 0;
    });

    if (schedulesList.length === 0) {
      this.log(yosay(chalk.red("No schedulers found! Please create one!")));
      process.exit(1);
      return;
    }
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)",
        )} AWS scheduler deleter, follow the quick and easy configuration to delete an AWS scheduler!`,
      ),
    );
    let answers = await this.prompt([
      {
        type: "list",
        name: "scheduleName",
        message: "Please select a schedule that you want to delete",
        choices: schedulesList,
      },
    ]);
    this.answers = answers;
  }

  async writing() {
    const { scheduleName } = this.answers;
    const { AWS } = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: AWS.accessKeyId,
        secretAccessKey: AWS.secretAccessKey,
      },
      region: AWS.region,
    };
    const schedulerClient = new Scheduler(AWSConfig);
    const eventBridgeClient = new EventBridgeClient(AWSConfig);

    const deleteScheduleCommandInput = {
      Name: scheduleName,
    };
    const deleteScheduleCommand = new DeleteScheduleCommand(
      deleteScheduleCommandInput,
    );

    const apiDestinationName = scheduleName.replace("-schedule-", "-");
    const ruleName = scheduleName.replace("schedule", "trigger");
    const targetName = apiDestinationName + "-target";

    const removeRuleCommandInput = {
      Name: ruleName,
    };

    const ApiDestinationDeleteCommandInput = {
      Name: apiDestinationName,
    };
    const apiDestinationDeleteCommand = new DeleteApiDestinationCommand(
      ApiDestinationDeleteCommandInput,
    );
    const ruleDeleteCommand = new DeleteRuleCommand(removeRuleCommandInput);
    const targetRemoveCommandInput = {
      Rule: ruleName,
      Ids: [targetName],
    };
    const targetRemoveCommand = new RemoveTargetsCommand(
      targetRemoveCommandInput,
    );

    try {
      const responseTarget = await eventBridgeClient.send(targetRemoveCommand);
      const responseApiDestination = await eventBridgeClient.send(
        apiDestinationDeleteCommand,
      );
      const responseRule = await eventBridgeClient.send(ruleDeleteCommand);
      const responseScheduler = await schedulerClient.send(
        deleteScheduleCommand,
      );
    } catch (error) {
      console.log(error);
    }
  }
};
