/**
 * User Routes
 * Handles user management operations including retrieval, updates, and deletion
 */

import express from "express";
import { UserController } from "./user.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../Auth/auth.utils";

// Initialize router
const router = express.Router();

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private - Admin, User
 */
router.get(
  "/",
  Auth(userRole.user, userRole.admin),
  UserController.getAllUsers
);

/**
 * @route GET /api/users/get-me
 * @desc Get current user's profile
 * @access Private -  User
 */
router.get("/profile", Auth(userRole.user), UserController.getMe);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private - User
 */
router.get("/:id", Auth(userRole.user), UserController.getUserById);

/**
 * @route PATCH /api/users/:id
 * @desc Update user by ID
 * @access Private - User
 */
router.patch("/:id", Auth(userRole.user), UserController.updateUserById);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user by ID
 * @access Private - Admin, User
 */
router.delete(
  "/:id",
  Auth(userRole.user, userRole.admin),
  UserController.deleteUserById
);

export const UserRoutes = router;
