module.exports = (
  apiNameCapital,
  urlParams,
  hasPayload
) => `import { ErrorResponse, RequestI } from "@/lib/response-handler";

export namespace ${apiNameCapital}Api {
  export type QueryStringParameters = {${
    urlParams
      ? urlParams.map((p) => `\n    ${p}: string,`).join("\n") + "\n  "
      : ""
  }};${
  hasPayload
    ? `

  export type Payload = {};`
    : ""
}

  export type SuccessResponse = {
    message?: string;
  };

  export type EndpointResponse = SuccessResponse | ErrorResponse;

  export interface Request extends RequestI<QueryStringParameters, ${
    hasPayload ? "Payload" : "null"
  }> {}
}
`;
