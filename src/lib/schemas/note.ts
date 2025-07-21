import { z } from "zod";

export const noteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Note content is required"),
  authorId: z.string(),
  authorName: z.string(),
  subscriptionId: z.string(),
  createdAt: z.date(),
});

export const createNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
  subscriptionId: z.string(),
});

export type Note = z.infer<typeof noteSchema>;
export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;