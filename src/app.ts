/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import routes and middlewares
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import logger from "./app/utils/logger";
import config from "./config";

/**
 * Express application setup
 */
const app: Application = express();

/**
 * Security Middleware
 */
// Set security HTTP headers
app.use(helmet());

// Implement CORS
app.use(
  cors({
    origin: config.client_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

/**
 * Request Parsers
 */
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

/**
 * Performance Middleware
 */
// Compress all responses
app.use(compression());

/**
 * Logging Middleware
 */
// Development logging
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // Custom logging format for production
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
      {
        stream: {
          write: (message: string) => logger.http(message.trim()),
        },
      }
    )
  );
}

/**
 * Health Check Endpoint
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

/**
 * API Routes
 */
app.use("/api/v1", router);

/**
 * Root Endpoint
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: `API Server running on port: ${config.port}`,
    version: "1.0.0",
  });
});

/**
 * Error Handling Middleware
 * Note: Error handlers must be the last middleware to be used
 */
// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
