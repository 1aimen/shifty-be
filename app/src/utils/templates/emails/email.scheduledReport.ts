export function scheduledReportTemplate(
  userName: string,
  frequency: "daily" | "weekly" | "monthly",
  reportLink: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Your ${
        frequency.charAt(0).toUpperCase() + frequency.slice(1)
      } Report is Ready 📊</h2>
      <p>Hello ${userName},</p>
      <p>Your ${frequency} performance report is now available.</p>
      <a href="${reportLink}" style="background:#465fff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">View Report</a>
    </div>
  `;
}
