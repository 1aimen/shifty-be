import { organization } from "./../../../node_modules/.prisma/client/index.d";
import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";

type UserCtx = {
  id: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  organizationId: string;
};

export class TaskService {
  // ─── Create one or multiple tasks ───
  static async createTasks(
    projectId: string,
    user: UserCtx,
    tasks: Array<{
      title: string;
      description?: string;
      assigneeId?: string; // single assignee per created task allowed by payload
      startTime?: Date;
      endTime?: Date; // will map to dueTime
    }>
  ) {
    const createdTasks: Array<any> = [];

    for (const t of tasks) {
      // Employee can assign only to self
      if (
        user.role === "EMPLOYEE" &&
        t.assigneeId &&
        t.assigneeId !== user.id
      ) {
        throw new AppError(
          "Employees can only assign tasks to themselves",
          403
        );
      }

      // Manager can assign only to users in their project
      if (user.role === "MANAGER" && t.assigneeId) {
        const isInProject = await prisma.projectUser.findFirst({
          where: { userId: t.assigneeId, projectId },
        });
        if (!isInProject)
          throw new AppError("Cannot assign task to this user", 403);
      }

      // Create task (note: schema field names: createdById, dueTime)
      const task = await prisma.task.create({
        data: {
          projectId,
          title: t.title,
          description: t.description ?? null,
          createdById: user.id,
          startTime: t.startTime ?? null,
          dueTime: t.endTime ?? null,
          updatedAt: new Date(),
        },
      });

      // Assign assignee if provided or if employee creating task -> assign to self
      const assigneeId =
        t.assigneeId ?? (user.role === "EMPLOYEE" ? user.id : undefined);

      if (assigneeId) {
        // createMany with skipDuplicates to be safe (unique constraint exists)
        await prisma.taskAssignee.createMany({
          data: [
            {
              taskId: task.id,
              userId: assigneeId,
            },
          ],
          skipDuplicates: true,
        });
      }

      // fetch assignees to return richer object
      const assignees = await prisma.taskAssignee.findMany({
        where: { taskId: task.id },
      });

      createdTasks.push({ ...task, assignees });
    }

    return createdTasks;
  }

  // ─── Assign multiple users to a task ───
  static async assignUsersToTask(
    taskId: string,
    userIds: string[],
    user: UserCtx
  ) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    // Manager may only assign users that are part of the project
    if (user.role === "MANAGER") {
      for (const id of userIds) {
        const isInProject = await prisma.projectUser.findFirst({
          where: { userId: id, projectId: task.projectId },
        });
        if (!isInProject)
          throw new AppError(`Cannot assign task to user ${id}`, 403);
      }
    }

    // Create taskAssignee records (skip duplicates)
    const data = userIds.map((id) => ({ taskId, userId: id }));
    if (data.length > 0) {
      await prisma.taskAssignee.createMany({
        data,
        skipDuplicates: true,
      });
    }

