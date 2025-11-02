export function organizationInviteTemplate(
  inviter: string,
  orgName: string,
  inviteLink: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>You’ve Been Invited to Join ${orgName}</h2>
      <p>${inviter} invited you to join their organization on our platform.</p>
      <a href="${inviteLink}" style="background:#465fff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Accept Invitation</a>
      <p>This invitation will expire in 7 days.</p>
    </div>
  `;
}
