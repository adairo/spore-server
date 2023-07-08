import { RequestHandler } from "express";
import { getValidated } from "../../validate";
import { CreateUserPayload } from "./users.schema";
import { getUserByEmail } from "./users.database";

export const createUser: RequestHandler = (req, res) => {
  const {
    body: { email },
  } = getValidated<CreateUserPayload>(req);

  const existentUser = getUserByEmail(email);

  if(existentUser) {
    return res.status(400).json({error: "Este correo ya ha sido registrado"})
  }
};
