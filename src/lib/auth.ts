import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { UserToken } from "../components/users/users.schema";

const TOKEN_KEY = config.get<string>("auth.token_key");
const verifyToken = (token: string) =>
  jwt.verify(token, TOKEN_KEY) as UserToken;

export interface ProtectedRequest extends Request {
  user: UserToken;
}

export const auth = (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "Permiso denegado" });
  }
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: "Permiso denegado" });
  }
};

// Replace with a TOKEN_KEY env variable
export const createToken = (payload: any) =>
  jwt.sign(payload, TOKEN_KEY, { expiresIn: "2h" });
