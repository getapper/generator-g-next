module.exports = (
  endpointFolderName,
  apiName
) => `import { SuccessResponse } from "endpoints/${endpointFolderName}/interfaces";
import { StatusCodes, TestHandler } from "lib/response-handler";

const ${apiName}Path = "${endpointFolderName}";

beforeAll(async () => {
  // await cleanDb();
});

describe("${apiName} API", () => {
  test("It should ...", async () => {
    // const { statusCode } = await TestHandler.invokeLambda(${apiName}Path);

    // expect(statusCode).toBe(StatusCodes.OK);
  });
});

afterAll(async () => {
  // await closeDbConnection();
});
`;
