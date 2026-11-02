import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { upload } from "../middlewares/upload";

const router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", upload.single("image"), createTask);
router.put("/:id", upload.single("image"), updateTask);
router.delete("/:id", deleteTask);

export default router;