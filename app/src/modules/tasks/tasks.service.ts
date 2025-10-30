// import { prisma } from "../../utils/prisma.utils";
// import { AppError } from "../../middlewares/error.middleware";

// export class TaskService {
//   // ─── Create one or multiple tasks ───
//   static async createTasks(
//     projectId: string,
//     user: { id: string; role: string },
//     tasks: Array<{
//       title: string;
//       description?: string;
//       assigneeId?: string;
//       startTime?: Date;
//       endTime?: Date;
//     }>
//   ) {
//     const createdTasks = [];

//     for (const t of tasks) {
//       // Employee can assign only to self
//       if (
//         user.role === "EMPLOYEE" &&
//         t.assigneeId &&
//         t.assigneeId !== user.id
//       ) {
//         throw new AppError(
//           "Employees can only assign tasks to themselves",
//           403
//         );
//       }

//       // Manager can assign only to employees in their project
//       if (user.role === "MANAGER" && t.assigneeId) {
//         const isInProject = await prisma.userProject.findFirst({
//           where: { userId: t.assigneeId, projectId },
//         });
//         if (!isInProject)
//           throw new AppError("Cannot assign task to this user", 403);
//       }

//       const task = await prisma.task.create({
//         data: {
//           projectId,
//           title: t.title,
//           description: t.description,
//           assigneeId:
//             t.assigneeId ?? (user.role === "EMPLOYEE" ? user.id : null),
//           startTime: t.startTime ?? null,
//           endTime: t.endTime ?? null,
//           createdBy: user.id,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });
//       createdTasks.push(task);
//     }

//     return createdTasks;
//   }

//   // ─── Assign multiple users to a task ───
//   static async assignUsersToTask(
//     taskId: string,
//     userIds: string[],
//     user: { id: string; role: string }
//   ) {
//     const task = await prisma.task.findUnique({ where: { id: taskId } });
//     if (!task) throw new AppError("Task not found", 404);

//     // Admin can assign to anyone, Manager only to project users
//     if (user.role === "MANAGER") {
//       for (const id of userIds) {
//         const isInProject = await prisma.userProject.findFirst({
//           where: { userId: id, projectId: task.projectId },
//         });
//         if (!isInProject)
//           throw new AppError(`Cannot assign task to user ${id}`, 403);
//       }
//     }

//     const assignedTasks = [];
//     for (const id of userIds) {
//       const newTask = await prisma.task.update({
//         where: { id: taskId },
//         data: { assigneeId: id, updatedAt: new Date() },
//       });
//       assignedTasks.push(newTask);
//     }

//     return assignedTasks;
//   }

//   // ─── Update task ───
//   static async updateTask(
//     taskId: string,
//     user: { id: string; role: string },
//     data: Partial<{
//       title: string;
//       description: string;
//       assigneeId: string;
//       startTime: Date;
//       endTime: Date;
//       status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
//     }>
//   ) {
//     const task = await prisma.task.findUnique({ where: { id: taskId } });
//     if (!task) throw new AppError("Task not found", 404);

//     // Role-based permission
//     if (user.role === "EMPLOYEE" && task.assigneeId !== user.id) {
//       throw new AppError("Cannot update others' tasks", 403);
//     }
//     if (user.role === "MANAGER" && task.assigneeId) {
//       const isInProject = await prisma.userProject.findFirst({
//         where: { userId: task.assigneeId, projectId: task.projectId },
//       });
//       if (!isInProject) throw new AppError("Cannot update this task", 403);
//     }

//     const updated = await prisma.task.update({
//       where: { id: taskId },
//       data: { ...data, updatedAt: new Date() },
//     });
//     return updated;
//   }

//   // ─── Get single task ───
//   static async getTask(taskId: string, user: { id: string; role: string }) {
//     const task = await prisma.task.findUnique({ where: { id: taskId } });
//     if (!task) throw new AppError("Task not found", 404);

//     if (user.role === "EMPLOYEE" && task.assigneeId !== user.id) {
//       throw new AppError("Cannot view others' tasks", 403);
//     }

//     if (user.role === "MANAGER") {
//       const isInProject = await prisma.userProject.findFirst({
//         where: { userId: task.assigneeId, projectId: task.projectId },
//       });
//       if (!isInProject) throw new AppError("Cannot view this task", 403);
//     }

//     return task;
//   }

//   // ─── Get all tasks under a project ───
//   static async getTasks(projectId: string, user: { id: string; role: string }) {
//     const where: any = { projectId };

//     if (user.role === "EMPLOYEE") {
//       where.assigneeId = user.id;
//     }

//     if (user.role === "MANAGER") {
//       const projectUsers = await prisma.userProject.findMany({
//         where: { projectId },
//       });
//       const userIds = projectUsers.map((u) => u.userId);
//       where.assigneeId = { in: userIds };
//     }

//     const tasks = await prisma.task.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//     });
//     return tasks;
//   }

//   // ─── Start / Stop a task ───
//   static async startStopTask(
//     taskId: string,
//     user: { id: string; role: string },
//     action: "START" | "STOP"
//   ) {
//     const task = await prisma.task.findUnique({ where: { id: taskId } });
//     if (!task) throw new AppError("Task not found", 404);

//     // Employee can only start/stop their own tasks
//     if (user.role === "EMPLOYEE" && task.assigneeId !== user.id) {
//       throw new AppError("Cannot modify others' tasks", 403);
//     }

//     const updated = await prisma.task.update({
//       where: { id: taskId },
//       data: {
//         status: action === "START" ? "IN_PROGRESS" : "COMPLETED",
//         updatedAt: new Date(),
//       },
//     });

//     return updated;
//   }

//   // ─── Update task settings ───
//   static async updateTaskSettings(
//     taskId: string,
//     user: { id: string; role: string },
//     settings: Partial<{ priority: string; deadline?: Date }>
//   ) {
//     const task = await prisma.task.findUnique({ where: { id: taskId } });
//     if (!task) throw new AppError("Task not found", 404);

//     if (user.role === "EMPLOYEE" && task.assigneeId !== user.id) {
//       throw new AppError("Cannot update settings of others' tasks", 403);
//     }

//     const updated = await prisma.task.update({
//       where: { id: taskId },
//       data: { ...settings, updatedAt: new Date() },
//     });
//     return updated;
//   }
// }
