module.exports = urlParams => `import { YupShapeByInterface } from "lib/response-handler";
import * as yup from "yup";
import { QueryStringParameters } from "./interfaces";

const queryStringParametersValidations =
  (): YupShapeByInterface<QueryStringParameters> => ({${
    urlParams
      ? urlParams.map(p => `\n    ${p}: yup.string().required(),`).join("\n") +
        "\n"
      : ""
  }  });

export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()),
});
`;
