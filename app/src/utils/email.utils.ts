import { Resend } from "resend";

// templates
import { resetPasswordTemplate } from "./templates/emails/email.resetPassword";
import { passwordResetConfirmationTemplate } from "./templates/emails/email.passwordResetConfirmation";
import { organizationInviteTemplate } from "./templates/emails/email.organizationInvite";
import { confirmEmailTemplate } from "./templates/emails/email.confirmEmail";
import { emailConfirmedTemplate } from "./templates/emails/email.emailConfirmed";
import { scheduledReportTemplate } from "./templates/emails/email.scheduledReport";
import { config } from "../config";
import { moduleLogger } from "./modulelogger.utils";
// import { notificationSummaryTemplate } from "./templates/emails/email.notificationSummary";

const log = moduleLogger("EmailModule");

const resend = new Resend(config.resend_api_key);

const templates = {
  "reset-password": resetPasswordTemplate,
  "password-reset-confirmation": passwordResetConfirmationTemplate,
  "organization-invite": organizationInviteTemplate,
  "confirm-email": confirmEmailTemplate,
  "email-confirmed": emailConfirmedTemplate,
  "scheduled-report": scheduledReportTemplate,
  // "notification-summary": notificationSummaryTemplate,
} as const;

export type EmailTemplateKey = keyof typeof templates;

interface SendEmailOptions {
  to: string | string[];
  template: EmailTemplateKey;
  subject: string;
  data?: Record<string, any>;
  from?: string;
}

function callTemplate<T extends (...args: any[]) => string>(
  fn: T,
  args: Record<string, any>
): string {
  return fn(...(Object.values(args) as any[]));
}

export async function sendEmail({
  to,
  template,
  subject,
  data = {},
  from = "Acme <onboarding@resend.dev>",
}: SendEmailOptions) {
  const templateFn = templates[template];

  if (!templateFn) {
    log.error(`Unknown email template: ${template}`);
    throw new Error(`Unknown email template: ${template}`);
  }

  // Render template with provided data
  const html = callTemplate(templateFn, data);

  const { data: result, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    log.error(`Error sending email: ${error}`);
    throw error;
  }

  console.log("Email sent:", result);
  return result;
}
