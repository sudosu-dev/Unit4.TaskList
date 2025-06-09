import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser("user1", "password1");
  for (let i = 0; i <= 5; i++) {
    await createTask(user.id, `Task ${i}`, false);
  }
}
