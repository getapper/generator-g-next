import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import mongoDao from "@/lib/mongodb/mongo-dao";
import moment from "moment";
import { EJSON } from "bson";

export const exportDatabase = async () => {
  console.log("Starting database export...");

  // Get environment name from env var
  const envName = process.env.ENV_NAME || "local";
  console.log(`Environment: ${envName}`);

  // Create export directory structure: db-exports/{ENV_NAME}/{YYYY-MM-DD_HH-MM}/
  const timestamp = moment().format("YYYY-MM-DD_HH-mm");
  const exportBaseDir = join(process.cwd(), "db-exports", envName, timestamp);

  console.log(`Creating export directory: ${exportBaseDir}`);
  mkdirSync(exportBaseDir, { recursive: true });

  try {
    // Initialize database connection
    await mongoDao.init();

    if (!mongoDao.db) {
      throw new Error("Database connection failed");
    }

    // Get all collections from database
    console.log("Fetching all collections from database...");
    const collections = await mongoDao.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to export`);

    let totalDocumentsExported = 0;
    const exportResults: Array<{
      collectionName: string;
      documentCount: number;
      filePath: string;
    }> = [];

    // Export each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n--- Exporting collection: ${collectionName} ---`);

      try {
        // Get all documents from collection
        const documents = await mongoDao.db
          .collection(collectionName)
          .find({})
          .toArray();

        const documentCount = documents.length;
        console.log(`Found ${documentCount} documents`);

        // Convert documents to Extended JSON (EJSON) format
        // EJSON preserves MongoDB types (ObjectId, Date, Binary, etc.) so they can be reimported correctly
        // ObjectId will be exported as {"$oid": "..."} format
        // Date will be exported as {"$date": "..."} format
        const ejsonData = EJSON.stringify(documents, null, 2);

        // Save to file: {collectionName}.json
        const fileName = `${collectionName}.json`;
        const filePath = join(exportBaseDir, fileName);
        writeFileSync(filePath, ejsonData, "utf-8");

        totalDocumentsExported += documentCount;
        exportResults.push({
          collectionName,
          documentCount,
          filePath,
        });

        console.log(`✅ Exported ${documentCount} documents to ${fileName}`);
      } catch (error) {
        console.error(
          `❌ Error exporting collection ${collectionName}:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    // Print summary
    console.log("\n=== Export Summary ===");
    console.log(`Environment: ${envName}`);
    console.log(`Export directory: ${exportBaseDir}`);
    console.log(`Collections exported: ${exportResults.length}`);
    console.log(`Total documents exported: ${totalDocumentsExported}`);
    console.log("\nExported collections:");
    exportResults.forEach((result) => {
      console.log(
        `  - ${result.collectionName}: ${result.documentCount} documents → ${result.filePath}`,
      );
    });

    console.log("\n✅ Database export completed successfully!");
  } catch (error) {
    console.error("Error during database export:", error);
    throw error;
  }
};
