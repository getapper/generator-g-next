module.exports = (
  apiNameCapital,
  urlParams,
  projectName
) => `
require("custom-env").env("local");
require("custom-env");

import {
  EventBridge,
  CreateConnectionRequest,
  CreateApiDestinationCommandInput,
  PutRuleCommandInput,
  PutTargetsCommandInput,
  RuleState,
} from "@aws-sdk/client-eventbridge";

import {
  CreateScheduleCommandInput,
  Scheduler,
} from "@aws-sdk/client-scheduler";

const exec = async () => {
  const AWSConfig = {
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID_AWS_BACKEND,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS_BACKEND,
    },
    region: process.env.REGION_AWS_BACKEND,
  };
  const APIDestinationRoleArn =
    "non lo sappiamo";
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
  const SchedulerRoleArn =
    "non lo sappiamo";
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

  const createConnectionResponse = await eventBridge.createConnection(
    createConnectionParams
  );

  // Crea l'endpoint e specifica quale connessione utilizzare
  const createApiDestinationParams: CreateApiDestinationCommandInput = {
    ConnectionArn: createConnectionResponse.ConnectionArn,
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
        RoleArn: APIDestinationRoleArn,
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
      RoleArn: SchedulerRoleArn,
      Arn: "arn:aws:events:eu-west-1:718483217265:event-bus/default",
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
