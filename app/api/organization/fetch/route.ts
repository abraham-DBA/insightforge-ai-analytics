import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { eq } from "drizzle-orm";
import { metadata } from "@/app/db/schema";

export async function GET() {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const [metadataRecord] = await db.select().from(metadata).where(eq(metadata.user_email, user.email));

        const organization = {
            ...(metadataRecord ?? {}),
            id: user.organizational_id
        };

        return NextResponse.json(
            {
                organization
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Metadata fetch error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}