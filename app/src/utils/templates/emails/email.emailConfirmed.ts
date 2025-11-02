export function emailConfirmedTemplate(userName: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Email Confirmed ✅</h2>
      <p>Hi ${userName},</p>
      <p>Your email address has been successfully verified.</p>
      <p>Welcome aboard!</p>
    </div>
  `;
}
