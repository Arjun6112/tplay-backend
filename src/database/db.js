import pg from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const { DATABASE_URL, NODE_ENV } = process.env;

let db;

if (NODE_ENV === "production") {
  db = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new pg.Pool({ connectionString: DATABASE_URL });
}

export default db;

