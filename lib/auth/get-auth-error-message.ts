export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error !== "object") {
    return fallback;
  }

  const record = error as Record<string, unknown>;
  const nestedError =
    typeof record.error === "object" && record.error
      ? (record.error as Record<string, unknown>)
      : null;

  const code =
    (typeof record.code === "string" ? record.code : null) ??
    (nestedError && typeof nestedError.code === "string" ? nestedError.code : null);

  if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return "That email is already registered. Try signing in instead.";
  }

  if (code === "INVALID_EMAIL_OR_PASSWORD") {
    return "Invalid email or password.";
  }

  if (code === "UNTRUSTED_ORIGIN" || code === "MISSING_OR_NULL_ORIGIN") {
    return "Auth origin mismatch. Restart dev server and open the app from the same localhost URL.";
  }

  const message =
    (typeof record.message === "string" ? record.message : null) ??
    (nestedError && typeof nestedError.message === "string" ? nestedError.message : null) ??
    (typeof record.statusText === "string" ? record.statusText : null) ??
    (nestedError && typeof nestedError.statusText === "string"
      ? nestedError.statusText
      : null);

  return message || fallback;
}
