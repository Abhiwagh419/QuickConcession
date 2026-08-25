export function calculateExpiryFromApproval(
  approvedAt: Date,
  duration: string,
): Date {
  const d = new Date(approvedAt);

  switch (duration) {
    case "Monthly":
      d.setMonth(d.getMonth() + 1);
      break;

    case "Quarterly":
      d.setMonth(d.getMonth() + 3);
      break;

    default:
      throw new Error("Invalid duration");
  }

  d.setDate(d.getDate() - 1);

  return d;
}
