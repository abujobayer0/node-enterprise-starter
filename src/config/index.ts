import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  bcrypt_slat_rounds: process.env.BCRYPT_SLAT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  client_url: process.env.CLIENT_URL,
  reset_link_url: process.env.RESET_lINK_URL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_USER: process.env.EMAIL_USER,
  ADMIN_PROFILE_IMAGE_LINK: process.env.ADMIN_PROFILE_IMAGE_LINK,
  ADMIN_CONTACT: process.env.ADMIN_CONTACT,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_NAME: process.env.ADMIN_NAME,
};
