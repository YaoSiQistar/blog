import { z } from "zod";

export const commentLimits = {
  contentMax: 500,
  nicknameMax: 24,
};

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Please enter a note.")
    .max(commentLimits.contentMax, "Keep it under 500 characters."),
  nickname: z
    .string()
    .trim()
    .max(commentLimits.nicknameMax, "Nickname must be 24 characters or fewer.")
    .optional()
    .nullable(),
});
