import { getDb } from "./db";
import { auditLogs } from "./schema";

export async function auditLog(input: {
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  actor: string;
  ipAddress?: string;
}) {
  try {
    const db = await getDb();
    await db.insert(auditLogs).values({
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      details: input.details ?? "{}",
      actor: input.actor,
      ipAddress: input.ipAddress ?? null,
      createdAt: new Date(),
    });
  } catch (error) {
    // Audit logging should never break the main flow
    console.error("Audit log failed:", error);
  }
}
