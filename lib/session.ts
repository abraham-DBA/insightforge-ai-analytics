import { db } from "@/app/db/client";
import { session as sessionTable, user as userTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export async function createSession(userId: string, organizationalId: string) {
    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

    await db.insert(sessionTable).values({
        id: sessionId,
        userId,
        organizationalId,
        expiresAt,
    });

    return sessionId;
}

export async function validateSession(sessionId: string) {
    const sessions = await db
        .select({
            sessionId: sessionTable.id,
            userId: sessionTable.userId,
            organizationalId: sessionTable.organizationalId,
            expiresAt: sessionTable.expiresAt,
            userEmail: userTable.email,
            userName: userTable.name,
        })
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
        .where(eq(sessionTable.id, sessionId));

    if (sessions.length === 0) {
        return null;
    }

    const session = sessions[0];

    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
        // Optionally delete expired session
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
        return null;
    }

    return {
        userId: session.userId,
        email: session.userEmail,
        organizational_id: session.organizationalId,
        name: session.userName,
    };
}

export async function deleteSession(sessionId: string) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}