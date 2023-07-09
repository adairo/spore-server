import { validate } from "../../validate";
import express from "express";
import * as schema from "./cars.schema";
import * as controller from "./cars.controller";
import { auth } from "../../lib/auth";

const carsRouter = express.Router();
carsRouter.post(
  "/",
  auth,
  validate(schema.carRegister),
  controller.registerCar
);

export default carsRouter;
