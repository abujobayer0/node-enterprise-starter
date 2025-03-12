/**
 * Authentication Routes
 * Handles user registration, login, and password management
 */

import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";

import Auth from "../../middlewares/auth";
import { userRole } from "./auth.utils";

// Initialize router
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  "/register",
  validateRequest(UserValidation.registerUserValidationSchema),
  AuthController.register
);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post(
  "/login",
  validateRequest(UserValidation.loginUserValidationSchema),
  AuthController.login
);

/**
 * @route POST /api/auth/reset-link
 * @desc Generate password reset link
 * @access Public
 */
router.post("/reset-link", AuthController.resetLink);

/**
 * @route POST /api/auth/forgot-password
 * @desc Handle forgot password request
 * @access Public
 */
router.post("/forgot-password", AuthController.forgetPassword);

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private - Admin, User
 */
router.post(
  "/change-password",
  Auth(userRole.admin, userRole.user),
  AuthController.changePassword
);

export const AuthRoutes = router;
