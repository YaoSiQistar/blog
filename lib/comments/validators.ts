import { z } from "zod";

export const commentLimits = {
  contentMax: 500,
  nicknameMax: 24,
};

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "请输入评论内容。")
    .max(commentLimits.contentMax, "请控制在 500 字以内。"),
  nickname: z
    .string()
    .trim()
    .max(commentLimits.nicknameMax, "昵称需不超过 24 个字符。")
    .optional()
    .nullable(),
});
