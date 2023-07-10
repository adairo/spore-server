import { getValidated } from "../../validate";
import type { Response } from "express";
import { CarEditPayload, CarRegisterPayload, UpdateCarPositionPayload } from "./cars.schema";
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

export async function editCar(req: ProtectedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("No se pudo identificar al usuario");
    }

    const {
      body: data,
      params: { carId },
    } = getValidated<CarEditPayload>(req);

    // TODO
    // verificar que el usuario que está editando sea el dueño del auto o un admin

    await database.editCar(carId, data);
    res.status(200).json({ message: "Información actualizada correctamente" });
  } catch (error) {
    if (error instanceof PostgresError) {
      return res.status(500).json({ error: error.message });
    }

    throw error
  }
}

export async function updatePosition(req: ProtectedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("No se puede acceder al usuario")
    }
    const {params: {carId}, query: newPosition} = getValidated<UpdateCarPositionPayload>(req)
    const car = await database.getCarById(carId)

    if (!car) {
      throw new Error("No se puede actualizar la posición")
    }

    // Verificar que el usuario haciendo el request es el dueño del coche o administrador
    // @ts-expect-error  car.id no es una propiedad conocida por TS, pero sabemos que está presente
    if (user.id !== car.owner_id && user.role !== "admin") {
      throw new Error("No se cuentan con los permisos necesarios para esta operación")
    }

    await database.updatePosition(carId, newPosition)
    res.status(201).json({message: "Ubicación actualizada"})
  }
  catch(error) {
    if (error instanceof PostgresError) {
      return res.status(500).json({error: error.message})
    }

    throw error
  }
}