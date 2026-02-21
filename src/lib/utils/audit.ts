import { authClient } from "@/lib/auth/client";
import { useAuditStore } from "@/hooks/store/use-audit-store";
import { AuditLog } from "@/lib/schemas/audit";

export const logActivity = (
  action: AuditLog["action"],
  resourceType: AuditLog["resourceType"], 
  resourceId: string,
  details: string
) => {
  const user = authClient.getUser();
  
  if (!user) {
    return;
  }
  
  const { addLog } = useAuditStore.getState();
  
  addLog({
    userId: user.id,
    userName: user.name || user.email,
    action,
    resourceType,
    resourceId,
    details,
  });
};