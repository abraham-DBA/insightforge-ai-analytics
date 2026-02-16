import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { teamMembers } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const teamMembersData = await db.select({
            id: teamMembers.id,
            name: teamMembers.name,
            user_email: teamMembers.user_email,
            role: teamMembers.role,
            status: teamMembers.status,
            created_at: teamMembers.created_at
        }).from(teamMembers).where(eq(teamMembers.organizational_id, user.organizational_id));

        return NextResponse.json(
            {
                team: teamMembersData,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Failed to fetch team members", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}