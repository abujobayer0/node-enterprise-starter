import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { seed } from "./app/utils/seedingAdmin";
import logger from "./app/utils/logger";

// Create HTTP server
const server = createServer(app);

/**
 * Initialize database connection
 * @returns Promise<void>
 */
async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    logger.info("✅ Database connection established successfully");
  } catch (error) {
    logger.error("❌ Database connection failed", { error });
    throw error;
  }
}

/**
 * Initialize server
 * @returns Promise<void>
 */
async function startServer(): Promise<void> {
  return new Promise((resolve) => {
    server.listen(config.port, () => {
      logger.info(`🚀 Server started successfully on port ${config.port}`);
      resolve();
    });
  });
}

/**
 * Seed initial data
 * @returns Promise<void>
 */
async function seedInitialData(): Promise<void> {
  try {
    await seed();
    logger.info("✅ Admin user seeded successfully");
  } catch (error) {
    logger.warn("⚠️ Admin seeding failed", { error });
    // Continue execution even if seeding fails
  }
}

/**
 * Gracefully shutdown the application
 * @param {Error} error - The error that triggered the shutdown
 */
function gracefulShutdown(error?: Error): void {
  logger.error("🛑 Application is shutting down", { error });

  if (server) {
    server.close(() => {
      logger.info("✅ HTTP server closed");

      // Close database connection
      mongoose.connection
        .close(false)
        .then(() => {
          logger.info("✅ Database connection closed");
          process.exit(error ? 1 : 0);
        })
        .catch((err) => {
          logger.error("❌ Error closing database connection", { error: err });
          process.exit(1);
        });
    });

    // Force shutdown after timeout if graceful shutdown fails
    setTimeout(() => {
      logger.error(
        "❌ Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  } else {
    process.exit(error ? 1 : 0);
  }
}

/**
 * Main application initialization
 */
async function bootstrap(): Promise<void> {
  try {
    logger.info("🔄 Initializing application...");

    // Connect to database
    await connectDatabase();

    // Start HTTP server
    await startServer();

    // Seed initial admin data
    await seedInitialData();

    logger.info("✅ Application initialized successfully");
  } catch (error) {
    logger.error("❌ Application initialization failed", { error });
    gracefulShutdown(error instanceof Error ? error : new Error(String(error)));
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("❌ UNCAUGHT EXCEPTION! Shutting down...", { error });
  gracefulShutdown(error);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("❌ UNHANDLED REJECTION! Shutting down...", { reason });
  gracefulShutdown(
    reason instanceof Error ? reason : new Error(String(reason))
  );
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  logger.info("🛑 SIGTERM received. Shutting down gracefully");
  gracefulShutdown();
});

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  logger.info("🛑 SIGINT received. Shutting down gracefully");
  gracefulShutdown();
});

// Start the application
bootstrap();
