/* eslint-disable no-console */
import config from "../../config";
import User from "../module/Auth/auth.model";
import { AuthServices } from "../module/Auth/auth.service";
import { userRole } from "../module/Auth/auth.utils";

export const seed = async () => {
  try {
    //At first check if the admin exist of not
    const admin = await User.findOne({
      role: userRole.admin,
      email: config.ADMIN_EMAIL,
      isBanned: false,
    });
    if (!admin) {
      await AuthServices.registerUserIntoDB({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        contact: config.ADMIN_CONTACT,
        role: userRole.admin || "admin",
        profileImage: config.ADMIN_PROFILE_IMAGE_LINK || "",
      });

      console.log("Admin created successfully...");
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
