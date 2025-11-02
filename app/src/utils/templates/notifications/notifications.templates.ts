// notificationTemplates.ts

export type NotificationType =
  | "USER_PROJECT_ASSIGNED"
  | "USER_PROJECT_REMOVED"
  | "USER_PROJECT_MODIFIED"
  | "USER_PROJECT_RULES_MODIFIED"
  | "USER_SHIFT_ASSIGNED"
  | "USER_SHIFT_REMOVED"
  | "USER_SHIFT_MODIFIED"
  | "USER_SHIFT_RULES_MODIFIED"
  | "USER_SHIFT_START_REMINDER"
  | "USER_TASK_ASSIGNED"
  | "USER_TASK_REMOVED"
  | "USER_TASK_MODIFIED"
  | "USER_TASK_RULES_MODIFIED"
  | "USER_TASK_START_REMINDER"
  | "USER_YOUR_ROLE_MODIFIED"
  | "ADMIN_USER_CLOCK_IN"
  | "ADMIN_USER_CLOCK_OUT"
  | "ADMIN_REPORT_READY";

export type NotificationTemplate = {
  title: string;
  message: (data?: Record<string, any>) => string;
  link: (data?: Record<string, any>) => string;
};

export const notificationTemplates: Record<
  NotificationType,
  NotificationTemplate
> = {
  USER_PROJECT_ASSIGNED: {
    title: "New Project Assigned",
    message: (data) =>
      `You have been assigned to the project "${data?.projectName}".`,
    link: (data) => `/projects/${data?.projectId}`,
  },
  USER_PROJECT_REMOVED: {
    title: "Project Removed",
    message: (data) =>
      `You have been removed from the project "${data?.projectName}".`,
    link: (data) => `/projects`,
  },
  USER_PROJECT_MODIFIED: {
    title: "Project Updated",
    message: (data) => `The project "${data?.projectName}" has been updated.`,
    link: (data) => `/projects/${data?.projectId}`,
  },
  USER_PROJECT_RULES_MODIFIED: {
    title: "Project Rules Updated",
    message: (data) =>
      `The rules for the project "${data?.projectName}" have been modified.`,
    link: (data) => `/projects/${data?.projectId}/rules`,
  },
  USER_SHIFT_ASSIGNED: {
    title: "Shift Assigned",
    message: (data) =>
      `You have been assigned to a shift on ${data?.shiftDate} (${data?.shiftTime}).`,
    link: (data) => `/shifts/${data?.shiftId}`,
  },
  USER_SHIFT_REMOVED: {
    title: "Shift Removed",
    message: (data) =>
      `Your shift on ${data?.shiftDate} (${data?.shiftTime}) has been removed.`,
    link: (data) => `/shifts`,
  },
  USER_SHIFT_MODIFIED: {
    title: "Shift Updated",
    message: (data) => `Your shift on ${data?.shiftDate} has been updated.`,
    link: (data) => `/shifts/${data?.shiftId}`,
  },
  USER_SHIFT_RULES_MODIFIED: {
    title: "Shift Rules Updated",
    message: (data) =>
      `Rules for your shift on ${data?.shiftDate} have been modified.`,
    link: (data) => `/shifts/${data?.shiftId}/rules`,
  },
  USER_SHIFT_START_REMINDER: {
    title: "Shift Reminder",
    message: (data) =>
      `Reminder: Your shift starts on ${data?.shiftDate} at ${data?.shiftTime}.`,
    link: (data) => `/shifts/${data?.shiftId}`,
  },
  USER_TASK_ASSIGNED: {
    title: "New Task Assigned",
    message: (data) => `You have been assigned the task "${data?.taskName}".`,
    link: (data) => `/tasks/${data?.taskId}`,
  },
  USER_TASK_REMOVED: {
    title: "Task Removed",
    message: (data) => `The task "${data?.taskName}" has been removed.`,
    link: (data) => `/tasks`,
  },
  USER_TASK_MODIFIED: {
    title: "Task Updated",
    message: (data) => `The task "${data?.taskName}" has been updated.`,
    link: (data) => `/tasks/${data?.taskId}`,
  },
  USER_TASK_RULES_MODIFIED: {
    title: "Task Rules Updated",
    message: (data) =>
      `Rules for the task "${data?.taskName}" have been modified.`,
    link: (data) => `/tasks/${data?.taskId}/rules`,
  },
  USER_TASK_START_REMINDER: {
    title: "Task Reminder",
    message: (data) => `Reminder: The task "${data?.taskName}" starts soon.`,
    link: (data) => `/tasks/${data?.taskId}`,
  },
  USER_YOUR_ROLE_MODIFIED: {
    title: "Role Updated",
    message: (data) => `Your role has been updated to "${data?.newRole}".`,
    link: (data) => `/profile`,
  },
  ADMIN_USER_CLOCK_IN: {
    title: "User Clocked In",
    message: (data) => `${data?.userName} has clocked in at ${data?.time}.`,
    link: (data) => `/admin/users/${data?.userId}/timesheet`,
  },
  ADMIN_USER_CLOCK_OUT: {
    title: "User Clocked Out",
    message: (data) => `${data?.userName} has clocked out at ${data?.time}.`,
    link: (data) => `/admin/users/${data?.userId}/timesheet`,
  },
  ADMIN_REPORT_READY: {
    title: "Report Ready",
    message: (data) => `The report "${data?.reportName}" is ready for review.`,
    link: (data) => `/admin/reports/${data?.reportId}`,
  },
};
