import { sql } from "../../db";
import { Car, CarEditPayload, UpdateCarPositionPayload } from "./cars.schema";

const positionRegex = /\((-?\d+\.\d+),(-?\d+\.\d+)\)/;

const parsePosition = (position: string) => {
  const parsed = position.match(positionRegex);
  if (!parsed) {
    throw new Error("Invalid position");
  }

  return {
    lattitude: Number(parsed[1]),
    longitude: Number(parsed[2]),
  };
};

export async function getCars() {
  return sql`
      SELECT
        c.id,
        plate,
        vendor,
        model,
        color,
        "userId" as ownerId,
        u.email as ownerEmail,
        position
      FROM
        cars c
      INNER JOIN users u
        ON "userId" = u.id
    `.then(
    (cars) =>
      cars.map((car) => ({ ...car, position: parsePosition(car.position) })) // postgres returns a position as string...
  );
}

export async function getCarsByOwnerId(ownerId: number) {
  return sql`
      SELECT
        id, 
        plate, 
        vendor,
        model,
        color,
        position
      FROM
        cars
      WHERE "userId" = ${ownerId}
    `.then((cars) =>
    cars.map((car) => ({ ...car, position: parsePosition(car.position) }))
  );
}

export async function getCarById(carId: number) {
  return sql`
    SELECT
      c.id,
      plate,
      vendor,
      model,
      color,
      "userId" as owner_id,
      u.email as owner_email,
      position
    FROM
      cars c
    INNER JOIN users u
      ON "userId" = u.id
    WHERE
      c.id = ${carId}
    `
    .then((cars) => cars[0])
    .then((car) => ({ ...car, position: parsePosition(car.position) }));
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

export async function editCar(carId: number, carData: CarEditPayload["body"]) {
  return sql`
    UPDATE 
      cars 
    SET ${sql(carData)} -- dynamic columns update
    WHERE
      id = ${carId}
  `;
}

export async function updatePosition(
  carId: number,
  position: UpdateCarPositionPayload["query"]
) {
  return sql`
    UPDATE 
      cars
    SET
      position = point(${position.lattitude},${position.longitude})
    WHERE
      id = ${carId}
  `;
}
