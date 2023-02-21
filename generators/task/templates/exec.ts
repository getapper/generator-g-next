require("custom-env").env("local");
require("custom-env");
import { <%= taskFunctionName %> } from "@/tasks/<%= taskFolder %>";
<% if (isMongoInstalled) { %>// import mongoDao from "@/lib/mongodb/mongo-dao";
<% } %>
(async () => {
  try {
    await <%= taskFunctionName %>();
    console.log("DONE!");
  } catch (error) {
    console.error(error);
  } finally {
    <% if (isMongoInstalled) { %>// mongoDao.mongoClient?.close();
    <% } %>process.exit(0);
  }
})();
