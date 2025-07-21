import { z } from "zod";

export const auditLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  action: z.enum([
    "create",
    "update", 
    "delete",
    "import",
    "export",
    "invite",
    "remove_member",
    "change_role"
  ]),
  resourceType: z.enum([
    "subscription",
    "team_member",
    "note",
    "webhook"
  ]),
  resourceId: z.string(),
  details: z.string(),
  timestamp: z.date(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;