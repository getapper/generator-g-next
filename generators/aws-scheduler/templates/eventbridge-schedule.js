module.exports = (
  apiNameCapital,
  urlParams,
  projectName,
  destinationRole,
  customDestination,
  schedulerRole,
  customScheduler,
  connection,
  customConnection,
) => `
require("custom-env").env("local");
require("custom-env");

import {
  EventBridge,
  CreateConnectionRequest,
  DescribeConnectionCommandInput,
  CreateApiDestinationCommandInput,
  PutRuleCommandInput,
  PutTargetsCommandInput,
  RuleState,
} from "@aws-sdk/client-eventbridge";

import {
  CreateScheduleCommandInput,
  Scheduler,
} from "@aws-sdk/client-scheduler";

import {
  IAMClient,
  GetRoleCommandInput,
  CreateRoleCommandInput,
} from "@aws-sdk/client-iam";

const exec = async () => {
  const AWSConfig = {
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID_AWS_BACKEND,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS_BACKEND,
    },
    region: process.env.REGION_AWS_BACKEND,
  };

  // Create a new IamClient instance
  const iamClient = new IAMClient(AWSConfig);
  ${
  customDestination
    ? `
    // Create a new API destination role
    const APIDestinationRoleParams: CreateRoleCommandInput = {
    AssumeRolePolicyDocument: "{
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "events.amazonaws.com"
          },
         "Action": "sts:AssumeRole"
       }
     ]
   }"
    RoleName: "genyg-${projectName}-API-destination-role"}
    const APIDestinationRoleResponse = await iamClient.createRole(APIDestinationRoleParams);
    `
    : `
    // Return the information of the chosen API destination role
    const APIDestinationRoleParams: GetRoleCommandInput = {RoleName:${destinationRole}}
    const APIDestinationRoleResponse = await iamClient.getRole(APIDestinationRoleParams);`
}

   ${
  customScheduler
    ? `
    // Create a new scheduler role
    const schedulerRoleParams: CreateRoleCommandInput = {
    AssumeRolePolicyDocument: "{
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "scheduler.amazonaws.com"
          },
         "Action": "sts:AssumeRole"
       }
     ]
   }"
    RoleName: "genyg-${projectName}-scheduler-role"}
    const SchedulerRoleResponse = await iamClient.createRole(schedulerRoleParams);
    `
    : `
    // Return the information of the chosen scheduler role
    const schedulerRoleParams: GetRoleCommandInput = {RoleName:${schedulerRole}}
    const schedulerRoleResponse = await iamClient.getRole(schedulerRoleParams);`
}

  // Create a new EventBridge and Scheduler instance
  const eventBridge = new EventBridge(AWSConfig);
  const scheduler = new Scheduler(AWSConfig);

  ${
  customConnection
    ? `
    // Create a connection which will send the authenticate requests
    const createConnectionParams: CreateConnectionRequest = {
    AuthorizationType: "API_KEY",
    AuthParameters: {
      ApiKeyAuthParameters: {
        ApiKeyName: "genyg-${projectName}-API-Connection-Key",
        ApiKeyValue: "EbPa9**e34Hb83@D@GNiZ2CF",  // you can randomize its value
      },
    },
    Name: "genyg-${projectName}-API-Connection",
  };

  const connectionResponse = await eventBridge.createConnection(
    createConnectionParams);
    `
    : `
    // Take the information of the chosen connection
    const describeConnectionParams: DescribeConnectionCommandInput = {${connection}};
    const connectionResponse = await eventBridge.describeConnection(describeConnectionParams)`
}

  // Create the endpoint and specify which connection use
  const createApiDestinationParams: CreateApiDestinationCommandInput = {
    ConnectionArn: connectionResponse.ConnectionArn,
    HttpMethod: ${urlParams},
    InvocationEndpoint:
      "insert the https:// endpoint here",
    Name: "genyg-${projectName}-${urlParams}-${apiNameCapital}",
    InvocationRateLimitPerSecond: 100,
  };

  const createApiDestinationResponse = await eventBridge.createApiDestination(
    createApiDestinationParams
  );

  // Create a rule (a listener) which will be activated when an event with thi source: genyg-${projectName}-${urlParams}-${apiNameCapital} will be sent
  const putRuleParams: PutRuleCommandInput = {
    Name: "genyg-${projectName}-trigger-${urlParams}-${apiNameCapital}",
    EventPattern: JSON.stringify({
      source: ["genyg-${projectName}-${urlParams}-${apiNameCapital}"],
    }),
  };

  const putRuleResponse = await eventBridge.putRule(putRuleParams);

  // Create a  target which will be invoked when the above rule is activated
  // The march between rule and target takes place through the rule's name
  const putTargetParams: PutTargetsCommandInput = {
    Rule: putRuleParams.Name,
    Targets: [
      {
        Id: "genyg-${projectName}-${urlParams}-${apiNameCapital}-target",
        Arn: createApiDestinationResponse.ApiDestinationArn,
        RoleArn: APIDestinationRoleResponse.Arn,
      },
    ],
  };

  const putTargetResponse = await eventBridge.putTargets(putTargetParams);

  // Create a new schedule which will be activated every minute
  // At the activation moment a default bus whit source: genyg-${projectName}-${urlParams}-${apiNameCapital} will be sent
  // The initial status is disabled and details are empty
  const createScheduleParams: CreateScheduleCommandInput = {
    Name: "genyg-${projectName}-schedule-${urlParams}-${apiNameCapital}",
    ScheduleExpression: "rate(1 minute)",
    State: RuleState.DISABLED,
    Target: {
      RoleArn: schedulerRoleResponse.Arn,
      Arn: "arn:aws:events:eu-west-1:718483217265:event-bus/default", //cambia questo ARN!!!
      EventBridgeParameters: {
        Source: "genyg-${projectName}-${urlParams}-${apiNameCapital}",
        DetailType: JSON.stringify({}),
      },
    },
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
  };

  const createScheduleResponse = await scheduler.createSchedule(
    createScheduleParams
  );

  console.log({ createScheduleResponse });
};

exec()
  .then(() => {
    console.log("DONE!");
  })
  .catch(console.error)
  .finally(() => {
    // mongoDao.mongoClient?.close();
    process.exit(0);
  });

export {};

`;
