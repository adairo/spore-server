import { RequestHandler } from "express";
import { getValidated } from "../../validate";
import { CreateUserPayload, LoginPayload } from "./users.schema";
import { getUserByEmail } from "./users.database";
import * as database from "./users.database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Replace with a TOKEN_KEY env variable
const createToken = (payload: any) =>
  jwt.sign(payload, "OSIdn1o8sd7y=A(ShdosdnA?", { expiresIn: "2h" });

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

    // create user on db
    const createdUser = await database.createUser({
      ...data,
      password: encryptedPassword,
    });

    if (!createdUser) {
      throw new Error("Hubo un problema al crear el usuario");
    }

    const token = createToken({ userId: createdUser.id, role: createdUser.role });
    // attach signed token to the response
    createdUser.token = token;
    res.status(201).json(createdUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    throw error;
  }
};

export const login: RequestHandler = async (req, res) => {
  const { body: data } = getValidated<LoginPayload>(req);

  try {
    const user = await getUserByEmail(data.email);
    if (!user) {
      const error = new Error("Este usuario no existe");
      error.name = "UserNotFound";
      throw error;
    }

    const doPasswordsMatch = await bcrypt.compare(data.password, user.password);
    if (!doPasswordsMatch) {
      const error = new Error("Credenciales incorrectas");
      error.name = "InvalidCredentials";
      throw error;
    }

    const token = createToken({ userId: user.id });
    user.token = token;
    delete user.password; // remove password from response
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      let status = 500;
      if (error.name === "UserNotFound") status = 404;
      else if (error.name === "InvalidCredential") status = 400;
      res.status(status).json({ error: error.message });
    }

    throw error;
  }
};
