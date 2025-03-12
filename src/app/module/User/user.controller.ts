import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

/**
 * Controller handling user-related HTTP requests
 */
export class UserController {
  /**
   * Retrieves all users from the database
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();

      sendResponse<typeof users>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to retrieve users",
        data: null,
      });
    }
  }

  /**
   * Retrieves the current authenticated user's profile
   *
   * @param {Request} req - Express request object with user property from auth middleware
   * @param {Response} res - Express response object
   */
  static async getMe(req: Request, res: Response) {
    try {
      const user = await UserService.getMeForDB(req.user.id);

      sendResponse<typeof user>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to retrieve user profile",
        data: null,
      });
    }
  }

  /**
   * Retrieves a specific user by their ID
   *
   * @param {Request} req - Express request object with id parameter
   * @param {Response} res - Express response object
   */
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      if (!user) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: "User not found",
          data: null,
        });
      }

      sendResponse<typeof user>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to retrieve user",
        data: null,
      });
    }
  }

  /**
   * Updates a user's information by their ID
   *
   * @param {Request} req - Express request object with id parameter and request body
   * @param {Response} res - Express response object
   */
  static async updateUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUserById(id, req.body);

      if (!updatedUser) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: "User not found or could not be updated",
          data: null,
        });
      }

      sendResponse<typeof updatedUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to update user",
        data: null,
      });
    }
  }

  /**
   * Deletes a user by their ID
   *
   * @param {Request} req - Express request object with id parameter
   * @param {Response} res - Express response object
   */
  static async deleteUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUserById(id);

      if (!result) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: "User not found or could not be deleted",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to delete user",
        data: null,
      });
    }
  }
}
