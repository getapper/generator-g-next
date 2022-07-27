module.exports = (
  apiNameCapital,
  urlParams
) => `import { YupShapeByInterface } from "lib/response-handler";
import * as yup from "yup";
import { ${apiNameCapital}Api } from "./interfaces";

const queryStringParametersValidations =
  (): YupShapeByInterface<${apiNameCapital}Api.QueryStringParameters> => ({${
  urlParams
    ? urlParams.map((p) => `\n    ${p}: yup.string().required(),`).join("\n") +
      "\n"
    : ""
}  });

export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()),
});
`;
