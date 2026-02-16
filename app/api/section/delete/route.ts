import { db } from "@/app/db/client";
import { sections } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        };

        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Section ID is required" }, { status: 400 })
        }

        const section = await db.select().from(sections).where(eq(sections.user_email, user.email));
        if(!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 })
        }

        const response = await db.delete(sections).where(
            and(
                eq(sections.id, id),
                eq(sections.user_email, user.email)
            )
        );

        return NextResponse.json({ response })

    } catch (error) {
        console.error("Error deleting section", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}