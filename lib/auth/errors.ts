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
    return "邮箱或密码错误。";
  }
  if (message.includes("email not confirmed")) {
    return "请先验证邮箱后再继续。";
  }
  if (message.includes("already registered")) {
    return "该邮箱已注册，请直接登录。";
  }
  if (message.includes("password should be at least")) {
    return "密码过短，请设置更长的密码。";
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "请求过于频繁，请稍后再试。";
  }

  return error.message || "出现错误，请稍后再试。";
}
