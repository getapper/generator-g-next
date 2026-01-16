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
            // Use minimal connection options to reduce monitoring overhead
            mongoClient = new MongoClient(uri, {
              serverSelectionTimeoutMS: 5000,
              connectTimeoutMS: 5000,
              heartbeatFrequencyMS: 30000, // Reduce heartbeat frequency to minimize monitoring
              maxPoolSize: 1, // Use single connection pool
              minPoolSize: 0, // Allow pool to shrink to zero
            });
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
    // Stop MongoDB Memory Server FIRST - this prevents the monitor from reconnecting
    if (mongoServer) {
      try {
        await mongoServer.stop();
      } catch (error) {
        // Ignore errors during cleanup
      }
      mongoServer = null;
    }

    // Then close the client - this will stop all monitors and timers
    if (mongoInstancePromise) {
      try {
        const client = await mongoInstancePromise;
        if (client) {
          // Force close the client - this will stop all monitors and timers
          await client.close(true);
        }
      } catch (error) {
        // Ignore errors during cleanup - server is already stopped
      }
    }
    // Reset promise so next test can create a new instance
    mongoInstancePromise = null;
    mongoClient = null;
  };

  // Create default export - it will be resolved when imported
  const defaultPromise = createMongoInstance();

  return {
    __esModule: true,
    default: defaultPromise,
    getMongoClient: createMongoInstance,
    closeDbConnection: closeMongoInstance,
  };
});

// Global teardown to ensure MongoDB connections are closed
afterAll(async () => {
  const { closeDbConnection } = require("@/lib/mongodb");
  await closeDbConnection();
  
  // Give MongoDB time to fully close all connections and stop monitors
  // The MongoDB driver uses internal timers for monitoring that may take
  // a moment to fully clean up even after close() is called
  await new Promise((resolve) => setTimeout(resolve, 100));
});
