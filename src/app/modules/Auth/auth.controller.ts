import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

/**
 * Controller handling authentication-related HTTP requests
 */
const AuthController = {
  /**
   * Registers a new user in the system
   */
  register: catchAsync(async (req, res) => {
    const result = await AuthServices.registerUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }),

  /**
   * Authenticates a user and returns access token
   */
  login: catchAsync(async (req, res) => {
    const result = await AuthServices.loginUserFromDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  }),

  /**
   * Sends password reset link to user's email
   */
  resetLink: catchAsync(async (req, res) => {
    const result = await AuthServices.resetLinkIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset link sent successfully",
      data: result,
    });
  }),

  /**
   * Processes forgot password request
   */
  forgetPassword: catchAsync(async (req, res) => {
    const result = await AuthServices.forgotPasswordIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset initialized successfully",
      data: result,
    });
  }),

  /**
   * Changes user password with authorization token validation
   */
  changePassword: catchAsync(async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Authorization token is missing",
        data: null,
      });
    }

    const result = await AuthServices.changePasswordIntoDB(req.body, token);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }),
};

export { AuthController };
