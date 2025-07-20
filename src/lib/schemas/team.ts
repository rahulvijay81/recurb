import { z } from "zod";

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "member"], {
    required_error: "Role is required",
  }),
});

export const editTeamMemberSchema = z.object({
  role: z.enum(["admin", "member"], {
    required_error: "Role is required",
  }),
});

export type InviteTeamMemberFormValues = z.infer<typeof inviteTeamMemberSchema>;
export type EditTeamMemberFormValues = z.infer<typeof editTeamMemberSchema>;