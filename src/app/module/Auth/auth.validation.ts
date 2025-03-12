import { z } from "zod";

export const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    contact: z.string().optional(),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .nonempty("Password is required")
      .optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const UserValidation = {
  registerUserValidationSchema,
  loginUserValidationSchema,
};
