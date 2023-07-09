import { sql } from "../../db";
import { Car } from "./cars.schema";

export async function getCars() {
  const cars = sql`
      SELECT
        id,
        plate,
        vendor,
        model,
        color,
        userId as ownerId
        u.email as ownerEmail
      FROM
        cars
      INNER JOIN users u
        ON ownerId = u.id
    `;

  return cars;
}

export async function registerCar(carData: Omit<Car, "id">) {
  const result = await sql`
    INSERT INTO cars ${sql(
      carData,
      "plate",
      "vendor",
      "model",
      "color",
      "userId"
    )}
    RETURNING id
  `;

  const [car] = result;
  return car;
}
