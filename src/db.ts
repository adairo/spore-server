import postgres from "postgres";
import config from "config";
import { z } from "zod";

// throws if db.url doesn't exist
const connectionString = z.string().parse(config.get("db.url"));

export type DBReturn = Promise<postgres.Row | undefined>;
export const sql = postgres(connectionString);

