import { z } from "zod";

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member", "viewer"], {
    message: "Role is required",
  }),
});

export const editTeamMemberSchema = z.object({
  role: z.enum(["admin", "member", "viewer"], {
    message: "Role is required",
  }),
});

export type InviteTeamMemberFormValues = z.infer<typeof inviteTeamMemberSchema>;
export type EditTeamMemberFormValues = z.infer<typeof editTeamMemberSchema>;