import winston from "winston";
import config from "../../config";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = config.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

// Define colors for different log levels
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Add colors to winston
winston.addColors(colors);

// Define format for console
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for files (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [],
});

// Add console transport
logger.add(
  new winston.transports.Console({
    format: consoleFormat,
  })
);

// Add file transports in production
if (config.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
    })
  );

  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
    })
  );
}

export default logger;
