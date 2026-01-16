require("custom-env").env("test");
require("custom-env").env();
const { MongoClient } = require("mongodb");
const { setupOpenSSLForMongoMemoryServer } = require("./openssl.config");
const {
  createMongoMemoryServerWithRetry,
  cleanup,
} = require("./mongo-memory-server-utils");

// Register cleanup on process exit
process.on("exit", cleanup);
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Setup OpenSSL configuration
setupOpenSSLForMongoMemoryServer();

// Mock del modulo MongoDB che crea un'istanza per ogni test suite
jest.mock("@/lib/mongodb", () => {
  let mongoServer = null;
  let mongoClient = null;
  let mongoInstancePromise = null;

  const createMongoInstance = async () => {
    // Use a promise to ensure singleton behavior and avoid multiple initializations
    if (!mongoInstancePromise) {
      mongoInstancePromise = (async () => {
        if (!mongoServer) {
          try {
            mongoServer = await createMongoMemoryServerWithRetry();
            const uri = mongoServer.getUri();
            mongoClient = new MongoClient(uri);
            await mongoClient.connect();
          } catch (error) {
            // Reset promise on error so we can retry
            mongoInstancePromise = null;
            console.error(
              "❌ Error creating MongoDB instance:",
              error.message,
            );
            throw error;
          }
        }
        return mongoClient;
      })();
    }
    return mongoInstancePromise;
  };

  const closeMongoInstance = async () => {
    // Reset promise so next test can create a new instance
    mongoInstancePromise = null;
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch (error) {
        // Ignore errors during cleanup
      }
      mongoClient = null;
    }
    if (mongoServer) {
      try {
        await mongoServer.stop();
      } catch (error) {
        // Ignore errors during cleanup
      }
      mongoServer = null;
    }
  };

  return {
    __esModule: true,
    default: createMongoInstance(), // Lazy initialization - will be awaited when used
    getMongoClient: createMongoInstance,
    closeDbConnection: closeMongoInstance,
  };
});