export function getErrorMessage(err: any): string {
  const message = err?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message || "Something went wrong";
}
