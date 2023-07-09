import { sql } from "../../db";
import { Car } from "./cars.schema";

export async function getCars() {
  return sql`
      SELECT
        c.id,
        plate,
        vendor,
        model,
        color,
        "userId" as ownerId,
        u.email as ownerEmail
      FROM
        cars c
      INNER JOIN users u
        ON "userId" = u.id
    `;
}

export async function getCarsByOwnerId(ownerId: number) {
  return sql`
      SELECT
        id, 
        plate, 
        vendor,
        model,
        color
      FROM
        cars
      WHERE "userId" = ${ownerId}
    `;
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
