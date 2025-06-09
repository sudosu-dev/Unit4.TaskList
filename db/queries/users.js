import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  // In practice, it is often a good idea to have a try-catch here in the data layer
  // if there is an error, return either a message or an empty array (i.g. in a get function)
  // and log the error internally from the data layer
  // In practice, DON'T return *, return select columns, certainly DON'T return password
  // BETTER - const sql = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username'
  const sql = `
        
        INSERT INTO users(username, password) VALUES($1, $2) RETURNING *
    `;
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
}

export async function getUserById(id) {
  const sql = `SELECT * FROM users WHERE id=$1`;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
