type SupabaseErrorLike = {
  message?: string;
  status?: number;
  code?: string;
};

const normalize = (message?: string) => message?.toLowerCase() ?? "";

export function mapSupabaseError(error?: SupabaseErrorLike | null) {
  if (!error) return null;
  const message = normalize(error.message);

  if (message.includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }
  if (message.includes("email not confirmed")) {
    return "Please confirm your email to continue.";
  }
  if (message.includes("already registered")) {
    return "That email already exists. Try signing in instead.";
  }
  if (message.includes("password should be at least")) {
    return "Password is too short. Please choose a longer one.";
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return error.message || "Something went wrong. Please try again.";
}
