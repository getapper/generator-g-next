module.exports = (
  endpointRoutePath
) => `import { nextApiEndpointHandler } from "@/lib/response-handler";

export default nextApiEndpointHandler("${endpointRoutePath}");
`;
