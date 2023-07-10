import { validate } from "../../validate";
import express from "express";
import * as schema from "./cars.schema";
import * as controller from "./cars.controller";
import { auth } from "../../lib/auth";

const carsRouter = express.Router();
carsRouter.post(
  "/",
  auth,
  validate(schema.createCarSchema),
  controller.registerCar
);

carsRouter.get("/", auth, controller.getCars);
carsRouter.patch(
  "/:carId",
  auth,
  validate(schema.editCarSchema),
  controller.editCar
);

carsRouter.patch(
  "/:carId/updatePosition",
  auth,
  validate(schema.updatePosition),
  controller.updatePosition
);

carsRouter.delete(
  "/:carId",
  auth,
  validate(schema.deleteCar),
  controller.deleteCar
)

export default carsRouter;
