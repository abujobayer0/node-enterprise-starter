import { Types } from "mongoose";

type TUserRole = "admin" | "user";

export interface TUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  contact?: string;
  role: TUserRole;
  profileImage: string;
  isBanned: boolean;
  isDeleted: boolean;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TRegisterUser {
  email: string;
  password: string;
}

export interface TLoginUser {
  email: string;
  password: TLoginUser;
}
