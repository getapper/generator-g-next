module.exports = (apiNameCapital, useCookieAuth, cookieRoleCamelCase, hasPayload, httpMethod, routePath) => {
  const isPatch = httpMethod === "patch";
  
  return `import {
  ErrorResponse,
  ResponseHandler,
  StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse${useCookieAuth ? ", NextApiRequest" : ""} } from "next";
import { ${apiNameCapital}Api } from "./interfaces";
import { logger } from "@/lib/logger";
${isPatch ? `import { ObjectId } from "mongodb";
import mongoDao from "@/lib/mongodb/mongo-dao";
import { JsUtility } from "@/models/common/JsUtility";` : ""}

export default async function handler(
  req: ${apiNameCapital}Api.Request,
  res: NextApiResponse<${apiNameCapital}Api.EndpointResponse>,
${useCookieAuth ? '  originalReq: NextApiRequest,\n' : ''}) {
  const handlerLogger = logger.child({ 
    method: "${httpMethod.toUpperCase()}", 
    route: ${routePath},
    context: "api-handler"
  });
  
  try {
    const { validationResult${useCookieAuth ? ', queryStringParameters' : ''}${hasPayload ? ', payload' : ''} } = req;

    ${useCookieAuth ? `if(!originalReq.session.${cookieRoleCamelCase}){
      handlerLogger.warn("Unauthorized access attempt");
      return ResponseHandler.json<ErrorResponse>(
        res,
        {},
        StatusCodes.Unauthorized,
      );
    }` : ``}

    if (!validationResult.isValid) {
      handlerLogger.warn({
        validationMessage: validationResult.message,
      }, "Request validation failed");
      return ResponseHandler.json<ErrorResponse>(
        res,
        { message: validationResult.message! },
        StatusCodes.BadRequest
      );
    }

${isPatch ? `    // Process JSON Patch operations
    // TODO: Replace 'Entity' with your actual model class name
    // TODO: Replace 'entityId' with your actual ID parameter name from queryStringParameters
    // TODO: Implement the JSON Patch operations logic based on your entity structure
    
    if (payload && payload.operations) {
      handlerLogger.info({
        operationsCount: payload.operations.length,
      }, "Processing JSON Patch operations");
      
      // Example structure - customize based on your needs:
      // const entityId = queryStringParameters.entityId;
      // const entity = await Entity.getById(entityId);
      // if (!entity) {
      //   return ResponseHandler.json<ErrorResponse>(
      //     res,
      //     { message: "Entity not found" },
      //     StatusCodes.NotFound,
      //   );
      // }
      
      // Build MongoDB update operations
      const $set: Record<string, any> = {};
      const $unset: Record<string, any> = {};
      
      for (const op of payload.operations) {
        const path = op.path.replace(/^\\//, "");
        const mongoPath = path.replace(/\\//g, ".");
        
        switch (op.op) {
          case "replace":
          case "add":
            $set[mongoPath] = op.value;
            break;
          case "remove":
            $unset[mongoPath] = 1;
            break;
          case "move":
            if (op.from) {
              const fromPath = op.from.replace(/^\\//, "");
              const fromValue = JsUtility.getNestedValue(entity, fromPath);
              const mongoFromPath = fromPath.replace(/\\//g, ".");
              $set[mongoPath] = fromValue;
              $unset[mongoFromPath] = 1;
            }
            break;
          case "copy":
            if (op.from) {
              const fromPath = op.from.replace(/^\\//, "");
              const fromValue = JsUtility.getNestedValue(entity, fromPath);
              $set[mongoPath] = fromValue;
            }
            break;
          case "test":
            const currentValue = JsUtility.getNestedValue(entity, path);
            if (JSON.stringify(currentValue) !== JSON.stringify(op.value)) {
              return ResponseHandler.json<ErrorResponse>(
                res,
                {
                  message: \`Test operation failed: expected \${JSON.stringify(
                    op.value,
                  )}, got \${JSON.stringify(currentValue)}\`,
                },
                StatusCodes.BadRequest,
              );
            }
            break;
        }
      }
      
      // Apply MongoDB update
      // const update: any = {};
      // if (Object.keys($set).length) update.$set = $set;
      // if (Object.keys($unset).length) update.$unset = $unset;
      // 
      // if (Object.keys(update).length > 0) {
      //   await mongoDao.updateOne(
      //     Entity.collectionName,
      //     { _id: new ObjectId(entityId) },
      //     update,
      //   );
      //   await entity.refresh();
      // }
    }` : ""}

    return ResponseHandler.json<${apiNameCapital}Api.SuccessResponse>(res, {});
  } catch (e: any) {
    handlerLogger.error({
      error: e.message,
      stack: e.stack,
    }, "Internal server error");
    return ResponseHandler.json<ErrorResponse>(
      res,
      { message: "Internal error" },
      StatusCodes.InternalServerError
    );
  }
}
`;
};