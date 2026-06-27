import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/ucp_client";

export const db = drizzle(DATABASE_URL, { schema });

export * from "./schema";
