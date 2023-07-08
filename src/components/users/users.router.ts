import express from "express";
import { createUserSchema, loginSchema } from "./users.schema";
import { validate } from "../../validate";
import * as controller from "./users.controller";

const usersRouter = express.Router();

usersRouter.post("/", validate(createUserSchema), controller.createUser);
usersRouter.post("/login", validate(loginSchema), controller.login)

export default usersRouter;
