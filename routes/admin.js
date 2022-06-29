import express from "express";
import passport from "passport";
import {
  adminPassword,
  adminProfile,
  changeRecord,
  checkLogin,
  dashboard,
  deleteRecord,
  errorPage,
  forms,
  insertRecord,
  login,
  logoutUser,
  recoverPassword,
  register,
  registerAdmin,
  tables,
  updateAdminPassword,
  updateAdminProfile,
  updateRecord,
} from "../controllers/dashboardController.js";
import { checkAuthentication } from "../config/passport-local-strategy.js";
const routes = express.Router();

routes.get("/", checkAuthentication, dashboard);
routes.get("/tables", checkAuthentication, tables);
routes.get("/form", checkAuthentication, forms);
routes.get("/login", login);
routes.get("/register", register);

routes.post("/insertRecord", checkAuthentication, insertRecord);

routes.get("/deleteRecord/:id", deleteRecord);
routes.get("/updateRecord/:id", updateRecord);
routes.post("/changeRecord", checkAuthentication, changeRecord);
routes.post("/registerAdmin", registerAdmin);

routes.post(
  "/checkLogin",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: "Invalid username or password",
  }),
  checkLogin
);
routes.get("/logoutUser", logoutUser);

routes.get("/adminProfile", checkAuthentication, adminProfile);
routes.post("/updateAdminProfile", checkAuthentication, updateAdminProfile);
routes.get("/adminPassword", checkAuthentication, adminPassword);
routes.post("/updateAdminPassword", checkAuthentication, updateAdminPassword);

routes.post("/recoverPassword", recoverPassword);

routes.get("*", errorPage);

export default routes;
