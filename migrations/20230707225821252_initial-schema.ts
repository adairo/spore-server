/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("user_roles", ["regular", "admin"]);
  pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    email: { type: "varchar(60)", notNull: true, unique: true },
    role: { type: "user_roles", notNull: true },
  });

  pgm.createType("car_colors", ["red", "blue"]);
  pgm.createTable("cars", {
    id: { type: "serial", primaryKey: true },
    plate: { type: "varchar(10)", notNull: true, unique: true },
    vendor: { type: "varchar(20)", notNull: true }, // marca del auto
    model: { type: "varchar(30)", notNull: true },
    color: { type: "car_colors", notNull: true },
    userId: { type: "int", references: "users" },
  });
}

// export async function down(pgm: MigrationBuilder): Promise<void> {}
