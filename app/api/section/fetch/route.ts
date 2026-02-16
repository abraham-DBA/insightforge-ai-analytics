import { db } from "@/app/db/client";
import { sections } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        };

        const response = await db.select().from(sections).where(eq(sections.user_email, user.email));

        return NextResponse.json({ response })

    } catch (error) {
        console.error("Error fetching sections", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
