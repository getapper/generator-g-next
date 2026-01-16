module.exports = (
  apiNameCapital,
  urlParams,
  hasPayload,
  httpMethod
) => {
  const isPatch = httpMethod === "patch";
  
  return `import { YupShapeByInterface${isPatch ? ", JsonPatchOperation, jsonPatchOperationValidation" : ""} } from "@/lib/response-handler";
import * as yup from "yup";
import { ${apiNameCapital}Api } from "./interfaces";

const queryStringParametersValidations =
  (): YupShapeByInterface<${apiNameCapital}Api.QueryStringParameters> => ({${
  urlParams
    ? urlParams.map((p) => `\n    ${p}: yup.string().required(),`).join("\n") +
      "\n"
    : ""
}});
${
  hasPayload
    ? isPatch
      ? `
const payloadValidations = (): YupShapeByInterface<{
  operations: JsonPatchOperation[];
}> => ({
  operations: yup
    .array()
    .of(jsonPatchOperationValidation)
    .min(1, "At least one operation is required")
    .required(),
});`
      : `
const payloadValidations =
  (): YupShapeByInterface<${apiNameCapital}Api.Payload> => ({});
`
    : ""
}
export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()),${
    hasPayload
      ? `
  payload: yup.object().shape(payloadValidations()).noUnknown(),`
      : ""
  }
});
`;
};
