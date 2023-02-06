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
  const iamClient = new IAMClient(AWSConfig);
  ${
  customDestination
    ? `
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
    const APIDestinationRoleParams: GetRoleCommandInput = {RoleName:${destinationRole}}
    const APIDestinationRoleResponse = await iamClient.getRole(APIDestinationRoleParams);`
}

    // Questo qua sopra o lo otteniamo dai parametri passati (se utente a scelto destinationRole preesistente) o ne creiamo uno nuovo
    // dandogli il nome inserito dall'utente
  /*
   Any role with following policy
   {
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
   }
   * */
   ${
  customScheduler
    ? `
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
    : `const schedulerRoleParams: GetRoleCommandInput = {RoleName:${schedulerRole}}
    const SchedulerRoleResponse = await iamClient.getRole(schedulerRoleParams);`
}


    // Questo qua sopra o lo otteniamo dai parametri passati (se utente a scelto schedulerRole preesistente) o ne creiamo uno nuovo
    // dandogli il nome inserito dall'utente
  /*
  Any role with following policy
   {
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
   }
  * */

  // Crea una nuova istanza di EventBridge e Scheduler
  const eventBridge = new EventBridge(AWSConfig);
  const scheduler = new Scheduler(AWSConfig);

  ${
  customConnection
    ? `
    // Creaa una connessione che invierà le richieste autenticate
    const createConnectionParams: CreateConnectionRequest = {
    AuthorizationType: "API_KEY",
    AuthParameters: {
      ApiKeyAuthParameters: {
        ApiKeyName: "genyg-${projectName}-API-Connection-Key",
        ApiKeyValue: "EbPa9**e34Hb83@D@GNiZ2CF",
      },
    },
    Name: "genyg-${projectName}-API-Connection",
  };

  const connectionResponse = await eventBridge.createConnection(
    createConnectionParams);
    `
    : `const describeConnectionParams: DescribeConnectionCommandInput = {${connection}};
       const connectionResponse = await eventBridge.describeConnection(describeConnectionParams)`
}

  // Crea l'endpoint e specifica quale connessione utilizzare
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

  // Crea regola (un listener) che verrà attivato quando viene inviato un evento con source: Novacoop-POST-storesUpdate
  const putRuleParams: PutRuleCommandInput = {
    Name: "genyg-${projectName}-trigger-${urlParams}-${apiNameCapital}",
    EventPattern: JSON.stringify({
      source: ["genyg-${projectName}-${urlParams}-${apiNameCapital}"],
    }),
  };

  const putRuleResponse = await eventBridge.putRule(putRuleParams);

  // Crea un target che verrà invocato quando viene attivata la regola di prima
  // Il march tra regola e target avviene tramite nome della regola
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

  // Crea un nuovo schedule che verrà attivato ogni minuto
  // Al momento dell'attivazione verrà inviato un evento sul bus di default con source: Novacoop-POST-storesUpdate
  // Lo status iniziale è disabilitato e i dettagli sono vuoti
  const createScheduleParams: CreateScheduleCommandInput = {
    Name: "genyg-${projectName}-schedule-${urlParams}-${apiNameCapital}",
    ScheduleExpression: "rate(1 minute)",
    State: RuleState.DISABLED,
    Target: {
      RoleArn: SchedulerRoleResponse.Arn,
      Arn: "arn:aws:events:eu-west-1:718483217265:event-bus/default", //cambia questo ARN!!!
      EventBridgeParameters: {
        Source: "Novacoop-POST-storesUpdate",
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
