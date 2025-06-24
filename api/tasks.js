import express from "express";
const router = express.Router();
export default router;
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  createTask,
  getTasksByUserId,
  updateTaskById,
  getTaskById,
  deleteTaskById,
} from "#db/queries/tasks";

router.use(requireUser);

router
  .route("/")
  .post(requireBody(["title", "done"]), async (req, res) => {
    const { title, done } = req.body;
    const task = await createTask(req.user.id, title, done);
    res.status(201).send(task);
  })
  .get(async (req, res) => {
    const tasks = await getTasksByUserId(req.user.id);
    res.send(tasks);
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

router
  .route("/:id")
  .put(requireBody(["title", "done"]), async (req, res) => {
    const id = Number(req.params.id);
    const task = await updateTaskById(id, req.body);
    res.status(200).send(task);
  })
  .delete(async (req, res) => {
    const id = Number(req.params.id);
    await deleteTaskById(id);
    res.status(204).send("Task deleted successfully.");
  });
