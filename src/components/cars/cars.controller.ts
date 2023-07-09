import { getValidated } from "../../validate";
import type { Response } from "express";
import { CarRegisterPayload } from "./cars.schema";
import * as database from "./cars.database";
import { ProtectedRequest } from "../../lib/auth";
import { PostgresError } from "postgres";

export const registerCar = async (req: ProtectedRequest, res: Response) => {
  const { body: data } = getValidated<CarRegisterPayload>(req);
  try {
    if (!req.user) {
      throw new Error("No se pudo identificar al usuario");
    }
    const userId = req.user.id; // Take the user id from the token
    const car = await database.registerCar({ ...data, userId });
    res.status(201).send(car);
  } catch (error) {
    if (error instanceof PostgresError) {
      return res.status(500).json({ error: error.message });
    }

    throw error;
  }
};

export async function getCars(req: ProtectedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("No se pudo identificar al usuario");
    }
    if (user.role === "admin") {
      const cars = await database.getCars();
      return res.status(200).json(cars);
    }

    const cars = await database.getCarsByOwnerId(user.id);
    res.status(200).json(cars);
  } catch (error) {
    if (error instanceof PostgresError) {
      return res.status(500).json({ error: error.message });
    }

    throw error;
  }
}
