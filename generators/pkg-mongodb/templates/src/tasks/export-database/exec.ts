require("custom-env").env("local");
require("custom-env");
import { exportDatabase } from "@/tasks/export-database";
import { closeDbConnection } from "@/lib/mongodb";

(async () => {
  try {
    await exportDatabase();
    console.log("DONE!");
  } catch (error) {
    console.error(error);
  } finally {
    await closeDbConnection();
    process.exit(0);
  }
})();
