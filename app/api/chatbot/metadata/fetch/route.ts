import { db } from "@/app/db/client";
import { chatBotMetaData, user } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const [existingMetaData] = await db.select().from(chatBotMetaData).where(eq(chatBotMetaData.user_email, user.email));

        if (!existingMetaData) {
            const [newMetaData] = await db.insert(chatBotMetaData).values({
                user_email: user.email!,
            }).returning();
            return NextResponse.json(newMetaData,{ status: 200 });
        }
        return NextResponse.json(existingMetaData,{ status: 200 });

    } catch (error) {
        console.error("Error fetching chatbot metadata:", error);
        return NextResponse.json({ error: "Failed to fetch chatbot metadata" }, { status: 500 });
    }

}