module.exports = (
  apiNameCapital,
  urlParams,
  hasPayload
) => `import { YupShapeByInterface } from "lib/response-handler";
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
    ? `
const payloadValidations =
  (): YupShapeByInterface<${apiNameCapital}Api.Payload> => ({});
`
    : ""
}
export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()),${
    hasPayload
      ? `
  payload: yup.object().shape(payloadValidations()),`
      : ""
  }
});
`;
