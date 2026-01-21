require("custom-env").env("local");
require("custom-env");
import { importDatabase } from "@/tasks/import-database";
import { closeDbConnection } from "@/lib/mongodb";

(async () => {
  try {
    await importDatabase();
    console.log("DONE!");
  } catch (error) {
    console.error(error);
  } finally {
    await closeDbConnection();
    process.exit(0);
  }
})();
