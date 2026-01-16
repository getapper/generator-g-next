const { MongoMemoryServer } = require("mongodb-memory-server");
const fs = require("fs");
const path = require("path");

// Configurazione per le porte incrementali
const PORT_RANGE = {
  start: 38200,
  end: 38300,
};

const PORT_FILE = path.join(__dirname, ".test-port-counter");

// Funzione per ottenere la prossima porta disponibile
const getNextPort = () => {
  let currentPort = PORT_RANGE.start;

  try {
    if (fs.existsSync(PORT_FILE)) {
      const portData = fs.readFileSync(PORT_FILE, "utf8");
      currentPort = parseInt(portData.trim()) || PORT_RANGE.start;
    }
  } catch (error) {
    console.warn("⚠️ Error reading port file:", error.message);
  }

  // Incrementa la porta per il prossimo test
  const nextPort = currentPort + 1;

  // Se abbiamo superato il range, ricomincia
  if (nextPort > PORT_RANGE.end) {
    currentPort = PORT_RANGE.start;
  } else {
    currentPort = nextPort;
  }

  // Salva la prossima porta disponibile
  try {
    fs.writeFileSync(PORT_FILE, currentPort.toString());
  } catch (error) {
    console.warn("⚠️ Error saving port file:", error.message);
  }

  return currentPort;
};

// Funzione per creare un'istanza MongoDB Memory Server con retry automatico
const createMongoMemoryServerWithRetry = async (maxRetries = 10) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const port = getNextPort();
      console.log(`🔄 Attempt ${attempt + 1}/${maxRetries} - Port: ${port}`);

      const mongoServer = await MongoMemoryServer.create({
        instance: { port },
        binary: {
          // Increase timeout for binary download/startup
          downloadDir: undefined, // Use default cache directory
        },
        // Increase startup timeout to 30 seconds
        startupTimeout: 30000,
      });

      console.log(
        `✅ MongoDB Memory Server started successfully on port ${port}`,
      );
      return mongoServer;
    } catch (error) {
      lastError = error;

      // Controlla se l'errore è dovuto a porta già in uso
      const isPortInUseError =
        error.message &&
        ((error.message.includes("Port") &&
          error.message.includes("already in use")) ||
          error.message.includes("StdoutInstanceError") ||
          error.message.includes("EADDRINUSE"));

      if (isPortInUseError) {
        console.warn(
          `⚠️ Port ${getNextPort()} already in use, retrying with next port...`,
        );
        // Continua con il prossimo tentativo
        continue;
      } else {
        // Se è un altro tipo di errore, non ha senso riprovare
        // Solo log se non è un timeout (i timeout sono comuni e non necessitano di log)
        if (!error.message || !error.message.includes("failed to start within")) {
          console.error(
            "❌ Error not related to port, stopping retries:",
            error.message,
          );
        }
        throw error;
      }
    }
  }

  // Se arriviamo qui, tutti i tentativi sono falliti
  console.error(
    `❌ Unable to start MongoDB Memory Server after ${maxRetries} attempts`,
  );
  throw lastError || new Error("Unable to start MongoDB Memory Server");
};

// Cleanup function to remove the port file when tests are done
const cleanup = () => {
  try {
    if (fs.existsSync(PORT_FILE)) {
      fs.unlinkSync(PORT_FILE);
      console.log("🧹 Temporary port file removed");
    }
  } catch (error) {
    console.warn("⚠️ Error removing port file:", error.message);
  }
};

module.exports = {
  createMongoMemoryServerWithRetry,
  getNextPort,
  cleanup,
  PORT_RANGE,
  PORT_FILE,
};
