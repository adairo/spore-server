import { RequestHandler } from "express";


export const registerCar: RequestHandler = (_req, res) => {
    res.status(200).send("Car registered")
}