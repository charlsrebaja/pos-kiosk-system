const completionFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Manila",
});

/** Format the original completion instant; viewing a transaction never dates it anew. */
export function formatCompletionTime(completedAt: string): string {
  return completionFormatter.format(new Date(completedAt));
}
