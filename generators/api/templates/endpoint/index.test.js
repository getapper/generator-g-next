module.exports = (
  endpointFolderName,
  apiName,
  apiNameCapital
) => `import { ${apiNameCapital}Api } from "endpoints/${endpointFolderName}/interfaces";
import { StatusCodes, TestHandler } from "lib/response-handler";

const ${apiName}Path = "${endpointFolderName}";

beforeAll(async () => {
  // await cleanDb();
});

describe("${apiName} API", () => {
  test("It should ...", async () => {
    // const { statusCode, payload } = await TestHandler.invokeLambda<${apiNameCapital}Api.SuccessResponse>(${apiName}Path);

    // expect(statusCode).toBe(StatusCodes.OK);
  });
});

afterAll(async () => {
  // await closeDbConnection();
});
`;
