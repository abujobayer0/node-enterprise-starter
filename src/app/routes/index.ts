import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  { path: "/user", route: UserRoutes },
];

// This will automatically loop your routes that you will add in the moduleRoutes array
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
