import { prisma } from "./prisma.utils";
import {
  notificationTemplates,
  NotificationType,
} from "./templates/notifications/notifications.templates";

// ---------------------- Notification Functions ----------------------

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link: string
) {
  return prisma.notification.create({
    data: { userId, type, title, message, link },
  });
}

// Use template to create notifications
export async function notify(
  userId: string,
  type: NotificationType,
  data?: Record<string, any>
) {
  const template = notificationTemplates[type];
  if (!template) throw new Error("Notification template not found");

  return createNotification(
    userId,
    type,
    template.title,
    template.message(data),
    template.link(data)
  );
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}
