import { sql, type DBReturn } from "../../db";

export async function getUserByEmail(email: string): DBReturn {
  const result = await sql`
    SELECT
      id,
      email,
      role,
      password
    FROM
      users
    WHERE
      email = ${email}
    `;

  const [user] = result;
  return user;
}

type NewUserData = {
  email: string;
  password: string;
  role: "admin" | "regular";
};

/**
 * 
 * @param userData 
 * @returns an object with the id of the created user
 */
export async function createUser(userData: NewUserData): DBReturn {
  const result = await sql`
    INSERT INTO users ${sql(userData, "email", "password", "role")}
    RETURNING id, role, email
  `;

  const [user] = result;
  return user;
}
