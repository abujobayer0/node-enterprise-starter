/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

/**
 * Middleware to handle requests for non-existent routes
 * Returns a standardized 404 Not Found response
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Response} JSON response with 404 status
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
    error: "The requested API endpoint does not exist",
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

export default notFound;
