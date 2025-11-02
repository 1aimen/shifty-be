export function passwordResetConfirmationTemplate(userName: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Password Changed Successfully</h2>
      <p>Hello ${userName},</p>
      <p>Your password was successfully updated. If you didn’t make this change, please contact support immediately.</p>
      <p>Stay safe,</p>
      <p>The Security Team</p>
    </div>
  `;
}
