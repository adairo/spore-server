import { RequestHandler } from "express";
import { getValidated } from "../../validate";
import { CreateUserPayload } from "./users.schema";
import { getUserByEmail } from "./users.database";
import * as database from "./users.database";

export const createUser: RequestHandler = async (req, res) => {
  const data = getValidated<CreateUserPayload>(req);

  const existentUser = await getUserByEmail(data.body.email);

  if (existentUser) {
    return res.status(400).json({ error: "Este correo ya ha sido registrado" });
  }

  const user = await database.createUser(data.body);
  res.status(200).json(user);
};
