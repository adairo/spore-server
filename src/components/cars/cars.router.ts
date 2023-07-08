import { validate } from "../../validate";
import express from "express";
import * as schema from "./cars.schema";
import * as controller from "./cars.controller";

const carsRouter = express.Router();
carsRouter.post("/", validate(schema.carRegister), controller.registerCar);

export default carsRouter