import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options = {};

export const getMongoClient = (): Promise<MongoClient> => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI env var. Check your local .env or CI config.",
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(process.env.MONGODB_URI, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    const client = new MongoClient(process.env.MONGODB_URI, options);
    return client.connect();
  }
};

export const closeDbConnection = async () => {
  const client = await getMongoClient();
  await client.close();
};

// Export default for backward compatibility
export default getMongoClient();
