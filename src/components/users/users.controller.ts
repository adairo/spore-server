import { RequestHandler } from "express";
import { getValidated } from "../../validate";
import { CreateUserPayload, LoginPayload } from "./users.schema";
import { getUserByEmail } from "./users.database";
import * as database from "./users.database";
import bcrypt from "bcryptjs";
import { createToken } from "../../lib/auth";


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

    // create user on db, it only returns its id
    const newUser = await database.createUser({
      ...data,
      password: encryptedPassword,
    });

    if (!newUser) {
      throw new Error("Hubo un problema al crear el usuario");
    }

    res.status(201).json(newUser);
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

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    res.status(200).json({ token });
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
