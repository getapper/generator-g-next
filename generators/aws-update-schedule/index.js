const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");

const {ListApiDestinationsCommand, EventBridgeClient, UpdateApiDestinationCommand} = require("@aws-sdk/client-eventbridge");
const { Scheduler, GetScheduleCommand, SchedulerClient, UpdateScheduleCommand} = require("@aws-sdk/client-scheduler");

module.exports = class extends Generator {
  async prompting() {

    requirePackages(this, ["core"]);

    const credentialAccess = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };
    const scheduler = new Scheduler(AWSConfig);
    const input={};
    const configFile = this.readDestinationJSON("package.json");
    const projectName = configFile.name.split("-")[0];
    const schedulesList=(await (scheduler.listSchedules(input))).Schedules.map((schedule)=>schedule.Name).filter((value)=>{
      if(value.split("-")[1]===projectName){
        return true;
      }
      return false;
    });

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler updater, follow the quick and easy configuration to update an AWS scheduler!`
      )
    );

    let answers = await this.prompt([
      {
        type:"list",
        name: "schedule",
        message: "Please select a schedule that ypu want to update",
        choices: schedulesList,
      },
      {
        type: "list",
        name: "editStatus",
        message: "Do you want to edit status?",
        choices: ["YES" , "NO"],
        default: "YES"
      },
      {
        type: "list",
        name: "editInvocationRate",
        message: "Do you want to edit invocation rate?",
        choices: ["YES" , "NO"],
        default: "YES"
      },
      {
        type: "list",
        name: "editInvocationEndpoint",
        message: "Do you want to edit endpoint?",
        choices: ["YES" , "NO"],
        default: "YES"
      },
    ]);

    if(answers.editStatus==="YES"){
      let status= await this.prompt(
        [
          {
            type: "list",
            name: "status",
            choices:["ENABLED","DISABLED"]
          }
        ]
      )
      answers.status=status.status;
    }
    if(answers.editInvocationRate==="YES"){
      let invocationRate= await this.prompt([
        {
          type: "input",
          name: "invocationRate",
          message: "What is your scheduler invocation rate? (1 minutes)",
        },
      ])
      answers.invocationRate=invocationRate.invocationRate
    }

    if(answers.editInvocationEndpoint==="YES"){
      let invocationEndpoint=await this.prompt([
        {
          type: "input",
          name: "invocationEndpoint",
          message: "Insert the endpoint url you want to invoke.",
        },
      ])
      answers.invocationEndpoint=invocationEndpoint.invocationEndpoint
    }
    this.answers = answers;
  }
  async writing() {
    const {
      invocationEndpoint,
      editInvocationEndpoint,
      invocationRate,
      editInvocationRate,
      status,
      editStatus,
      schedule,
    } = this.answers;


   const credentialAccess = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };

    const schedulerClient = new SchedulerClient(AWSConfig);
    const eventbridgeClient=new EventBridgeClient(AWSConfig);

    const scheduleToRetrieve={
      Name:schedule
    }
    const scheduleCommand=new GetScheduleCommand(scheduleToRetrieve);
    const responseSchedule =await schedulerClient.send(scheduleCommand);
    const listApiDestinationCommand=new ListApiDestinationsCommand({});
    const responseListApiDestination=(await eventbridgeClient.send(listApiDestinationCommand)).ApiDestinations.filter((ad)=>ad.Name===responseSchedule.Name.replace("-schedule-","-"))[0];
    const State= status ?? responseSchedule?.Status;
    const scheduleExpression=[];
    responseSchedule.ScheduleExpression.replace("(" , " ")
      .replace(")"," ").split(" ").map((value, index)=> {if(index===1 || index===2){scheduleExpression.push(value)}});
    const [amount,timeUnit]=invocationRate?.split(" ") ?? [scheduleExpression[0],scheduleExpression[1]];

    if(timeUnit!=="minutes" || timeUnit!=="hours" || timeUnit!=="days"){
      this.log(yosay(chalk.red("Please insert a correct schedule expression!")))
      process.exit(1);
      return
    }
    const endpointURL=invocationEndpoint ?? responseListApiDestination.InvocationEndpoint

    try {
      if(editStatus==='YES' || editInvocationRate==='YES') {
        const updateScheduleInput = {
          Name: responseSchedule.Name, // required
          GroupName: responseSchedule.GroupName,
          ScheduleExpression: `rate(${amount} ${timeUnit})`, // required
          StartDate: responseSchedule.StartDate,
          EndDate: responseSchedule.EndDate,
          Description: responseSchedule.Description,
          ScheduleExpressionTimezone: responseSchedule.ScheduleExpressionTimezone,
          State: State,
          KmsKeyArn: responseSchedule.KmsKeyArn,
          Target: responseSchedule.Target,
          FlexibleTimeWindow: responseSchedule.FlexibleTimeWindow,
        }
        const updateScheduleCommand = new UpdateScheduleCommand(updateScheduleInput)
        const responseScheduleUpdate = await schedulerClient.send(updateScheduleCommand);
      }
      if(editInvocationEndpoint==='YES') {
        const updateApiDestinationInput = {
          Name: responseListApiDestination.Name,
          ConnectionArn: responseListApiDestination.ConnectionArn,
          InvocationEndpoint: endpointURL,
          HttpMethod: responseListApiDestination.HttpMethod,
          InvocationRateLimitPerSecond: responseListApiDestination.InvocationRateLimitPerSecond,
        }
        const updateApiDestinationCommand = new UpdateApiDestinationCommand(updateApiDestinationInput);
        const responseApiDestinationUpdate = await eventbridgeClient.send(updateApiDestinationCommand);
      }

    } catch (error) {
      console.log(error);
    }
  }
};
