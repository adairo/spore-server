import { RequestHandler } from "express";
import { getValidated } from "../../validate";
import { CreateUserPayload } from "./users.schema";
import { getUserByEmail } from "./users.database";
import * as database from "./users.database";
import bcrypt from "bcryptjs";

export const createUser: RequestHandler = async (req, res) => {
  const { body: data } = getValidated<CreateUserPayload>(req);

  const existentUser = await getUserByEmail(data.email);

  // verify that the user doesn't exist already in the db
  if (existentUser) {
    return res.status(400).json({ error: "Este correo ya ha sido registrado" });
  }

  // Encrypt password
  const encryptedPassword = await bcrypt.hash(data.password, 10);
  console.log(encryptedPassword)

  // insert the user
  const user = await database.createUser({
    ...data,
    password: encryptedPassword,
  });
  res.status(200).json(user);
};
