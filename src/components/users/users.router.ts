import express from "express";
import { createUserSchema } from "./users.schema";
import { validate } from "../../validate";
import * as controller from "./users.controller";

const usersRouter = express.Router();

usersRouter.post("/", validate(createUserSchema), controller.createUser);

export default usersRouter;
