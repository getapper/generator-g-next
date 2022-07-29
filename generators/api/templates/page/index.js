module.exports = (
  endpointRoutePath
) => `import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "lib/response-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    return require(\`endpoints/\${req.method.toLowerCase()}-${endpointRoutePath}\`)?.default(
      req,
      res,
    );
  } catch (e) {
    return res.status(StatusCodes.MethodNotAllowed).json({});
  }
}
`;
