export function confirmEmailTemplate(userName: string, confirmLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Confirm Your Email</h2>
      <p>Hello ${userName},</p>
      <p>Please confirm your email address by clicking the button below:</p>
      <a href="${confirmLink}" style="background:#465fff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Confirm Email</a>
      <p>If you didn’t create an account, you can ignore this message.</p>
    </div>
  `;
}
