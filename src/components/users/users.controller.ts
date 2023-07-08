import { RequestHandler } from "express";
import { getValidated } from "../../validate";
import { CreateUserPayload } from "./users.schema";
import { getUserByEmail } from "./users.database";
import * as database from "./users.database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser: RequestHandler = async (req, res) => {
  const { body: data } = getValidated<CreateUserPayload>(req);

  try {
    const existentUser = await getUserByEmail(data.email);

    // verify that the user doesn't exist already in the db
    if (existentUser) {
      throw new Error("Este correo ya ha sido registrado");
    }

    // Encrypt password
    const encryptedPassword = await bcrypt.hash(data.password, 10);
    console.log(encryptedPassword);

    // insert the user
    const user = await database.createUser({
      ...data,
      password: encryptedPassword,
    });

    if (!user) {
      throw new Error("Hubo un problema al crear el usuario");
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      "OSIdn1o8sd7y=A(ShdosdnA?",
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    throw error;
  }
};
