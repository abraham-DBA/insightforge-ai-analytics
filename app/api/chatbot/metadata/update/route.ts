import { db } from "@/app/db/client";
import { chatBotMetaData } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { color, welcome_message } = await req.json();

        // Check if metadata exists for this user
        const [existingMetaData] = await db
            .select()
            .from(chatBotMetaData)
            .where(eq(chatBotMetaData.user_email, user.email || ""));

        if (existingMetaData) {
            // Update
            const [updated] = await db
                .update(chatBotMetaData)
                .set({
                    color: color || existingMetaData.color,
                    welcome_message: welcome_message || existingMetaData.welcome_message,
                })
                .where(eq(chatBotMetaData.user_email, user.email || ""))
                .returning();

            return NextResponse.json(updated, { status: 200 });
        } else {
            // Insert
            const [inserted] = await db
                .insert(chatBotMetaData)
                .values({
                    user_email: user.email!,
                    color: color || "#4f39f6",
                    welcome_message: welcome_message || "Hi! I'm your AI assistant. Which area would you like to explore today?",
                })
                .returning();

            return NextResponse.json(inserted, { status: 200 });
        }

    } catch (error) {
        console.error("Error updating chatbot metadata:", error);
        return NextResponse.json({ error: "Failed to update chatbot metadata" }, { status: 500 });
    }
}
