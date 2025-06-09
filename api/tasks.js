import express from "express";
const router = express.Router();
export default router;
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createTask } from "#db/queries/tasks";

router.use(requireUser);
router.route("/").post(requireBody(["title", "done"]), async (req, res) => {
  const { title, done } = req.body;
  const task = await createTask(req.user.id, title, done);
  res.status(201).send(task);
});

router.param("id", async (req, res, next, id) => {
  const task = await getTaskById(id);
  if (!task) return res.status(404).send("Task not found");
  if (task.user_id !== req.user.id) {
    return res.status(403).send("This is not your task.");
  }
  req.task = task;
  next();
});
