import db from "#db/client";

export async function createTask(userId, title, done) {
  const sql = `INSERT INTO tasks(title, done, user_id) VALUES($1, $2, $3) RETURNING *`;
  const values = [title, done, userId];

  const {
    rows: [task],
  } = await db.query(sql, values);
  return task;
}
