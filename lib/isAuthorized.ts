"use server"
import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";

export const isAuthorized = async (): Promise<{ email: string; organizational_id: string } | null> => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("user_session")?.value;

    if (!sessionId) {
        return null;
    }

    try {
        const user = await validateSession(sessionId);
        return user;
    } catch (e) {
        console.error("Failed to validate session:", e);
        return null;
    }
}