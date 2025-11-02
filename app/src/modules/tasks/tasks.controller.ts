import { Request, Response } from "express";
import { TaskService } from "./tasks.service";
import { AuthRequest } from "../../types/auth.types";

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks:
 *   post:
 *     summary: Create new tasks under a project
 *     tags: [Tasks]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     assigneeIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 */
export const createTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = req.body.tasks;
    const user = req.body; // assuming middleware sets req.user

    const created = await TaskService.createTasks(projectId!, user, tasks);
    res
      .status(201)
      .json({ message: "Tasks created successfully", tasks: created });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/tasks/{taskId}/assign:
 *   post:
 *     summary: Assign multiple users to an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 */
export const assignUsersToTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { userIds, user } = req.body;

    const assigned = await TaskService.assignUsersToTask(
      taskId!,
      userIds,
      user
    );
    res.status(200).json({ message: "Users assigned successfully", assigned });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { data, user } = req.body;

    const updated = await TaskService.updateTask(taskId!, user, data);
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updated });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/tasks/{taskId}/settings:
 *   patch:
 *     summary: Update task settings (priority, deadline)
 *     tags: [Tasks]
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priority:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 */
export const updateTaskSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { settings, user } = req.body;

    const updated = await TaskService.updateTaskSettings(
      taskId!,
      user,
      settings
    );
    res
      .status(200)
      .json({ message: "Task settings updated successfully", task: updated });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/tasks/{taskId}/action:
 *   patch:
 *     summary: Start or stop a task
 *     tags: [Tasks]
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [START, STOP]
 */
export const startStopTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { action, user } = req.body;

    const updated = await TaskService.startStopTask(taskId!, user, action);
    res.status(200).json({
      message: `Task ${action.toLowerCase()}ed successfully`,
      task: updated,
    });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const user = req.body;

    const task = await TaskService.getTask(taskId!, user);
    res.status(200).json({ task });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks:
 *   get:
 *     summary: Get all tasks under a project
 *     tags: [Tasks]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const user = req.body;

    const tasks = await TaskService.getTasks(projectId!, user);
    res.status(200).json({ tasks });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  }
};
