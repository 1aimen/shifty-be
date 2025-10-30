// // src/modules/task/task.controller.ts
// import { Request, Response } from "express";
// import { TaskService } from "./tasks.service";
// import { AuthRequest } from "../../types/auth.types";

// /**
//  * @swagger
//  * tags:
//  *   name: Task
//  *   description: Task management endpoints
//  */

// /**
//  * @swagger
//  * /api/v1/organizations/{orgId}/projects/{projectId}/tasks:
//  *   post:
//  *     summary: Create one or multiple tasks under a project
//  *     tags: [Task]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: orgId
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *       - name: projectId
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               tasks:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     title:
//  *                       type: string
//  *                     description:
//  *                       type: string
//  *                     assignees:
//  *                       type: array
//  *                       items:
//  *                         type: string
//  *                     customRules:
//  *                       type: object
//  *     responses:
//  *       201:
//  *         description: Tasks created
//  */
// export const createTasksController = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     const { projectId } = req.params;
//     const tasks = req.body.tasks;
//     if (!Array.isArray(tasks) || tasks.length === 0) {
//       return res.status(400).json({ message: "tasks array required" });
//     }
//     const created = await TaskService.createTasks(projectId!, tasks, req.user!);
//     return res.status(201).json(created);
//   } catch (err: any) {
//     return res.status(err.status || 400).json({ message: err.message });
//   }
// };

// /**
//  * @swagger
//  * /api/v1/tasks/{taskId}/assign:
//  *   post:
//  *     summary: Assign one or multiple users to a task (Admin/Manager)
//  *     tags: [Task]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: taskId
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userIds:
//  *                 oneOf:
//  *                   - type: string
//  *                   - type: array
//  *                     items:
//  *                       type: string
//  */
// export const assignUsersToTaskController = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     if (!["ADMIN", "MANAGER"].includes(req.user.role))
//       return res.status(403).json({ message: "Forbidden" });

//     const { taskId } = req.params;
//     let { userIds } = req.body;
//     if (!Array.isArray(userIds)) userIds = [userIds];
//     const result = await TaskService.assignUsersToTask(
//       taskId!,
//       userIds,
//       req.user!
//     );
//     return res.status(200).json(result);
//   } catch (err: any) {
//     return res.status(err.status || 400).json({ message: err.message });
//   }
// };

// /**
//  * @swagger
//  * /api/v1/tasks/{taskId}:
//  *   put:
//  *     summary: Update a task
//  *     tags: [Task]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: taskId
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  */
// export const updateTaskController = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     const { taskId } = req.params;
//     const updated = await TaskService.updateTask(taskId!, req.body, req.user!);
//     return res.status(200).json(updated);
//   } catch (err: any) {
//     return res.status(err.status || 400).json({ message: err.message });
//   }
// };

// /**
//  * @swagger
//  * /api/v1/tasks/{taskId}:
//  *   get:
//  *     summary: Get a single task by ID
//  *     tags: [Task]
//  *     security:
//  *       - bearerAuth: []
//  */
// export const getTaskController = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     const { taskId } = req.params;
//     const task = await TaskService.getTask(taskId!, req.user!);
//     return res.status(200).json(task);
//   } catch (err: any) {
//     return res.status(err.status || 404).json({ message: err.message });
//   }
// };

// /**
//  * @swagger
//  * /api/v1/organizations/{orgId}/projects/{projectId}/tasks:
//  *   get:
//  *     summary: Get all tasks under a project (role filtered)
//  *     tags: [Task]
//  *     security:
//  *       - bearerAuth: []
//  */
// export const listTasksController = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     const { projectId } = req.params;
//     const tasks = await TaskService.listTasksUnderProject(
//       projectId!,
//       req.user!
//     );
//     return res.status(200).json(tasks);
//   } catch (err: any) {
//     return res.status(err.status || 400).json({ message: err.message });
//   }
// };

// /**
//  * @swagger
//  * /api/v1/tasks/{taskId}/toggle:
//  *   post:
//  *     summary: Start or stop a task ("start" or "stop" in body)
//  *     tags: [Task]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               action:
//  *                 type: string
//  *                 enum: [start, stop]
//  */
// export const toggleTaskController = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//     const { taskId } = req.params;
//     const { action } = req.body;
//     if (!["start", "stop"].includes(action))
//       return res
//         .status(400)
//         .json({ message: "action must be 'start' or 'stop'" });
//     const updated = await TaskService.toggleTask(taskId!, action, req.user!);
//     return res.status(200).json(updated);
//   } catch (err: any) {
//     return res.status(err.status || 400).json({ message: err.message });
//   }
// };
