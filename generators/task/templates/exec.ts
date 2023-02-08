require("custom-env").env("local");
require("custom-env");
import { <%= taskFunctionName %> } from "@/tasks/<%= taskFolder %>";

(async () => {
  try {
    await <%= taskFunctionName %>();
    console.log("DONE!");
  } catch (error) {
    console.error(error);
  } finally {
    // mongoDao.mongoClient?.close();
    process.exit(0);
  }
})();