    // Return current assignees
    const assigned = await prisma.taskAssignee.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });

    return assigned;
  }

  // ─── Update task ───
  static async updateTask(
    taskId: string,
    user: UserCtx,
    data: Partial<{
      title: string;
      description: string;
      assigneeId: string; // if present => create taskAssignee entry
      startTime: Date;
      endTime: Date; // will be mapped to dueTime
      status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "PENDING";
    }>
  ) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    // Employees can update only their own tasks (i.e. be an assignee)
    if (user.role === "EMPLOYEE") {
      const isAssignee = await prisma.taskAssignee.findFirst({
        where: { taskId, userId: user.id },
      });
      if (!isAssignee) throw new AppError("Cannot update others' tasks", 403);
    }

    // Managers can update only tasks related to their project users (validate later if changing assignee)
    if (user.role === "MANAGER" && data.assigneeId) {
      const isInProject = await prisma.projectUser.findFirst({
        where: { userId: data.assigneeId, projectId: task.projectId },
      });
      if (!isInProject)
        throw new AppError("Cannot assign task to this user", 403);
    }

    // If the payload includes assigneeId, create a taskAssignee row (do not overwrite task)
    if (data.assigneeId) {
      // validate assignment by role (again)
      if (user.role === "EMPLOYEE" && data.assigneeId !== user.id) {
        throw new AppError(
          "Employees can only assign tasks to themselves",
          403
        );
      }
      if (user.role === "MANAGER") {
        const isInProject = await prisma.projectUser.findFirst({
          where: { userId: data.assigneeId, projectId: task.projectId },
        });
        if (!isInProject)
          throw new AppError("Cannot assign task to this user", 403);
      }
      await prisma.taskAssignee.createMany({
        data: [{ taskId, userId: data.assigneeId }],
        skipDuplicates: true,
      });
    }

    // Normalize fields for update: map endTime -> dueTime, status alias "PENDING" -> "OPEN"
    const updatePayload: any = { updatedAt: new Date() };
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined)
      updatePayload.description = data.description;
    if (data.startTime !== undefined) updatePayload.startTime = data.startTime;
    if (data.endTime !== undefined) updatePayload.dueTime = data.endTime;
    if (data.status !== undefined) {
      const s = data.status === "PENDING" ? "OPEN" : data.status;
      updatePayload.status = s;
      if (s === "IN_PROGRESS" && !task.startedAt) {
        updatePayload.startedAt = new Date();
      }
      if (s === "COMPLETED" && !task.completedAt) {
        updatePayload.completedAt = new Date();
      }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: updatePayload,
    });

    // Optionally include assignees
    const assignees = await prisma.taskAssignee.findMany({ where: { taskId } });
    return { ...updated, assignees };
  }

  // ─── Get single task ───
  static async getTask(taskId: string, user: UserCtx) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    // load assignees
    const assignees = await prisma.taskAssignee.findMany({ where: { taskId } });

    // Employee can only view their own tasks
    if (user.role === "EMPLOYEE") {
      const isAssignee = assignees.some((a) => a.userId === user.id);
      if (!isAssignee) throw new AppError("Cannot view others' tasks", 403);
    }

    // Manager: ensure at least one assignee is part of the project (same logic as before)
    if (user.role === "MANAGER") {
      if (assignees.length === 0)
        throw new AppError("Cannot view this task", 403);
      const firstAssignee = assignees[0]!.userId;
      const isInProject = await prisma.projectUser.findFirst({
        where: { userId: firstAssignee, projectId: task.projectId },
      });
      if (!isInProject) throw new AppError("Cannot view this task", 403);
    }

    return { ...task, assignees };
  }

  // ─── Get all tasks under a project ───
  static async getTasks(projectId: string, user: UserCtx) {
    // Build where clause for tasks based on role and assignees
    if (user.role === "EMPLOYEE") {
      // employee: tasks where they are an assignee
      const tasks = await prisma.task.findMany({
        where: {
          projectId,
          assignees: { some: { userId: user.id } },
        },
        orderBy: { createdAt: "desc" },
      });
      return tasks;
    }

    if (user.role === "MANAGER") {
      // manager: tasks where any assignee belongs to the project users
      const projectUsers = await prisma.projectUser.findMany({
        where: { projectId },
      });
      const userIds = projectUsers.map((u) => u.userId);
      const tasks = await prisma.task.findMany({
        where: {
          projectId,
          assignees: { some: { userId: { in: userIds } } },
        },
        orderBy: { createdAt: "desc" },
      });
      return tasks;
    }

    // ADMIN or others: return all tasks under project
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return tasks;
  }

  // ─── Start / Stop a task ───
  static async startStopTask(
    taskId: string,
    user: UserCtx,
    action: "START" | "STOP"
  ) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    // Employee can only start/stop their own tasks
    if (user.role === "EMPLOYEE") {
      const isAssignee = await prisma.taskAssignee.findFirst({
        where: { taskId, userId: user.id },
      });
      if (!isAssignee) throw new AppError("Cannot modify others' tasks", 403);
    }

    const now = new Date();
    const data: any = { updatedAt: now };

    if (action === "START") {
      data.status = "IN_PROGRESS";
      // set startedAt if not set
      if (!task.startedAt) data.startedAt = now;
    } else {
      data.status = "COMPLETED";
      if (!task.completedAt) data.completedAt = now;
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return updated;
  }

  // ─── Update task settings ───
  static async updateTaskSettings(
    taskId: string,
    user: UserCtx,
    settings: Partial<{ customRules: string; dueTime?: Date }>
  ) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    // Employee can only update settings for their own tasks
    if (user.role === "EMPLOYEE") {
      const isAssignee = await prisma.taskAssignee.findFirst({
        where: { taskId, userId: user.id },
      });
      if (!isAssignee)
        throw new AppError("Cannot update settings of others' tasks", 403);
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { ...settings, updatedAt: new Date() },
    });

    return updated;
  }
}
