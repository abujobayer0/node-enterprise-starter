/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import config from "../../../config";
import AppError from "../../errors/AppError";
import { createToken } from "../../utils/tokenGenerateFunction";
import { TUser } from "./auth.interface";
import User from "./auth.model";
import { sendPasswordResetEmail } from "../../services/reset.email.service";

/**
 * Authentication services for user management
 */
class AuthService {
  /**
   * Registers a new user in the database
   *
   * @param {Partial<TUser>} payload - User registration data
   * @returns {Promise<Object>} User data with tokens
   * @throws {AppError} If user already exists
   */
  static async registerUserIntoDB(payload: Partial<TUser>) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      throw new AppError(httpStatus.CONFLICT, "User already exists");
    }

    // Hash the password before storing it
    const saltRounds = Number(config.bcrypt_slat_rounds) || 10;
    const hashedPassword = await bcrypt.hash(
      payload.password as string,
      saltRounds
    );

    // Create new user with hashed password
    const newUser = await User.create({
      ...payload,
      password: hashedPassword,
    });

    // Prepare JWT payload
    const jwtPayload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    // Generate authentication tokens
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    // Retrieve user data without password
    const registeredUser = await User.findOne({ email: newUser.email }).select(
      "-password"
    );

    return {
      result: registeredUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticates a user and generates tokens
   *
   * @param {Partial<TUser>} payload - Login credentials
   * @returns {Promise<Object>} User data with tokens
   * @throws {AppError} If user not found, banned, or password incorrect
   */
  static async loginUserFromDB(payload: Partial<TUser>) {
    // Find user by email
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if user is banned
    if (user.isBanned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This account has been suspended"
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      payload.password as string,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    // Prepare JWT payload
    const jwtPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Generate authentication tokens
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    // Retrieve user data without password
    const authenticatedUser = await User.findOne({ email: user.email }).select(
      "-password"
    );

    return {
      result: authenticatedUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generates and sends a password reset link to user's email
   *
   * @param {Object} payload - Object containing user email
   * @returns {Promise<void>}
   * @throws {AppError} If user not found, deleted, or banned
   */
  static async resetLinkIntoDB({ email }: { email: string }) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check user status
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted");
    }

    if (user.isBanned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This account has been suspended"
      );
    }

    // Generate reset token with short expiration
    const jwtPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      "10m"
    );

    // Create reset link with token
    const resetLink = `${config.reset_link_url}?email=${user.email}&token=${resetToken}`;

    // Send email with reset link
    await sendPasswordResetEmail(user.email, resetLink);

    return {
      message: "Password reset link has been sent to your email",
    };
  }

  /**
   * Processes forgot password request with token validation
   *
   * @param {Object} payload - Contains email, new password and token
   * @returns {Promise<Object>} Updated user data
   * @throws {AppError} If user not found or token invalid
   */
  static async forgotPasswordIntoDB(payload: {
    email: string;
    newPassword: string;
    token: string;
  }) {
    // Find user by email
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check user status
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted");
    }

    if (user.isBanned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This account has been suspended"
      );
    }

    try {
      // Verify reset token
      const decoded = jwt.verify(
        payload.token,
        config.jwt_access_secret as string
      ) as {
        id: string;
        email: string;
        role: string;
      };

      // Ensure token belongs to the user
      if (payload.email !== decoded.email) {
        throw new AppError(httpStatus.FORBIDDEN, "Invalid reset token");
      }

      // Hash new password
      const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_slat_rounds)
      );

      // Update user password
      const result = await User.findOneAndUpdate(
        { _id: decoded.id, role: decoded.role },
        { password: newHashedPassword },
        { new: true }
      ).select("-password");

      return result;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }
      throw error;
    }
  }

  /**
   * Changes user password with authorization token validation
   *
   * @param {Object} payload - Contains email and new password
   * @param {string} token - Authorization token
   * @returns {Promise<Object>} Updated user data
   * @throws {AppError} If user not found or token invalid
   */
  static async changePasswordIntoDB(
    payload: { email: string; newPassword: string },
    token: string
  ) {
    // Find user by email
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check user status
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted");
    }

    if (user.isBanned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This account has been suspended"
      );
    }

    try {
      // Verify authorization token
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as {
        id: string;
        email: string;
        role: string;
      };

      // Ensure token belongs to the user
      if (payload.email !== decoded.email) {
        throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
      }

      // Hash new password
      const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_slat_rounds)
      );

      // Update user password
      const result = await User.findOneAndUpdate(
        { _id: decoded.id, role: decoded.role },
        { password: newHashedPassword },
        { new: true }
      ).select("-password");

      return result;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }
      throw error;
    }
  }
}

export const AuthServices = {
  registerUserIntoDB: AuthService.registerUserIntoDB,
  loginUserFromDB: AuthService.loginUserFromDB,
  resetLinkIntoDB: AuthService.resetLinkIntoDB,
  forgotPasswordIntoDB: AuthService.forgotPasswordIntoDB,
  changePasswordIntoDB: AuthService.changePasswordIntoDB,
};
