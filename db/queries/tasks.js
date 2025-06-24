import db from "#db/client";

export async function createTask(userId, title, done) {
  const sql = `INSERT INTO tasks(title, done, user_id) VALUES($1, $2, $3) RETURNING *`;
  const values = [title, done, userId];

  const {
    rows: [task],
  } = await db.query(sql, values);
  return task;
}

export async function getTaskById(id) {
  const sql = `SELECT * FROM tasks WHERE id=$1`;
  const {
    rows: [task],
  } = await db.query(sql, [id]);
  return task;
}

export async function getTasksByUserId(id) {
  const sql = `
  SELECT * FROM tasks WHERE user_id = $1
  `;

  const { rows } = await db.query(sql, [id]);
  return rows;
}

export async function updateTaskById(id, updates) {
  const fields = [];
  const values = [];
  let counter = 1;

  for (const key in updates) {
    if (updates[key] !== undefined && updates[key] !== null) {
      fields.push(`${key} = $${counter}`);
      values.push(updates[key]);
      counter++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  values.push(id);

  const sql = `
    UPDATE tasks
    SET ${fields.join(", ")}
    WHERE id = $${counter}
    RETURNING *
    `;

  const { rows } = await db.query(sql, values);

  if (rows.length === 0) return undefined;

  return rows[0];
}

export async function deleteTaskById(id) {
  const sql = `DELETE FROM tasks WHERE id = $1`;
  const values = [id];
  await db.query(sql, values);
}
