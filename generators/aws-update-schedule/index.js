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
    const schedulesList=(await (scheduler.listSchedules(input))).Schedules.map((schedule)=>schedule.Name).filter((value)=>{
      return value.indexOf('genyg-'+configFile.name) === 0;
    });
    if(schedulesList.length===0){
      this.log(yosay(chalk.red("No schedulers found! Please create one!")))
      process.exit(1);
      return
    }
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler updater, follow the quick and easy configuration to update an AWS scheduler!`
      )
    );

    let answers={} ;
    let schedule=await this.prompt([
      {
        type:"list",
        name: "schedule",
        message: "Please select a schedule that ypu want to update",
        choices: schedulesList,
      },]);
    answers.schedule=schedule.schedule;
      let editStatus=await this.prompt([
        {
        type: "list",
        name: "editStatus",
        message: "Do you want to edit status?",
        choices: ["YES" , "NO"],
        default: "YES"
      }]);
      answers.editStatus=editStatus.editStatus;
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

      let editInvocationRate=await this.prompt([
        {
          type: "list",
          name: "editInvocationRate",
          message: "Do you want to edit invocation rate?",
          choices: ["YES" , "NO"],
          default: "YES"
        },
      ]);
    answers.editInvocationRate=editInvocationRate.editInvocationRate;

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

    let editInvocationEndpoint=await this.prompt([
      {
        type: "list",
        name: "editInvocationEndpoint",
        message: "Do you want to edit endpoint?",
        choices: ["YES" , "NO"],
        default: "YES"
      },
    ])
    answers.editInvocationEndpoint=editInvocationEndpoint.editInvocationEndpoint;
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
    if(responseSchedule.Name!==schedule || !responseSchedule){
      this.log(yosay(chalk.red("Schedule not found!")))
      process.exit(1);
      return
    }

    const listApiDestinationCommand=new ListApiDestinationsCommand({});
    const responseListApiDestination=(await eventbridgeClient.send(listApiDestinationCommand)).ApiDestinations.filter((ad)=>ad.Name===responseSchedule.Name.replace("-schedule-","-"))[0];
    if(!responseListApiDestination){
      this.log(yosay(chalk.red("Api destination not found!")))
      process.exit(1);
      return
    }
    const State= status ?? responseSchedule?.State;
    const scheduleExpression=[];
    responseSchedule.ScheduleExpression.replace("(" , " ")
      .replace(")"," ").split(" ").map((value, index)=> {if(index===1 || index===2){scheduleExpression.push(value)}});
    const [amount,timeUnit]=invocationRate?.split(" ") ?? [scheduleExpression[0],scheduleExpression[1]];


    if(!(timeUnit==="minutes" || timeUnit==="hours" || timeUnit==="days")){
      this.log(yosay(chalk.red("Please insert a correct schedule expression!")))
      process.exit(1);
      return
    }
    if(editStatus==="YES" && State===responseSchedule.State){
      this.log(yosay(chalk.red("No status changes detected!")))
      process.exit(1);
      return
    }
    if(editInvocationRate==="YES" && amount===scheduleExpression[0] && timeUnit===scheduleExpression[1]){
      this.log(yosay(chalk.red("No invocation rate changes detected!")))
      process.exit(1);
      return
    }
    const endpointURL=invocationEndpoint ?? responseListApiDestination.InvocationEndpoint

    if(editInvocationEndpoint==="YES" && endpointURL===responseListApiDestination.InvocationEndpoint){
      this.log(yosay(chalk.red("No endpoint url changes detected!")))
      process.exit(1);
      return
    }

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
