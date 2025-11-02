export function resetPasswordTemplate(resetLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hello ,</p>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      <a href="${resetLink}" style="background:#465fff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
}
