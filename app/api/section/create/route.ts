import { db } from "@/app/db/client";
import { knowledge_source, sections } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { and, inArray, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json();
        const { name, description, tone, allowedTopics, blockedTopics, sourceIds } = body;

        if (!name || !description || !tone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
            return NextResponse.json({ error: "Atleast one source is required " }, { status: 400 })
        }

        // Verify that all sourceIds belong to the authenticated user
        const validSources = await db.select()
            .from(knowledge_source)
            .where(
                and(
                    inArray(knowledge_source.id, sourceIds),
                    eq(knowledge_source.user_email, user.email)
                )
            );

        if (validSources.length !== sourceIds.length) {
            return NextResponse.json({ error: "One or more invalid source IDs or unauthorized access" }, { status: 403 });
        }

        const section = await db.insert(sections).values({
            user_email: user.email,
            name,
            description,
            tone,
            allowed_topics: allowedTopics || null,
            blocked_topics: blockedTopics || null,
            source_ids: sourceIds,
            status: "active"
        })

        return NextResponse.json(
            {
                message: "Section created successfully",
                section
            },
            { status: 201 }
        )


    } catch (error) {
        console.error("Error creating section", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}