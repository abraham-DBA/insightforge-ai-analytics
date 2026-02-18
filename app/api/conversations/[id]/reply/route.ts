import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { conversations, chatBotMetaData, messages } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq, and } from "drizzle-orm";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: conversationId } = await params;
        const { content } = await req.json();

        if (!content || !content.trim()) {
            return NextResponse.json({ error: "Message content is required" }, { status: 400 });
        }

        const [conv] = await db.select().from(conversations).where(eq(conversations.id, conversationId));

        if (!conv) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const [bot] = await db.select().from(chatBotMetaData).where(and(eq(chatBotMetaData.id, conv.chatbot_id), eq(chatBotMetaData.user_email, user.email)));

        if (!bot) {
            return NextResponse.json({ error: "Forbidden" }, { status: 404 });
        }

        const [newMessage] = await db.insert(messages).values({
            conversation_id: conversationId,
            role: "assistant",
            content,
        }).returning();

        return NextResponse.json({ message: newMessage }, { status: 200 });

    } catch (error) {
        console.error("Error sending reply:", error);
        return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
    }
}