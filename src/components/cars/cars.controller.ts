import { getValidated } from "../../validate";
import type { Response } from "express";
import { CarRegisterPayload } from "./cars.schema";
import * as database from "./cars.database";
import { ProtectedRequest } from "../../lib/auth";
import { PostgresError } from "postgres";

export const registerCar = async (req: ProtectedRequest, res: Response) => {
  const { body: data } = getValidated<CarRegisterPayload>(req);
  const userId = req.user.id; // Take the user id from the token

  try {
    const car = await database.registerCar({ ...data, userId });
    res.status(201).send(car);
  } catch (error) {
    if (error instanceof PostgresError) {
      return res.status(400).json({ error: error.message });
    }

    throw error
  }
};
