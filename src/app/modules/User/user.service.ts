import httpStatus from "http-status";
import { TUser } from "../Auth/auth.interface";
import User from "../Auth/auth.model";
import AppError from "../../errors/AppError";

/**
 * Service class handling user-related business logic and database operations
 */
export class UserService {
  /**
   * Retrieves all non-deleted users from the database
   *
   * @returns {Promise<TUser[]>} Array of user objects with password field excluded
   */
  static async getAllUsers(): Promise<TUser[]> {
    try {
      return await User.find({ isDeleted: false }).select("-password");
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve users"
      );
    }
  }

  /**
   * Retrieves a specific user by their ID
   *
   * @param {string} id - The user's MongoDB ObjectId
   * @returns {Promise<TUser | null>} User object with password field excluded
   * @throws {AppError} If user not found or database operation fails
   */
  static async getUserById(id: string): Promise<TUser | null> {
    try {
      const user = await User.findById(id).select("-password");
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve user"
      );
    }
  }

  /**
   * Retrieves the current authenticated user's profile
   *
   * @param {string} id - The authenticated user's MongoDB ObjectId
   * @returns {Promise<TUser | null>} User object with password field excluded
   * @throws {AppError} If user not found or database operation fails
   */
  static async getMeForDB(id: string): Promise<TUser | null> {
    try {
      const user = await User.findById(id).select("-password");
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve user profile"
      );
    }
  }

  /**
   * Updates a user's information by their ID
   *
   * @param {string} id - The user's MongoDB ObjectId
   * @param {Partial<TUser>} updates - Object containing fields to update
   * @returns {Promise<TUser | null>} Updated user object with password field excluded
   * @throws {AppError} If user not found or database operation fails
   */
  static async updateUserById(
    id: string,
    updates: Partial<TUser>
  ): Promise<TUser | null> {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update user"
      );
    }
  }

  /**
   * Soft deletes a user by setting isDeleted flag to true
   *
   * @param {string} id - The user's MongoDB ObjectId
   * @returns {Promise<TUser | null>} Updated user object
   * @throws {AppError} If user not found or database operation fails
   */
  static async deleteUserById(id: string): Promise<TUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete user"
      );
    }
  }
}
