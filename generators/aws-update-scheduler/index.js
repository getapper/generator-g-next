const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");

const {
  Scheduler,
  GetScheduleCommand,
  SchedulerClient,
  UpdateScheduleCommand,
} = require("@aws-sdk/client-scheduler");

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
        accessKeyId: AWS.accessKeyId,
        secretAccessKey: AWS.secretAccessKey,
      },
      region: AWS.region,
    };
    const schedulerClient = new Scheduler(AWSConfig);
    const configFile = this.readDestinationJSON("package.json");
    const schedulesList = (
      await schedulerClient.listSchedules({})
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
        )} AWS scheduler updater, follow the quick and easy configuration to update an AWS scheduler!`,
      ),
    );

    let answers = {};
    let schedule = await this.prompt([
      {
        type: "list",
        name: "schedule",
        message: "Please select a schedule that you want to update",
        choices: schedulesList,
      },
    ]);
    answers.schedule = schedule.schedule;
    const scheduleToRetrieve = {
      Name: answers.schedule,
    };
    const scheduleCommand = new GetScheduleCommand(scheduleToRetrieve);
    const responseSchedule = await schedulerClient.send(scheduleCommand);

    let editStatus = await this.prompt([
      {
        type: "list",
        name: "editStatus",
        message: `Do you want to edit status? Currently this scheduler is ${responseSchedule.State}`,
        choices: ["YES", "NO"],
        default: "YES",
      },
    ]);
    answers.editStatus = editStatus.editStatus;
    if (answers.editStatus === "YES") {
      let status = await this.prompt([
        {
          type: "list",
          name: "status",
          choices: ["ENABLED", "DISABLED"],
        },
      ]);
      answers.status = status.status;
    }

    let editInvocationRate = await this.prompt([
      {
        type: "list",
        name: "editInvocationRate",
        message: `Do you want to edit invocation rate? For this scheduler the selected invocation rate is  ${responseSchedule.ScheduleExpression}`,
        choices: ["YES", "NO"],
        default: "YES",
      },
    ]);
    answers.editInvocationRate = editInvocationRate.editInvocationRate;

    if (answers.editInvocationRate === "YES") {
      let invocationRate = await this.prompt([
        {
          type: "input",
          name: "invocationRate",
          message: "What is your scheduler invocation rate? (1 minutes)",
        },
      ]);
      answers.invocationRate = invocationRate.invocationRate;
    }

    this.answers = answers;
  }
  async writing() {
    const { invocationRate, editInvocationRate, status, editStatus, schedule } =
      this.answers;

    const { AWS } = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: AWS.accessKeyId,
        secretAccessKey: AWS.secretAccessKey,
      },
      region: AWS.region,
    };

    const schedulerClient = new SchedulerClient(AWSConfig);

    const scheduleToRetrieve = {
      Name: schedule,
    };
    const scheduleCommand = new GetScheduleCommand(scheduleToRetrieve);
    const responseSchedule = await schedulerClient.send(scheduleCommand);
    if (responseSchedule.Name !== schedule || !responseSchedule) {
      this.log(yosay(chalk.red("Schedule not found!")));
      process.exit(1);
      return;
    }

    const State = status ?? responseSchedule?.State;
    const scheduleExpression = [];
    responseSchedule.ScheduleExpression.replace("(", " ")
      .replace(")", " ")
      .split(" ")
      .map((value, index) => {
        if (index === 1 || index === 2) {
          scheduleExpression.push(value);
        }
      });
    const [amount, timeUnit] = invocationRate?.split(" ") ?? [
      scheduleExpression[0],
      scheduleExpression[1],
    ];

    if (
      !(timeUnit === "minutes" || timeUnit === "hours" || timeUnit === "days")
    ) {
      this.log(
        yosay(chalk.red("Please insert a correct schedule expression!")),
      );
      process.exit(1);
      return;
    }

    try {
      if (editStatus === "YES" || editInvocationRate === "YES") {
        const updateScheduleInput = {
          Name: responseSchedule.Name, // required
          GroupName: responseSchedule.GroupName,
          ScheduleExpression: `rate(${amount} ${timeUnit})`, // required
          StartDate: responseSchedule.StartDate,
          EndDate: responseSchedule.EndDate,
          Description: responseSchedule.Description,
          ScheduleExpressionTimezone:
            responseSchedule.ScheduleExpressionTimezone,
          State: State,
          KmsKeyArn: responseSchedule.KmsKeyArn,
          Target: responseSchedule.Target,
          FlexibleTimeWindow: responseSchedule.FlexibleTimeWindow,
        };
        const updateScheduleCommand = new UpdateScheduleCommand(
          updateScheduleInput,
        );
        const responseScheduleUpdate = await schedulerClient.send(
          updateScheduleCommand,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
};
