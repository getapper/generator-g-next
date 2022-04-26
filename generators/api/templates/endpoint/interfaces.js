module.exports = urlParams => `import { ErrorResponse, RequestI } from "lib/response-handler";

export type QueryStringParameters = {${
  urlParams ? urlParams.map(p => `\n  ${p}: string,`).join("\n") + "\n" : ""
}};

export type EndpointResponse = {} | ErrorResponse;

export interface Request extends RequestI<QueryStringParameters, null> {}
`;
