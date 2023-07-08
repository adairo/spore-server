import type { RequestHandler } from "express";
import { ZodObject } from "zod";

type ValidateFunction = (schema: ZodObject<any>) => RequestHandler;

// Humble zod middleware to validate request data
export const validate: ValidateFunction =
  (schema: ZodObject<any>) => (req, res, next) => {
    const result = schema.safeParse({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // save the parsed data on the request to recover later
    // @ts-expect-error  
    req.__zod_parsed = result.data;
    next(); // call next when everything went good :)
    return undefined;  // tsconfig.json -> noImplicitReturns
  };

// Need to pass the infered type of the zod schema
export const getValidated = <TPayload>(req: Express.Request) => {
  // @ts-expect-error
  return req.__zod_parsed as TPayload;
};
