import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/isAuthorized"
import { db } from "@/app/db/client";
import { knowledge_source } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const user = await isAuthorized();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sources = await db
        .select()
        .from(knowledge_source)
        .where(eq(knowledge_source.user_email, user.email))

    return NextResponse.json({ sources }, { status: 200 });
}