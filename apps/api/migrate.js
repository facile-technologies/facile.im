// Umzug migration runner — schema is managed here, NOT by sync() on boot.
// Forward-only .sql migrations in ./migrations (ordered by filename), tracked in
// the SequelizeMeta table. The deploy pipeline runs `npm run migrate` before reload.
//
// Usage:
//   npm run migrate            apply all pending migrations
//   node migrate.js pending    list migrations not yet applied
//   node migrate.js up|down    umzug CLI passthrough
//
// Adding a schema change: drop a new NNNN-description.sql file in ./migrations
// (higher number = later). Use idempotent DDL where practical.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from "./src/config/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dedicated connection for migrations. `multipleStatements` lets a single .sql file
// (e.g. the 65-table baseline) execute as one batch. Kept separate from the app's
// runtime connection so the app never enables multi-statement queries.
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  dialect: "mysql",
  logging: false,
  dialectOptions: { multipleStatements: true },
});

const umzug = new Umzug({
  migrations: {
    glob: ["migrations/*.sql", { cwd: __dirname }],
    resolve: ({ name, path: filepath, context }) => ({
      name,
      up: async () => {
        const sql = fs.readFileSync(filepath, "utf8");
        if (sql.trim()) await context.query(sql);
      },
    }),
  },
  context: sequelize,
  storage: new SequelizeStorage({ sequelize, modelName: "SequelizeMeta" }),
  logger: console,
});

umzug.runAsCLI();
