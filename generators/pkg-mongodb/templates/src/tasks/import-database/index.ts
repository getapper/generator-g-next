import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import { createInterface } from "readline";
import mongoDao from "@/lib/mongodb/mongo-dao";
import { EJSON } from "bson";

interface ExportDirectory {
  path: string;
  name: string;
  fullPath: string;
}

/**
 * Recursively find all export directories in db-exports
 * Returns directories that contain JSON files (actual exports)
 */
const findExportDirectories = (
  basePath: string,
  currentPath: string = "",
  depth: number = 0,
): ExportDirectory[] => {
  const directories: ExportDirectory[] = [];
  const fullPath = join(basePath, currentPath);

  if (!existsSync(fullPath)) {
    return directories;
  }

  try {
    const entries = readdirSync(fullPath);

    // Check if this directory contains JSON files (it's an export directory)
    const hasJsonFiles = entries.some((entry) => entry.endsWith(".json"));

    if (hasJsonFiles && depth >= 2) {
      // We found an export directory (db-exports/{env}/{timestamp}/)
      directories.push({
        path: currentPath,
        name: currentPath.split("/").pop() || currentPath,
        fullPath,
      });
    } else {
      // Continue searching in subdirectories
      for (const entry of entries) {
        const entryPath = join(fullPath, entry);
        try {
          const stat = statSync(entryPath);
          if (stat.isDirectory()) {
            const subPath = currentPath ? `${currentPath}/${entry}` : entry;
            directories.push(
              ...findExportDirectories(basePath, subPath, depth + 1),
            );
          }
        } catch (error) {
          // Skip entries we can't read
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }

  return directories;
};

/**
 * Prompt user to select an export directory
 */
const selectExportDirectory = (
  directories: ExportDirectory[],
): Promise<ExportDirectory> => {
  return new Promise((resolve, reject) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\nAvailable export directories:");
    directories.forEach((dir, index) => {
      const parts = dir.path.split("/");
      const env = parts[0] || "unknown";
      const timestamp = parts[1] || "unknown";
      console.log(`  ${index + 1}. [${env}] ${timestamp}`);
      console.log(`     Path: ${dir.path}`);
    });

    rl.question("\nSelect export directory (enter number): ", (answer) => {
      rl.close();

      const index = parseInt(answer, 10) - 1;
      if (isNaN(index) || index < 0 || index >= directories.length) {
        reject(new Error("Invalid selection"));
        return;
      }

      resolve(directories[index]);
    });
  });
};

export const importDatabase = async () => {
  console.log("Starting database import...");

  try {
    // Show database connection information FIRST
    const mongodbUri = process.env.MONGODB_URI;
    const mongodbName = process.env.MONGODB_NAME;

    if (!mongodbUri || !mongodbName) {
      throw new Error(
        "Missing MongoDB configuration. Please check MONGODB_URI and MONGODB_NAME environment variables.",
      );
    }

    // Mask password in URI for security (if present)
    const maskedUri = mongodbUri.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");

    console.log("\n=== Target Database Information ===");
    console.log(`Server URL: ${maskedUri}`);
    console.log(`Database Name: ${mongodbName}`);
    console.log(
      "\n⚠️  WARNING: This will clear existing collections before importing!",
    );

    // Find all export directories
    const dbExportsPath = join(process.cwd(), "db-exports");
    console.log(`\nScanning export directories in: ${dbExportsPath}`);

    if (!existsSync(dbExportsPath)) {
      throw new Error(
        `Export directory not found: ${dbExportsPath}\nPlease run export task first.`,
      );
    }

    const directories = findExportDirectories(dbExportsPath);

    if (directories.length === 0) {
      throw new Error(
        "No export directories found. Please run export task first.",
      );
    }

    // Sort directories by path (most recent first if timestamps are used)
    directories.sort((a, b) => b.path.localeCompare(a.path));

    // Prompt user to select directory
    const selectedDirectory = await selectExportDirectory(directories);
    console.log(`\nSelected: ${selectedDirectory.path}`);
    console.log(`Full path: ${selectedDirectory.fullPath}`);

    // Initialize database connection
    await mongoDao.init();

    if (!mongoDao.db) {
      throw new Error("Database connection failed");
    }

    // Read all JSON files in the selected directory
    const files = readdirSync(selectedDirectory.fullPath).filter((file) =>
      file.endsWith(".json"),
    );

    if (files.length === 0) {
      throw new Error("No JSON files found in selected directory");
    }

    console.log(`\nFound ${files.length} collection files to import`);

    let totalDocumentsImported = 0;
    const importResults: Array<{
      collectionName: string;
      documentCount: number;
      success: boolean;
      error?: string;
    }> = [];

    // Import each collection
    for (const file of files) {
      const collectionName = file.replace(".json", "");
      console.log(`\n--- Importing collection: ${collectionName} ---`);

      try {
        // Read and parse EJSON file
        const filePath = join(selectedDirectory.fullPath, file);
        const fileContent = readFileSync(filePath, "utf-8");
        const documents = EJSON.parse(fileContent);

        if (!Array.isArray(documents)) {
          throw new Error("Invalid file format: expected array of documents");
        }

        const documentCount = documents.length;
        console.log(`Found ${documentCount} documents to import`);

        if (documentCount === 0) {
          console.log(`⏭️  Skipping empty collection: ${collectionName}`);
          importResults.push({
            collectionName,
            documentCount: 0,
            success: true,
          });
          continue;
        }

        // Clear existing collection (optional - you might want to make this configurable)
        console.log(`Clearing existing collection: ${collectionName}`);
        await mongoDao.db.collection(collectionName).deleteMany({});

        // Insert documents
        console.log(`Inserting ${documentCount} documents...`);
        await mongoDao.db
          .collection(collectionName)
          .insertMany(documents as any[]);

        totalDocumentsImported += documentCount;
        importResults.push({
          collectionName,
          documentCount,
          success: true,
        });

        console.log(
          `✅ Imported ${documentCount} documents to ${collectionName}`,
        );
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(
          `❌ Error importing collection ${collectionName}:`,
          errorMsg,
        );
        importResults.push({
          collectionName,
          documentCount: 0,
          success: false,
          error: errorMsg,
        });
      }
    }

    // Print summary
    console.log("\n=== Import Summary ===");
    console.log(`Import directory: ${selectedDirectory.path}`);
    console.log(`Collections processed: ${importResults.length}`);
    console.log(`Total documents imported: ${totalDocumentsImported}`);
    console.log("\nImport results:");
    importResults.forEach((result) => {
      if (result.success) {
        console.log(
          `  ✅ ${result.collectionName}: ${result.documentCount} documents imported`,
        );
      } else {
        console.log(
          `  ❌ ${result.collectionName}: ${result.error || "Unknown error"}`,
        );
      }
    });

    const successCount = importResults.filter((r) => r.success).length;
    const failCount = importResults.filter((r) => !r.success).length;

    console.log(`\n✅ Successfully imported: ${successCount} collections`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} collections`);
    }

    console.log("\n✅ Database import completed!");
  } catch (error) {
    console.error("Error during database import:", error);
    throw error;
  }
};
